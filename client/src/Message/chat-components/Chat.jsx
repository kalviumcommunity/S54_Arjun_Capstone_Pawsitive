import React, { useContext } from "react";
import More from "../../assets/more.png";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../../context/ChatContext";
import { Button, Text } from "@chakra-ui/react";
import { AuthContext } from "../../context/AuthContext";
import back from '../../assets/back.png'
const Chat = () => {
  const { data } = useContext(ChatContext);
  const { setMob } = useContext(AuthContext);

  return (
    <div className="chat">
      <div className="chatInfo">
        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
          {console.log(data)}
          <button onClick={()=>setMob(false)} p={'none'} bg={'transparent'} id="back">
            <img src={back} alt="" width={'30vw'}/>
          </button>
          <img className="chatter" src={data.user?.photoURL} alt="" width={'30px'} height={'30px'} />
          <Text fontSize={'2xl'}>{data.user?.displayName}</Text>
        </div>
        <div className="chatIcons">
          {/* <img src={Cam} alt="" /> */}
          {/* <img src={Add} alt="" /> */}
          <img src={More} alt="" />
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;