import React from 'react'
import Sidebar from './chat-components/Sidebar'
import Chat from './chat-components/Chat'

const ChatApp = () => {
  return (
    <div className='home'>
      <div className="container">
        <Sidebar/>
        <Chat/>
      </div>
    </div>
  )
}

export default ChatApp