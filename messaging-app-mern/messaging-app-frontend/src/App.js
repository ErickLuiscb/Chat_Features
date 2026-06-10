import "./App.css";
import React, { useEffect, useState } from "react";

import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import Login from "./components/Login";

import axios from "./components/axios";

import { useStateValue } from "./components/StateProvider";

function App() {
  const [messages, setMessages] = useState([]);
  const [selectedMessageId, setSelectedMessageId] = useState("");

  const [{ user }] = useStateValue();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get("/messages/sync");

        setMessages(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMessages();

    const interval = setInterval(() => {
      fetchMessages();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      {!user ? (
        <Login />
      ) : (
        <div className="app__body">
          <Sidebar messages={messages} onSelectMessage={setSelectedMessageId} />
          <Chat messages={messages} selectedMessageId={selectedMessageId} />
        </div>
      )}
    </div>
  );
}

export default App;
