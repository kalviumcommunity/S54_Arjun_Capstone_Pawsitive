import React, { useContext } from 'react'
import Sidebar from './chat-components/Sidebar'
import Chat from './chat-components/Chat'
import { Box, useConst } from '@chakra-ui/react'
import { AuthContext } from '../context/AuthContext'

const ChatApp = () => {
  const {mob}=useContext(AuthContext)
  return (
    <>
      <div className='home'>
        {/* //desktop */}
        <Box className="container" display={{ base: 'none !important ', md: 'flex !important' }}>
          <Sidebar />
          <Chat />
        </Box>
        {/* Mobile */}
        <Box className="container" display={{ base: 'flex !important' , md: 'none !important'}}>
          {mob?<Chat/>:<Sidebar/>}
        </Box>
      </div>
    </>
  )
}

export default ChatApp