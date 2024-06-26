import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { db } from "../../firebase/firebase";
import { Avatar, Box, Spinner, Text } from "@chakra-ui/react";

const Chats = () => {
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { currentUser, setMob } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = async () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        const data = doc.data();
        // Check if data exists and is not an empty object before setting chats
        if (data) {
          setChats(data);
        }
        setIsLoading(false);
        console.log("data: ", chats);
      });
      return () => unsub();
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
    setMob(true);
  };

  const CutMessage = (message, maxLength) => {
    if (message && message.length > maxLength) {
      return message.substring(0, maxLength) + "...";
    } else if (message) {
      return message;
    } else {
      return "";
    }
  };

  return (
    <div className="chats" style={{}}>
      {isLoading ? (
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} width={'full'} height={'50vh'}>
          <Spinner
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='blue.500'
            size='xl'
          />
        </Box>
      ) : Object.keys(chats).length === 0 ? (
        <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} paddingTop={'20%'} alignItems={'center'} width={'full'}>
          <Text fontSize={22}>Looks like your inbox is empty</Text>
          <img src="https://firebasestorage.googleapis.com/v0/b/pawsitive-64728.appspot.com/o/shocked.jpg?alt=media&token=5a5d60da-4ee3-4b91-a0a5-ba03be85ec54" alt="empty-inbox" style={{ borderRadius: '50%', width: '80%' }} />
        </Box>
      ) : (
        Object.entries(chats)
          .sort((a, b) => b[1].date - a[1].date)
          .map((chat) => (
            <div className="userChat" key={chat[0]} onClick={() => handleSelect(chat[1].userInfo)}>
              <Avatar name={chat[1].userInfo.displayName} src={chat[1].userInfo.photoURL} alt="" />
              <div className="userChatInfo">
                <span>{chat[1].userInfo.displayName}</span>
                <p>{CutMessage(chat[1].lastMessage?.text, 20)}</p>
              </div>
            </div>
          ))
      )}
      {console.log('length', chats.length)}
    </div>
  );
};

export default Chats;