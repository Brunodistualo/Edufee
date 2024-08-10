"use client";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io(
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3005"
);

const Home = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleChatMessage = (data: { name: string; message: string }) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        `${data.name}: ${data.message}`,
      ]);
    };

    const handleUserConnected = (name: string) => {
      setMessages((prevMessages) => [...prevMessages, `${name} connected`]);
    };

    const handleUserDisconnected = (name: string) => {
      setMessages((prevMessages) => [...prevMessages, `${name} disconnected`]);
    };

    socket.on("chat-message", handleChatMessage);
    socket.on("user-connected", handleUserConnected);
    socket.on("user-disconnected", handleUserDisconnected);

    return () => {
      socket.off("chat-message", handleChatMessage);
      socket.off("user-connected", handleUserConnected);
      socket.off("user-disconnected", handleUserDisconnected);
    };
  }, []);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      setMessages((prevMessages) => [...prevMessages, `You: ${message}`]);
      socket.emit("send-chat-message", message);
      setMessage("");
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div
        ref={messageContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-gray-200"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 my-1 ${
              index % 2 === 0 ? "bg-gray-300" : "bg-white"
            }`}
          >
            {msg}
          </div>
        ))}
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex items-center p-4 bg-white border-t border-gray-300"
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded"
          placeholder="Type a message"
        />
        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Home;
