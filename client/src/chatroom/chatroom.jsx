import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { socket } from "./socket";
import "./chatroom-style.css";

function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState(null);
  const [userProfile, setUserProfile] = useState({});
  const [targetProfile, setTargetProfile] = useState({});
  const [typing, setTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { id: targetId } = useParams();
  const bottomRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/dashboard`, {
        withCredentials: true,
      })
      .then((res) => {
        const user = res.data.user;
        setUserId(String(user.id));
        setUserProfile(user);

        if (!socket.connected) {
          socket.connect();
          socket.once("connect", () => {
            socket.emit("join", user.id);
          });
        } else {
          socket.emit("join", user.id);
        }
      })
      .catch((err) => console.error("User fetch error", err));
  }, []);

  useEffect(() => {
    if (targetId) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/users/${targetId}`, {
          withCredentials: true,
        })
        .then((res) => {
          setTargetProfile(res.data);
        })
        .catch((err) => console.error("Target user fetch error", err));
    }
  }, [targetId]);

  useEffect(() => {
    if (!userId || !targetId) return;

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/messages`, {
        params: { targetId },
        withCredentials: true,
      })
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Message fetch error", err));

    const privateMessageHandler = (msg) => {
      if (
        (msg.from === userId && msg.to === targetId) ||
        (msg.from === targetId && msg.to === userId)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    const typingHandler = (senderId) => {
      if (senderId === targetId) {
        setTyping(true);
        setTimeout(() => setTyping(false), 1000);
      }
    };

    socket.on("privateMessage", privateMessageHandler);
    socket.on("typing", typingHandler);

    return () => {
      socket.off("privateMessage", privateMessageHandler);
      socket.off("typing", typingHandler);
    };
  }, [userId, targetId]);

  useEffect(() => {
    const handleUpdateStatus = (onlineList) => {
      setOnlineUsers(onlineList);
    };

    socket.on("updateUserStatus", handleUpdateStatus);

    return () => {
      socket.off("updateUserStatus", handleUpdateStatus);
    };
  }, []);

  useEffect(() => {
    const chatBox = document.getElementById("chat-box");
    if (!chatBox) return;

    const isNearBottom =
      chatBox.scrollHeight - chatBox.scrollTop - chatBox.clientHeight < 100;

    if (isNearBottom) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() === "" || !userId || !targetId) return;

    const msg = {
      from: userId,
      to: targetId,
      message: input.trim(),
      timestamp: new Date().toISOString(),
    };

    socket.emit("privateMessage", msg);
    setInput("");
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    socket.emit("typing", targetId);
  };

  const isOnline = onlineUsers.includes(targetId);
  return (
    <div className="d-flex w-100 justify-content-center">
      <div className="chat-container m-1">
        <div className="chat-header">
          <span className={`status-dot ${isOnline ? "online" : "offline"}`} />
          <h2>Chat with {targetProfile.name || targetId}</h2>
          <Link to="/dashboard" className="back-btn text-decoration-none">
            Back
          </Link>
        </div>

        <div id="chat-box" className="chat-box">
          {messages.map((msg, idx) => {
            const fromMe = msg.from === userId;
            const profile = fromMe ? userProfile : targetProfile;
            const time = new Date(msg.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={idx}
                className={`chat-message ${fromMe ? "me" : "them"}`}
              >
                {profile.image ? (
                  <img
                    src={profile.image?.url || "/default-profile.png"}
                    alt={profile.name}
                    className="avatar-img"
                  />
                ) : (
                  <div className="avatar-fallback">
                    {profile.name?.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="message-content">
                  <div className="text">{msg.message}</div>
                  <div className="text-black timestamp">{time}</div>
                </div>
              </div>
            );
          })}

          {typing && (
            <div className="typing-indicator">
              <span>{targetProfile.name || targetId} is typing...</span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="chat-input">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Type a message"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default ChatRoom;
