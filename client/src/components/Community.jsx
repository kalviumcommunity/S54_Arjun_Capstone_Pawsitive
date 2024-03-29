import React, { useContext } from 'react'
import Navbar from './Navbar'
import ChatApp from '../Message/ChatApp'
import SideCom from '../sub-components/SideCom'
import { AuthContext } from '../context/AuthContext'
import Explore from '../sub-components/Explore'
import Create from '../sub-components/Create'

const Community = () => {
  const { community } = useContext(AuthContext);

  const communityComponents = {
    explore: <Explore />,
    message: <ChatApp />,
    create: <Create />
  };

  const componentToRender = communityComponents[community];

  return (
    <>
      <Navbar />
      <div style={{ display: 'flex', width: '100vw', justifyContent: 'center' }}>
        <div style={{ alignSelf: 'center', display: 'flex', height: '85vh', width: '95vw', justifyContent: 'space-around', borderTop: 'solid 2px black' }}>
          <SideCom />
          {componentToRender}
        </div>
      </div>
    </>
  )
}

export default Community
