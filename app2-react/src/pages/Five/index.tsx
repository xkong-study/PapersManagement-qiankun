import React, { useState,useRef,useEffect } from 'react';
import { Button, List,Upload, Avatar, message, Steps,Tag, Input, Card, AutoComplete } from "antd";
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import { TweenOneGroup } from 'rc-tween-one';
import { UploadOutlined } from '@ant-design/icons';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import axios from 'axios';


const { Step } = Steps;
const { Dragger } = Upload;
const One = () => {
    const [workbook, setWorkbook] = useState(null)
    const [jsonData, setJsonData] = useState([])
    const [current, setCurrent] = useState(0)
    const [cite, setCite] = useState("")
    const [abstract, setAbstract] = useState("");
    const [title, setTitle] = useState("");
    const [authorName, setAuthorName] = useState('');
    const [collaborators, setCollaborators] = useState([
      { value: 'Dr. John Smith' },
      { value: 'Prof. Jane Doe' },
      { value: 'Dr. Emily Johnson' },
      { value: 'Dr. Michael Brown' },
      { value: 'Prof. James Davis' },
      { value: 'Dr. Patricia Garcia' },
      { value: 'Prof. Robert Martinez' },
      { value: 'Dr. Elizabeth Hernandez' },
      { value: 'Dr. Jennifer Lopez' },
      { value: 'Prof. William Gonzalez' }
    ]);
    const [keywords, setKeywords] = useState(['Keyword 1', 'Keyword 2', 'Keyword 3']);
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef<Input>(null);
    const [tags, setTags] = useState([]);
    const [demoTags, setDemoTags] = useState(['Tag 1', 'Tag 2', 'Tag 3']);

    useEffect(() => {
      if (inputVisible) {
        inputRef.current?.focus();
      }
    }, [inputVisible]);

    const handleClose = (removedTag: string) => {
      const newTags = tags.filter((tag) => tag !== removedTag);
      console.log(newTags);
      setTags(newTags);
    };

    const showInput = () => {
      setInputVisible(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    };

    const handleInputConfirm = () => {
      if (inputValue && tags.indexOf(inputValue) === -1) {
        setTags([...tags, inputValue]);
      }
      setInputVisible(false);
      setInputValue('');
    };

    const forMap = (tag: string) => {
      const tagElem = (
        <Tag
          closable
          onClose={(e) => {
            e.preventDefault();
            handleClose(tag);
          }}
        >
          {tag}
        </Tag>
      );
      return (
        <span key={tag} style={{ display: 'inline-block' }}>
        {tagElem}
      </span>
      );
    };

  const tagChild = tags.map(forMap);
  const demoTagChild = demoTags.map(forMap);
  const handleCollaboratorsChange = (value: string) => {
    const collaboratorNames = value.split(',').map((collaborator) => collaborator.trim());
    setCollaborators(collaboratorNames.map(name => ({ value: name })));
    collaboratorNames.forEach(name => handleAddCollaborator(name));
    console.log(collaboratorNames);
  };

  const [selectedCollaborators, setSelectedCollaborators] = useState([]);

  const handleAddCollaborator = (collaboratorName) => {
    if (!selectedCollaborators.includes(collaboratorName)) {
      setSelectedCollaborators([...selectedCollaborators, collaboratorName]);
    }
  };

  const [uploadStatus, setUploadStatus] = useState(''); // New state variable

  const handleFileUpload = (options) => {
    const { onSuccess, onError, file, onProgress } = options;

    const formData = new FormData();
    formData.append('paper', file);
    formData.append('author', authorName);

    console.log(authorName)

    axios.post('http://localhost:7002/api/paper/upload/paper', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: ({ total, loaded }) => {
        onProgress({ percent: Math.round(loaded / total * 100) }, file);
      },
    })
      .then((res) => {
        onSuccess(res.data.message, file);
        message.success(`${file.name} file uploaded successfully.`);
      })
      .catch((err) => {
        const error = new Error('Some error occurred while uploading the file');
        error.response = err.response;
        onError({ event: error });
        message.error(`${file.name} file upload failed.`);
      });
  };

  const checkPaper = () => {
    if (!cite) {
      message.error("Please enter a citation for the paper.")
    }
    if (!abstract) {
      message.error("Please enter an abstract for the paper.")
    }
    if (!title) {
      message.error("Please enter a title for the paper.")
    }
    if (!tags.length) {
      message.error("Please enter at least one tag for the paper.")
    }
    if (!selectedCollaborators.length) {
      message.error("Please enter at least one collaborator for the paper.")
    }
  }

  const steps = [
      {
        title: 'Upload PDF',
        content: (
          <div>
            <div style={{marginBottom:"5px"}}>
            Author:<input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Author name"
            />
            </div>
            <Dragger customRequest={handleFileUpload} accept=".pdf" multiple={true}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                banned files.
              </p>
            </Dragger>
          </div>
        ),
      },
      {
        title: 'Submit Info',
        content: (
          <>
            <h2 style={{ textAlign: 'left' }}>Paper Title</h2>
            <Input.TextArea
              rows={2}
              placeholder="Enter the title of the paper"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                borderColor: '#1890ff', // Border color
                borderRadius: '5px', // Rounded borders
                padding: '10px', // Some spacing between border and text
                marginTop: '10px', // Spacing to the top
                marginBottom: '10px', // Spacing to the bottom
              }}
            />
            <h2 style={{ textAlign: 'left' }}>Paper Abstract</h2>
            <Input.TextArea
              rows={4}
              placeholder="Enter the abstract of the paper"
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              style={{
                borderColor: '#1890ff', // Border color
                borderRadius: '5px', // Rounded borders
                padding: '10px', // Some spacing between border and text
                marginTop: '10px', // Spacing to the top
                marginBottom: '10px', // Spacing to the bottom
              }}
            />
            <h2 style={{ textAlign: 'left' }}>Paper Cite</h2>
            <Input.TextArea
              rows={4}
              placeholder="Enter the cite of the paper"
              value={cite}
              onChange={(e) => setCite(e.target.value)}
              style={{
                borderColor: '#1890ff', // Border color
                borderRadius: '5px', // Rounded borders
                padding: '10px', // Some spacing between border and text
                marginTop: '10px', // Spacing to the top
                marginBottom: '10px', // Spacing to the bottom
              }}
            />
          </>
        ),
      },
      {
        title: 'Add Keywords',
        content: (
          <>
            <h2 style={{ textAlign: 'center' }}>Add Tags to Paper</h2>
            <p style={{ textAlign: 'center' }}>Please add relevant tags to your paper. This will help others to find your work more easily.</p>
            <Card style={{ marginBottom: 16 }}>
              <TweenOneGroup
                enter={{
                  scale: 0.8,
                  opacity: 0,
                  type: 'from',
                  duration: 100,
                }}
                onEnd={(e) => {
                  if (e.type === 'appear' || e.type === 'enter') {
                    (e.target as any).style = 'display: inline-block';
                  }
                }}
                leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
                appear={false}
              >
                <div>For example:  {demoTagChild}</div>
                <div>Users:  {tagChild}</div>
              </TweenOneGroup>
              {inputVisible && (
                <Input
                  ref={inputRef}
                  type="text"
                  size="small"
                  style={{ width: 78 }}
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputConfirm}
                  onPressEnter={handleInputConfirm}
                />
              )}
              {!inputVisible && (
                <Tag onClick={showInput} style={{ background: '#fff', borderStyle: 'dashed',marginTop:'2rem' }}>
                  <PlusOutlined /> New Tag
                </Tag>
              )}
            </Card>
          </>
        ),
      },
      {
        title: 'Add Collaborators',
        content: (
          <>
            <h2 style={{ textAlign: 'center' }}>Add Collaborators</h2>
            <p style={{ textAlign: 'center' }}>Please enter the names of any collaborators on this paper.</p>
            <AutoComplete
              style={{ width: '100%' }}
              options={collaborators}
              placeholder="Enter names of collaborators, separated by commas"
              onSelect={handleCollaboratorsChange}
            />
            <List
              style={{ marginTop: '20px' }}
              header={<div>Selected Collaborators</div>}
              bordered
              dataSource={selectedCollaborators}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar icon={<UserOutlined />} />
                    }
                    title={item}
                  />
                  <Tag color="blue">Collaborator</Tag>
                </List.Item>
              )}
            />
          </>
        ),
      },
      {
        title: 'Submit Paper',
        content: (
          <>
            <h2 style={{ textAlign: 'center' }}>Paper Submission</h2>
            <p style={{ textAlign: 'center' }}>By clicking submit, you confirm that all information is accurate and that you have the rights to distribute this paper.</p>
            <Button type="primary" block onClick={checkPaper}>
              Check
            </Button>
          </>
        ),
      }
    ];

  const uploadPaperData = () => {
    console.log(title, abstract, cite, tags, selectedCollaborators)
    let array = selectedCollaborators
    array.push(authorName)
    const paperData = {
      "title": title,
      "abstracts": abstract,
      "cite": cite,
      "date": new Date().toISOString().split('T')[0], // The current date
      "tags": tags,
      "collaborators": array
    };

    axios.post('http://localhost:7002/api/paper/upload/paper_data', paperData, {
      headers: {
        "Content-Type": "application/json"
      }
    }).then((response) => {
        console.log(response)
        message.success("Paper data uploaded successfully!");
      })
      .catch((error) => {
        message.error("An error occurred while uploading paper data.");
      });
  };

  const handleUpload = () => {
    console.log('handleUpload')
    if (!cite) {
      message.error("Please enter a citation for the paper.")
      return
    }
    if (!abstract) {
      message.error("Please enter an abstract for the paper.")
      return
    }
    if (!title) {
      message.error("Please enter a title for the paper.")
      return
    }
    if (!tags.length) {
      message.error("Please enter at least one tag for the paper.")
      return
    }
    uploadPaperData()
  }

  const next = () => setCurrent(current + 1)
  const prev = () => setCurrent(current - 1)


  return (
    <div style={{ width: '140%', maxWidth: '900px', margin: '0 auto' }}>
      <Steps current={current} style={{ marginTop: '20px' }}>
        {steps.map((item, index) => (
          <Step key={index} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content" style={{ width: '90%', minHeight: '400px', margin: 'auto', marginTop: '20px', padding: '20px', border: '1px solid #ddd' }}>
        {steps[current].content}
      </div>
      <div
        className="steps-action"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '20px'
        }}
      >
        {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
            Previous
          </Button>
        )}
        <div></div>
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={handleUpload}>
            Upload
          </Button>
        )}
      </div>
    </div>
  )
}

export default One;
