import React from "react";
import Search from "./Search"
import Chats from "./Chats"
import NavChat from "./NavChat";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <NavChat/>
      <Search/>
      <Chats/>
    </div>
  );
};

export default Sidebar;