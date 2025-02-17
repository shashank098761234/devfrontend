import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "./utils/socket";
import { useSelector } from "react-redux";
import { BASE_URL } from "./utils/constants";
import axios from "axios";

const Chat = () => {
  const { targetuserId } = useParams();

  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const fetchChatMessages = async () => {
    const chat = await axios.get(BASE_URL + "/chat/" + targetuserId, {
      withCredentials: true,
    });

    console.log("chat>>>>>>>>>.", chat?.data?.messages);

    const chatMessages = chat?.data?.messages.map((msg) => {
      return {
        firstName: msg?.senderId?.firstName,
        lastName: msg?.senderId?.lastName,
        newMessage: msg?.newMessage,
      };
    });

    setMessages(chatMessages);
  };

  useEffect(() => {
    fetchChatMessages();
  }, []);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const socket = createSocketConnection();
    socket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetuserId,
    });

    socket.on("messageReceived", ({ firstName, lastName, newMessage }) => {
      setMessages((messages) => [
        ...messages,
        { firstName, lastName, newMessage },
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetuserId]);

  const sendMessage = () => {
    const socket = createSocketConnection();

    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetuserId,
      newMessage,
    });
    setNewMessage("");
  };

  return (
    <div className="w-3/4 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col">
      <h1 className="p-5 border-b border-grey-600">Chat</h1>
      <div className="flex-1 overflow-scroll p-5">
        {messages?.map((msg, index) => {
          return user?.firstName !== msg.firstName ? (
            <div key={index} className="chat chat-start">
              <div className="chat-header">
                {`${msg.firstName}  ${msg.lastName}`}
                <time className="text-xs opacity-50">2 hours ago</time>
              </div>
              <div className="chat-bubble">{msg.newMessage}</div>
              <div className="chat-footer opacity-50">Seen</div>
            </div>
          ) : (
            <div key={index} className="chat chat-end">
              <div className="chat-header">
                {`${msg.firstName}  ${msg.lastName}`}
                <time className="text-xs opacity-50">2 hours ago</time>
              </div>
              <div className="chat-bubble">{msg.newMessage}</div>
              <div className="chat-footer opacity-50">Seen</div>
            </div>
          );
        })}
      </div>
      <div className="p-5 border-t border-gray-600 flex items-center gap-2">
        <input
          className="flex-1 border border-gray-500 text-white rounded p-2"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        ></input>
        <button onClick={sendMessage} className="btn btn-secondary">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
