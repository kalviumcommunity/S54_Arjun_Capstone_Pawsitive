import React from "react";
import Search from "./Search"
import Chats from "./Chats"
import ChatNav from "./chatNav";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ChatNav />
      <Search/>
      <Chats/>
    </div>
  );
};

export default Sidebar;