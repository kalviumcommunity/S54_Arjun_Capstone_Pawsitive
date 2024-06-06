import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { db } from "../../firebase/firebase";
import { Avatar } from "@chakra-ui/react";

const Chats = () => {
  const [chats, setChats] = useState([]);

  const { currentUser, mob, setMob } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
        console.log("doc.data(): ", doc.data());
      });
      return () => {
        unsub();
      };
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
      {Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat) => (
        < div
          className="userChat"
          key={chat[0]}
          onClick={() => handleSelect(chat[1].userInfo)}
        >
          <Avatar name={chat[1].userInfo.displayName} src={chat[1].userInfo.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{chat[1].userInfo.displayName}</span>
            {/* {
              chat[1].lastMessage?.text ?
              <p>{CutMessage(chat[1].lastMessage?.text,20)}</p> : <p>Image sent</p>
            } */}
            <p>{CutMessage(chat[1].lastMessage?.text, 20)}</p>
          </div>
        </div>
      ))
      }
    </div >
  );
};

export default Chats;