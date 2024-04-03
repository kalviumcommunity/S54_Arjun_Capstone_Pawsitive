import { doc, getDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase/firebase';
import { Box, Button, HStack, Image, Text, VStack } from '@chakra-ui/react';
import Navbar from './Navbar';
import Message from '../assets/message.png'
import edit from '../assets/edit.png'
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { uid } = useParams();
  const {currentUser}=useContext(AuthContext)
  const [user, setUser] = useState({});
  const [own,setOwn]=useState(false)
  const getUser = async () => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setUser(userData);
        console.log(currentUser)
        if(user.uid==currentUser.uid){
          setOwn(true)
        }
        console.log("User data:", userData);
      } else {
        console.log("No such document!");
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  }
  useEffect(() => {
    getUser();
  }, [currentUser]);

  return (
    <>
      <Navbar />
      <div style={{ width: '100vw', display: 'flex', justifyContent: 'center' }}>
        <VStack>
          <Image src={user.photoURL} borderRadius={'50%'} alt="" w={{ base: '35vw', md: '12vw' }} />
          {/* <button><img id='msg-pic' src={Message} alt="" /></button> */}
          <HStack ml={'1vw'}>
            <Text fontWeight={'600'} fontSize={'3xl'}>{currentUser.displayName} </Text>
            <img  src={own?edit:Message} alt="" style={{width:own?'2vw':'1vw',cursor:'pointer'}}/>
          </HStack>
          <Text>{user.bio}</Text>
        </VStack>
      </div>
    </>
  );
}

export default Profile;
