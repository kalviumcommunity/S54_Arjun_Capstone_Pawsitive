import React, { useContext } from "react";
import More from "../../assets/more.png";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../../context/ChatContext";

const Chat = () => {
  const { data } = useContext(ChatContext);

  return (
    <div className="chat">
      <div className="chatInfo">
        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
          <img className="chatter" src={data.user?.photoURL} alt="" width={'30px'} height={'30px'} />
          <h3>{data.user?.displayName}</h3>
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