import React from 'react'
import {
  HomeOutlined,
  ClockCircleOutlined,
  FileDoneOutlined,
  ScheduleOutlined,
  BarChartOutlined,
  FormOutlined,
  UserOutlined,
  InsertRowLeftOutlined,
  SnippetsOutlined
} from '@ant-design/icons'

export const HOME_SIDER_MENU_LIST = [
  {
    path: '/home/index',
    icon: <HomeOutlined />,
    name: 'homePage'
  },
  {
    path: '/home/upload',
    icon: <ClockCircleOutlined />,
    name: 'Upload'
  },
  {
    path: '/home/poster',
    icon: <ClockCircleOutlined />,
    name: 'Post'
  },
  {
    path: '/home/todoList',
    icon: <FileDoneOutlined />,
    name: 'Project Overview',
  },
  {
    path: '/home/todayTask',
    icon: <ScheduleOutlined />,
    name: 'To-do List'
  },
  {
    path: '/home/log',
    icon: <SnippetsOutlined />,
    name: 'Team log'
  },
  {
    path: '/home/company',
    icon: <InsertRowLeftOutlined />,
    name: 'new Team'
  },
  {
    path: '',
    icon: <BarChartOutlined />,
    name: 'Data Manage',
    children: [
      {
        path: '/home/capitalFlow',
        name: 'Published',
      },
      {
        path: '/home/capitalFlow/type',
        name: 'Paper classiy',
      }
    ]
  },
  {
    path: '',
    icon: <FormOutlined />,
    name: 'paper Edit ',
    children: [
      {
        path: '/home/memorandum',
        name: 'Paper List',
      },
      {
        path: '/home/memorandum/create',
        name: 'new paper',
      }
    ]
  },
  {
    path: '/home/setting/base',
    icon: <UserOutlined />,
    name: 'home'
  }
]

export const SETTING_SIDER_MENU_LIST = [
  {
    path: '/home/setting/base',
    name: 'home'
  },
  {
    path: '/home/setting/innerMessage',
    name: 'message'
  },
  {
    path: '/home/setting/notification',
    name: 'info'
  },
  {
    path: '/home/setting/account',
    name: 'account'
  },
  {
    path: '/home/setting/saving',
    name: 'save'
  },
]
