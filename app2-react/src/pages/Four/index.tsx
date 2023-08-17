import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button, Input, Tooltip, Popconfirm, Card, DatePicker, Space } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';
import './TodoListPage.css';

const initialTasks = {
  todo: [
    {id: 'task-1', content: 'Task 1', startDate: moment('2023-07-14'), endDate: moment('2023-07-14')},
    {id: 'task-2', content: 'Task 2', startDate: moment('2023-07-15'), endDate: moment('2023-07-15')},
  ],
  inProgress: [],
  done: [],
};

const TodoListPage = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTaskContent, setNewTaskContent] = useState('');
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [searchDate, setSearchDate] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:7003/api/tasks/get?username=${localStorage.getItem("name")}`);
        const fetchedTasks = response.data;

        // Transform tasks into the required format
        const transformedTasks = fetchedTasks.reduce((acc, task) => {
          let status;
          switch (task.status) {
            case 'pending':
              status = 'todo';
              break;
            case 'inProgress':
              status = 'inProgress';
              break;
            case 'done':
              status = 'done';
              break;
            default:
              status = 'todo';
          }

          return {
            ...acc,
            [status]: [
              ...acc[status],
              {
                id: task.id,
                content: task.content,
                startDate: moment(task.startDate),
                endDate: moment(task.endDate),
              },
            ],
          };
        }, {todo: [], inProgress: [], done: []});

        setTasks(transformedTasks);
      } catch (error) {
        console.error('An error occurred while fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);


  useEffect(() => {
    if (searchResults.length > 0) {
      setSelectedTask(searchResults[0]);
      setEditingContent(searchResults[0].content);
    } else {
      setSelectedTask(null);
    }
  }, [searchResults]);

  const handleDragEnd = async (result) => {
    const { destination, source } = result;

    if (!destination) return;

    if (
      destination.droppableId !== source.droppableId ||
      destination.index !== source.index
    ) {
      const sourceTasks = [...tasks[source.droppableId]];
      const destinationTasks = [...tasks[destination.droppableId]];
      const [removedTask] = sourceTasks.splice(source.index, 1);
      destinationTasks.splice(destination.index, 0, removedTask);

      const newTasks = {
        ...tasks,
        [source.droppableId]: sourceTasks,
        [destination.droppableId]: destinationTasks,
      };

      setTasks(newTasks);

      // Update the task status in the database
      await updateTaskStatus({
        ...removedTask,
        status: destination.droppableId,
      });
    }
  };

  const updateTaskStatus = async (task) => {
    console.log(task)
    try {
      const response = await axios.post(`http://localhost:7003/api/tasks/update`, {
        id: task.id,
        content: task.content,
        startDate: task.startDate.toISOString(),
        endDate: task.endDate.toISOString(),
        status: mapTaskStatus(task.status),
      });

      if (response.data.success) {
        console.log('Task status updated successfully.');
      } else {
        console.error('Task status update was unsuccessful');
      }
    } catch (error) {
      console.error('An error occurred while updating the task status:', error);
    }
  };

  const mapTaskStatus = (status) => {
    switch (status) {
      case 'todo':
        return 'pending';
      case 'inProgress':
        return 'inProgress';
      case 'done':
        return 'done';
      default:
        return 'pending';
    }
  };
  const handleNewTaskChange = (e) => {
    setNewTaskContent(e.target.value);
  };

  const handleNewTaskCreate = async () => {
    if (newTaskContent.trim() === '') return;

    const newTask = {
      username: localStorage.getItem('name'),
      content: newTaskContent.trim(),
      startDate: selectedStartDate ? selectedStartDate.toISOString() : null,
      endDate: selectedEndDate ? selectedEndDate.toISOString() : null,
      status: 'pending',
    };

    try {
      const response = await axios.post('http://localhost:7003/api/tasks/create', newTask);

      if (response.data.success) {
        // If the task was successfully created, add it to the local state.
        // Make sure the newTask object matches the shape of your existing tasks.
        newTask.id = `task-${tasks.todo.length + 1}`; // Assuming the API doesn't return an ID, we generate one

        setTasks({
          ...tasks,
          todo: [...tasks.todo, newTask], // Add the new task to the tasks.todo array
        });

        setNewTaskContent('');
        setSelectedStartDate(null);
        setSelectedEndDate(null);
      } else {
        // Handle unsuccessful task creation
        console.error('Task creation was unsuccessful');
      }
    } catch (error) {
      // Handle other errors
      console.error('An error occurred while creating the task:', error);
    }
  };


  const handleDeleteTask = async (taskId) => {
    // Delete the task from the server
    try {
      const response = await axios.post(`http://localhost:7003/api/tasks/delete?id=${taskId}`);

      if (response.data.success) {
        console.log('Task deleted successfully.');

        // Now remove the task from the local state
        const updatedTasks = { ...tasks };
        Object.keys(updatedTasks).forEach((status) => {
          updatedTasks[status] = updatedTasks[status].filter(
            (task) => task.id !== taskId
          );
        });
        console.log(updatedTasks)
        setTasks(updatedTasks);
        setSelectedTask(null);

      } else {
        console.error('Task deletion was unsuccessful');
      }
    } catch (error) {
      console.error('An error occurred while deleting the task:', error);
    }
  };


  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setEditingContent(task.content);
  };

  const handleStartDateChange = (date) => {
    setSelectedStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setSelectedEndDate(date);
  };

  const handleSearchDate = () => {
    const searchTasks = tasks.todo.filter(task =>
      moment(task.startDate).isSame(searchDate, 'day')
    );

    setSearchResults(searchTasks);
  };

  const handleContentEdit = (e) => {
    setEditingContent(e.target.value);
  };

  const handleContentSubmit = (taskId) => {
    const updatedTasks = { ...tasks };
    Object.keys(updatedTasks).forEach((status) => {
      updatedTasks[status] = updatedTasks[status].map(task =>
        task.id === taskId ? { ...task, content: editingContent } : task
      );
    });

    setTasks(updatedTasks);
  };

  return (
    <div className="todo-list-page">
      <h1>Task Status</h1>
      <div className="new-task-container">
        <Input
          value={newTaskContent}
          onChange={handleNewTaskChange}
          placeholder="Enter new task"
        />
        <DatePicker
          value={selectedStartDate}
          onChange={handleStartDateChange}
          placeholder="Start Date"
        />
        <DatePicker
          value={selectedEndDate}
          onChange={handleEndDateChange}
          placeholder="End Date"
        />
        <Button type="primary" onClick={handleNewTaskCreate}>
          Add Task
        </Button>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="task-list-container">
          {Object.keys(tasks).map((status) => (
            <div className="task-column" key={status}>
              <h4>{status}</h4>
              <Droppable droppableId={status}>
                {(provided) => (
                  <ul
                    className="task-list"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {tasks[status].map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <li
                            className="task-item"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => handleTaskClick(task)}
                          >
                            {task.content}
                            <Popconfirm
                              title="Are you sure to delete this task?"
                              onConfirm={() => handleDeleteTask(task.id)}
                              okText="Yes"
                              cancelText="No"
                            >
                              <Tooltip title="delete">
                                <Button
                                  shape="circle"
                                  icon={<CloseOutlined />}
                                  size="small"
                                />
                              </Tooltip>
                            </Popconfirm>
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
      <Space style={{marginTop:"2rem"}}>
        <DatePicker
          onChange={setSearchDate}
          placeholder="Search Date"
        />
        <Button onClick={handleSearchDate}>Search</Button>
      </Space>
      {selectedTask && (
        <div className="task-details">
          <h3>Task Details</h3>
          <Card title="Content" className="task-card">
            <Input
              value={editingContent}
              onChange={handleContentEdit}
              onPressEnter={() => handleContentSubmit(selectedTask.id)}
              onBlur={() => handleContentSubmit(selectedTask.id)}
            />
          </Card>
          <Card title="Start Date" className="task-card">
            <p>
              {selectedTask.startDate
                ? moment(selectedTask.startDate).format('YYYY-MM-DD')
                : ''}
            </p>
          </Card>
          <Card title="End Date" className="task-card">
            <p>
              {selectedTask.endDate
                ? moment(selectedTask.endDate).format('YYYY-MM-DD')
                : ''}
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TodoListPage;
