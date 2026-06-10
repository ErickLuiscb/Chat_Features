import React, { useEffect, useRef, useState } from "react";
import { Avatar, IconButton } from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import MicIcon from "@mui/icons-material/Mic";

import axios from "./axios";

import "./Chat.css";

import { useStateValue } from "./StateProvider";

const Chat = ({ messages, selectedMessageId }) => {
  const [seed, setSeed] = useState("");
  const [input, setInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fileInputRef = useRef(null);
  const messageRefs = useRef({});

  const [{ user, cid }] = useStateValue();

  const filteredMessages = searchTerm.trim()
    ? messages.filter((message) => {
        const term = searchTerm.trim().toLowerCase();
        const messageText = message.message
          ? message.message.toLowerCase()
          : "";
        const messageName = message.name ? message.name.toLowerCase() : "";

        return messageText.includes(term) || messageName.includes(term);
      })
    : messages;

  const openFileSelector = () => {
    fileInputRef.current.click();
  };

  const sendImage = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.type !== "image/png") {
      alert("Envie apenas imagens PNG.");
      e.target.value = "";
      return;
    }

    const formData = new FormData();

    formData.append("image", file);
    formData.append("name", user);

    await axios.post("/messages/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    e.target.value = "";
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    await axios.post("/messages/new", {
      message: input,
      name: user,
      timestamp: new Date(),
      received: true,
      cid
    });

    setInput("");
  };

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  useEffect(() => {
    if (!selectedMessageId) {
      return;
    }

    const selectedMessageElement = messageRefs.current[selectedMessageId];

    if (selectedMessageElement) {
      selectedMessageElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedMessageId, filteredMessages]);

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar
          src={`https://api.dicebear.com/9.x/toon-head/svg?flip=true&seed=${seed}`}
        />

        <div className="chat__headerInfo">
          <h3>Chat básico</h3>

          <p>
            Visto em:{" "}
            {messages[messages.length - 1]?.timestamp
              ? new Date(
                  messages[messages.length - 1]?.timestamp,
                ).toLocaleString()
              : ""}
          </p>
        </div>

        <div className="chat__headerRight">
          <div className="chat__searchContainer">
            <SearchIcon />

            <input
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filtrar mensagens"
              type="text"
              value={searchTerm}
            />
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png"
            onChange={sendImage}
            style={{ display: "none" }}
          />

          <IconButton onClick={openFileSelector}>
            <AttachFileIcon />
          </IconButton>

          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      <div className="chat__body">
        {filteredMessages.length && (
          filteredMessages.map((message) => (
          <>
            {message.system && (<div>{message.message}</div>)}
            {!message.system && (
              <p
                key={message._id}
                ref={(element) => {
                messageRefs.current[message._id] = element;
              }}
                className={`chat__message ${
                  message.name === user && "chat__receiver"
                }`}
              >
                <span className="chat__name">{message.name}</span>

                {message.imageId ? (
                  <img
                    src={`http://127.0.0.1:9000/messages/image/${message.imageId}`}
                    alt="Imagem enviada"
                    className="chat__image"
                  />
                ) : (
                  message.message
                )}

                <span className="chat__timestamp">
                  {new Date(message.timestamp).toLocaleString()}
                </span>
              </p>
            )}
          </>
        )))}
      </div>

      <div className="chat__footer">
        <InsertEmoticonIcon />

        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite uma mensagem"
            type="text"
          />

          <button onClick={sendMessage} type="submit">
            Enviar
          </button>
        </form>

        <MicIcon />
      </div>
    </div>
  );
};

export default Chat;
