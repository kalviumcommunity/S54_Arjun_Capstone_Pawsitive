import React, { useContext } from 'react'
import { signOut } from "firebase/auth"
import { auth } from '../../firebase/firebase'
import { AuthContext } from '../../context/AuthContext'
import { Button, Text } from '@chakra-ui/react'
import Message from '../../assets/message.png'
const NavChat= () => {
  const { currentUser } = useContext(AuthContext)

  return (
    <div className='navbar' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',gap:'0 6px',borderBottom:'solid 1px black' }}>
      {/* <div className="user"> */}
      {/* <img src={currentUser.photoURL} alt="" /> */}
      {/* <span>{currentUser.displayName}</span> */}
      {/* <button onClick={()=>signOut(auth)}>logout</button> */}
      {/* </div> */}
      <img width={'30vw'} src={Message} alt="" />
        <Text fontSize={{base:'2xl',md:'3xl'}}>Message</Text>
    </div>
  )
}

export default NavChat