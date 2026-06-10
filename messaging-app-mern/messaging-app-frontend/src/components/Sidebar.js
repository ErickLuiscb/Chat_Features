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

const Sidebar = ({ messages, darkMode, setDarkMode, onSelectMessage  }) => {
  const [activeUsers, setActiveUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

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

  useEffect(() => {
    const trimmedSearch = searchTerm.trim();

    if (!trimmedSearch) {
      setSearchResults([]);

      if (onSelectMessage) {
        onSelectMessage("");
      }

      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        const response = await axios.get("/messages/search", {
          params: {
            query: trimmedSearch,
          },
        });

        setSearchResults(response.data);
      } catch (error) {
        console.error("Erro ao pesquisar mensagens:", error);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleSelectMessage = (messageId) => {
    if (onSelectMessage) {
      onSelectMessage(messageId);
    }
  };

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

          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Busque mensagens"
            type="text"
            value={searchTerm}
          />
        </div>
      </div>

      {searchResults.length > 0 && (
        <div className="sidebar__searchResults">
          {searchResults.map((result) => (
            <button
              key={result._id}
              className="sidebar__searchResult"
              onClick={() => handleSelectMessage(result._id)}
              type="button"
            >
              <span className="sidebar__searchResultName">{result.name}</span>

              <span className="sidebar__searchResultMessage">
                {result.imageId ? "Imagem enviada" : result.message}
              </span>

              <span className="sidebar__searchResultMeta">
                {new Date(result.timestamp).toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      )}

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
