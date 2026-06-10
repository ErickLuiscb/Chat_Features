import React, { useEffect, useState } from "react";

import SidebarChat from "./SidebarChat";

import "./Sidebar.css";

import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

import { Avatar, IconButton } from "@mui/material";

import axios from "./axios";

const Sidebar = ({ messages, darkMode, setDarkMode }) => {
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const response = await axios.get("/messages/actives");

        setActiveUsers(response.data);
      } catch (error) {
        console.error("Erro ao buscar usuários ativos:", error);
      }
    };

    fetchActiveUsers();

    const intervalId = setInterval(fetchActiveUsers, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar />

        <div className="sidebar__headerRight">
          <IconButton
            onClick={() => setDarkMode((currentMode) => !currentMode)}
            aria-label="Alternar tema"
            title={darkMode ? "Ativar tema claro" : "Ativar tema escuro"}
          >
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          <IconButton>
            <DonutLargeIcon />
          </IconButton>

          <IconButton>
            <ChatIcon />
          </IconButton>

          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlinedIcon />

          <input placeholder="Busque ou inicie um novo chat" type="text" />
        </div>
      </div>

      <div className="sidebar__chats">
        {activeUsers.map((activeUser) => {
          const userMessages = messages.filter(
            (message) => message.name === activeUser,
          );

          const lastUserMessage = userMessages[userMessages.length - 1];

          return (
            <SidebarChat
              key={activeUser}
              person={activeUser}
              lastTimestamp={lastUserMessage?.timestamp}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
