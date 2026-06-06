import React, { useEffect, useState, useRef } from "react";
import { Avatar, IconButton } from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import MicIcon from "@mui/icons-material/Mic";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import axios from "./axios";

import "./Chat.css";

import { useStateValue } from "./StateProvider";

const Chat = ({ messages }) => {
  const [seed, setSeed] = useState("");
  const [input, setInput] = useState("");

  /* Feature editar feita por Erick Luis, adicionando as const */
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const fileInputRef = useRef(null);

  const [{ user }] = useStateValue();

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
    });

    setInput("");
  };

  /* Feature editar/excluir feita por Erick Luis, 
  adicionando as novas funções de editar e deletar no front */
  const startEdit = (message) => {
    setEditingId(message._id);
    setEditingText(message.message);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const saveEdit = async (id) => {
    if (!editingText.trim()) return;

    await axios.put(`/messages/${id}`, {
      message: editingText,
    });

    setEditingId(null);
    setEditingText("");
  };

  const deleteMessage = async (id) => {
    const confirmDelete = window.confirm(
      "Deseja realmente excluir esta mensagem?",
    );

    if (!confirmDelete) return;

    await axios.delete(`/messages/${id}`);
  };

  /*--------------------------------------*/
  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

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
          <IconButton>
            <SearchIcon />
          </IconButton>

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
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat__message ${
              message.name === user && "chat__receiver"
            }`}
          >
            <span className="chat__name">{message.name}</span>

            {editingId === message._id ? (
              <>
                <input
                  className="chat__editInput"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />

                <IconButton size="small" onClick={() => saveEdit(message._id)}>
                  <CheckIcon />
                </IconButton>

                <IconButton size="small" onClick={cancelEdit}>
                  <CloseIcon />
                </IconButton>
              </>
            ) : (
              <>
                {message.imageId ? (
                  <img
                    src={`http://127.0.0.1:9000/messages/image/${message.imageId}`}
                    alt="Imagem enviada"
                    className="chat__image"
                  />
                ) : (
                  <>
                    {message.message}

                    {message.edited && (
                      <small className="chat__edited">(editada)</small>
                    )}
                  </>
                )}
              </>
            )}

            <span className="chat__timestamp">
              {new Date(message.timestamp).toLocaleString()}
            </span>

            {message.name === user &&
              !message.imageId &&
              editingId !== message._id && (
                <div className="chat__actions">
                  <IconButton size="small" onClick={() => startEdit(message)}>
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    size="small"
                    onClick={() => deleteMessage(message._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              )}
          </div>
        ))}
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
