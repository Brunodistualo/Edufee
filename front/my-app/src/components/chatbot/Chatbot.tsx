"use client";
import { useState, FormEvent, useEffect, useRef } from "react";

interface Message {
  text: string;
  type: "user" | "bot";
}

const OPTIONS = [
  {
    text: "Estudiantes",
    info: 'Con <span class ="font-bold">edufee</span> realiza tus pagos de manera segura, rapida y comoda, olvidate de las filas y realiza tus pagos sin salir de casa, para registrarte haz click <a href="/select" class=" font-bold text-blue-500 hover:font-bold hover:text-blue-600">aquí!</a> ',
  },
  {
    text: "Instituciones",
    info: 'Con <span class ="font-bold">edufee</span> recibe tus pagos, alamcena tus facturas y guarda la informacion en un solo lugar, olvidate de el papeleo y facturas fisicas, inicia con tu registro <a href="/select" class=" font-bold text-blue-500 hover:font-bold hover:text-blue-600">aquí!</a> ',
  },
  {
    text: "Contactanos!",
    info: 'Si tienes alguan duda especifica, no dudes en escribirnos, llena el formulario y deja que uno de nuestros agentes se comunique contigo. <a href="/contact-us" class=" font-bold text-blue-500 hover:font-bold hover:text-blue-600">Contactanos!</a>',
  },
];

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showOptions, setShowOptions] = useState<boolean>(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isMinimized, setIsMinimized] = useState<boolean>(true);

  useEffect(() => {
    setMessages([
      { text: "¡Bienvenido! ¿En qué te puedo ayudar hoy?", type: "bot" },
    ]);
  }, []);

  const handleOptionClick = (info: string) => {
    setMessages([...messages, { text: "Por favor espera...", type: "bot" }]);
    setTimeout(() => {
      setMessages([
        ...messages,
        { text: "Encontramos esto para ti:", type: "bot" },
        { text: info, type: "bot" },
      ]);
      setShowOptions(false);
      setSelectedOption(info);
    }, 1000);
  };

  const handleBack = () => {
    setShowOptions(true);
    setSelectedOption(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() === "") return;

    const userMessage: Message = { text: message, type: "user" };
    const botResponse = `Sorry, I do not understand "${message}".`;
    const botMessage: Message = { text: botResponse, type: "bot" };

    setMessages([...messages, userMessage, botMessage]);
    setMessage("");
  };

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className={`fixed bottom-0 right-0 m-4 w-full max-w-md transition-all duration-300 shadow-md min-w-[200px] rounded-lg p-4 bg-gradient-to-tr from-blue-500 to-green-500 mb-24 ${
        isMinimized
          ? "h-14 w-max flex items-center justify-between bg-green-500"
          : "h-[500px]"
      }`}
    >
      <div className="flex flex-col h-full">
        <div
          ref={scrollRef}
          className={`flex-1 overflow-y-auto p-4 scrollbar-hidden ${
            isMinimized ? "hidden" : ""
          }`}
        >
          <div className="flex flex-col space-y-2 mt-8 rounded-lg overflow-hidden w-full p-2 bg-white/25">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex p-2 mx-left rounded-md max-w-full flex-wrap bg-black ${
                  msg.type === "user"
                    ? "bg-green-100 w-max ml-auto"
                    : "bg-blue-100 w-max mr-auto"
                }`}
              >
                <span
                  className={`font-semibold ${
                    msg.type === "user" ? "text-green-600" : "text-blue-600"
                  }`}
                >
                  {msg.type === "user" ? "You" : "Edubot"}:
                </span>
                <span className="ml-1 text-gray-700">
                  <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                </span>
              </div>
            ))}
          </div>
        </div>
        {!isMinimized && (
          <div className="mt-4">
            {showOptions ? (
              <div className="flex flex-col rounded-xl bg-orange-300/25 w-full py-2 items-center justify-center">
                {OPTIONS.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionClick(option.info)}
                    className="flex p-2 text my-2 bg-blue-600/20 text-white rounded-md h-8 hover:bg-blue-700 w-[50%] mx-auto justify-center items-center"
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            ) : (
              <button
                onClick={handleBack}
                className="p-2 mb-2 bg-blue-600 text-white rounded-md hover:bg-gray-700"
              >
                Regresar
              </button>
            )}
          </div>
        )}
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className={`absolute top-0 right-0 mt-2 mr-2 p-2 bg-blue-700 text-white font-semibold rounded-md hover:bg-gray-800 flex items-center ${
            isMinimized
              ? "flex top-0 right-6 w-max justify-center mt-2 text-center"
              : ""
          }`}
        >
          {isMinimized ? "Necesito ayuda!" : "Cerrar"}
        </button>
      </div>
      <style jsx>{`
        .scrollbar-hidden::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hidden {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .link {
          color: blue;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
