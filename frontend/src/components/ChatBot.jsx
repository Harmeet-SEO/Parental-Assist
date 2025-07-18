import React, { useState } from "react";
import "./ChatBot.css";

const ChatBot = () => {
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setTyping(true); // Show typing...

    try {
      const res = await fetch("http://127.0.0.1:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, user_id: "web_user" }),
      });

      const data = await res.json();
      const botMessage = { sender: "bot", text: data.response };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error reaching server." },
      ]);
    }

    setTyping(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div>
      <div className="chat-toggle" onClick={() => setVisible(!visible)}>
        💬
      </div>

      {visible && (
        <div className="chat-widget">
          <div className="chat-header">Ask ParentalAssistBot</div>
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-bubble ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {typing && <div className="chat-bubble bot typing">Typing...</div>}
          </div>
          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask something..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
