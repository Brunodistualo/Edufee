"use client";
import { useState, useEffect, ChangeEvent, FormEvent, useRef } from "react";
import io from "socket.io-client";
import { DataUser } from "@/store/userData";
import { InstitutionsData } from "@/store/institutionsData";

const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005");

const ChatPage = () => {
  const userData = DataUser((state) => state.userData);
  // const getData = DataUser((state) => state.getDataUser);
  const institutionsData = InstitutionsData((state) => state.institutionData);
  const getInstitutions = InstitutionsData((state) => state.getInstitutionData);
  const nombreCompleto = institutionsData.name || userData.name;
  console.log(nombreCompleto);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ name: string; message: string }[]>(
    []
  );
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
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
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (message.trim()) {
      if (nombreCompleto) {
        socket.emit("send-chat-message", `${message}`);
      }
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-screen p-4 bg-gradient-to-tr from-blue-500 to-green-500 pb-10 items-center">
      <div
        ref={scrollRef}
        className="flex-1 w-full  p-4 bg-gray-100/25 shadow-md rounded-2xl mt-24 max-w-[800px] overflow-hidden"
      >
        <div className="flex flex-col space-y-2 w-full">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start p-2 rounded-md ${
                msg.name === nombreCompleto
                  ? "bg-green-100 w-max ml-auto"
                  : "bg-blue-100 w-max mr-auto"
              }`}
            >
              <span
                className={`font-semibold ${
                  msg.name === nombreCompleto
                    ? "text-green-600"
                    : "text-blue-600"
                }`}
              >
                {msg.name}:
              </span>
              <span className="ml-1 text-gray-700">{msg.message}</span>
            </div>
          ))}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex w-full max-w-[800px]">
        <input
          type="text"
          value={message}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setMessage(e.target.value)
          }
          className="flex-1 p-2 border bg-gray-200/75 border-gray-300 rounded-md text-gray-600 placeholder-gray-500"
          placeholder="Escribe tu mensaje..."
        />
        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default ChatPage;
