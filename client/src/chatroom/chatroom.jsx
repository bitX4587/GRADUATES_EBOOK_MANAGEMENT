import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom"; // For accessing URL params
import { socket } from "./socket"; // Correct path

function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const { id: targetId } = useParams(); // Get targetId from the URL

  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    if (!userId || !targetId) {
      console.error("Missing userId or targetId — cannot proceed.");
      return;
    }

    // Fetch messages for the specific chatroom by targetId
    axios
      .get("http://localhost:8000/api/messages", {
        params: { userId, targetId },
      })
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Message fetch error:", err));

    socket.emit("join", userId);

    socket.on("privateMessage", (msg) => {
      if (
        (msg.from === userId && msg.to === targetId) ||
        (msg.from === targetId && msg.to === userId)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("privateMessage");
    };
  }, [userId, targetId]);

  const sendMessage = () => {
    if (input.trim() !== "") {
      const msg = {
        from: userId,
        to: targetId,
        message: input,
      };

      socket.emit("privateMessage", msg);
      setInput("");
    }
  };

  useEffect(() => {
    const chatBox = document.getElementById("chat-box");
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }, [messages]);

  return (
    <div>
      <h2>Chat Room</h2>
      <p>
        Chatting with: <strong>{targetId}</strong>
      </p>

      <div
        id="chat-box"
        style={{
          height: 300,
          overflowY: "scroll",
          border: "1px solid black",
          padding: 10,
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx}>
            <strong>{msg.from === userId ? "You" : "Them"}</strong>:{" "}
            {msg.message}
          </div>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message"
      />
      <button onClick={sendMessage}>Send</button>
      <Link to="/dashboard">Back</Link>
    </div>
  );
}

export default ChatRoom;
