import React, { useEffect, useState, useMemo } from 'react'
import './style.less'
import Avatar from '@/components/avatar'
import dayjs from 'dayjs'
import { Layout, Badge, Popover, Empty } from 'antd'
import { Link } from 'react-router-dom'
import { HomeMainState } from '@/pages/One/index.tsx'
import { useAppSelector } from '@/hooks'
import { fullscreen, exitFullscreen, logout } from '@/utils'
import {
  PoweroffOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BellFilled,
  BugFilled,
  GithubOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined
} from '@ant-design/icons'

const { Header } = Layout
const popoverList = [
  { name: '个人中心', path: '/home/setting/base' },
  { name: '消息通知', path: '/home/setting/notification' },
  { name: '账号设置', path: '/home/setting/account' },
  { name: '保存', path: '/home/setting/saving' }
]

type Props = HomeMainState

const PopoverContent = (
  <div className="popover-content">
  {popoverList.map(el => (
    <Link to={el.path} key={el.name} className="ls">{el.name}</Link>
  ))}
    <div className="ls sign-out" onClick={logout}>
      <PoweroffOutlined style={{ fontSize: '14px', marginRight: '5px' }} />
      exist
    </div>
  </div>
)

const HomeHeader: React.FC<Props> = function () {
  const [messageList, setMessageList] = useState([])
  const [unReadCount, setUnReadCount] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const { userInfo } = useAppSelector(state => state.user)


  const MessageContent = useMemo(() => (
    <div className="message-popover">
      <div className="msg-header item-block">
        <span className="left">In-site message notification</span>
        <Link className="right" to="/home/setting/notification">Message reception management</Link>
      </div>
      {messageList.length > 0 ? (
        <>
          {messageList?.map((item: any) => (
          <div className="item-block ls" key={item.id}>
            <div className="content">{item.content}</div>
            <div className="date">{item.createdAt}</div>
          </div>
        ))}
        <Link className="item-block ls" to="/home/setting/innerMessage">查看更多</Link>
        </>
      ) : (
        <Empty style={{ padding: '20px 0' }} />
      )}
    </div>
  ), [messageList])

  function handleFullscreen() {
    setIsFullscreen(isFullscreen => {
      isFullscreen ? exitFullscreen() : fullscreen()
      return !isFullscreen
    })
  }

  return (
    <Header>
      <div className="left">
          <MenuUnfoldOutlined
            style={{ cursor: 'pointer', fontSize: '20px' }}
          />
      </div>
      <ul className="right">
        <Popover content={MessageContent}>
          <li>
            <Badge dot={unReadCount > 0}>
              <BellFilled />
            </Badge>
          </li>
        </Popover>
        <li onClick={handleFullscreen}>
          {isFullscreen ? <FullscreenOutlined /> : <FullscreenExitOutlined />}
        </li>
        <Popover
          placement="bottomRight"
          content={PopoverContent}
        >
        <li>
          <Avatar src={userInfo.avatarUrl} />
          <span className="username">{userInfo.username}</span>
        </li>
        </Popover>
      </ul>
    </Header>
  )
}

export default HomeHeader
