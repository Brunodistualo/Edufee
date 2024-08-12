"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import io from "socket.io-client";
import { NextPage } from "next";
import "tailwindcss/tailwind.css";
import { DataUser } from "@/store/userData";
import { InstitutionsData } from "@/store/institutionsData";

const socket = io("http://localhost:3005"); // Connect to the WebSocket server

const ChatPage: NextPage = () => {
  const userData = DataUser((state) => state.userData);
  const getData = DataUser((state) => state.getDataUser);
  const institutionsData = InstitutionsData((state) => state.institutionData);
  const getInstitutions = InstitutionsData((state) => state.getInstitutionData);
  const nombreCompleto = institutionsData.name || userData.name;
  console.log(nombreCompleto);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ name: string; message: string }[]>(
    [],
  );

  useEffect(() => {
    // Emit the user’s full name when the component mounts
    if (nombreCompleto) {
      socket.emit("new-user", nombreCompleto);
    }

    socket.on("chat-message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("chat-message");
    };
  }, [nombreCompleto]);

  useEffect(() => {
    getInstitutions();
  }, [getInstitutions]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (message.trim()) {
      if (nombreCompleto) {
        socket.emit("send-chat-message", `:${message}`);
      }
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-100">
      <div className="flex-1 overflow-auto p-4 bg-white shadow-md rounded-md mt-24">
        <div className="flex flex-col space-y-2 w-full">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start p-2 rounded-md ${
                msg.name === nombreCompleto
                  ? "bg-green-200 w-max ml-auto"
                  : "bg-pink-200 w-max mr-auto"
              }`}
            >
              <span
                className={`font-semibold ${
                  msg.name === nombreCompleto
                    ? "text-green-800"
                    : "text-pink-800"
                }`}
              >
                {msg.name}
              </span>
              <span className="ml-2">{msg.message}</span>
            </div>
          ))}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex">
        <input
          type="text"
          value={message}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setMessage(e.target.value)
          }
          className="flex-1 p-2 border border-gray-300 rounded-md"
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPage;
