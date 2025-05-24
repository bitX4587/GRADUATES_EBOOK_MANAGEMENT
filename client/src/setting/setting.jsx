import React, { useState, useEffect } from "react";
import axios from "axios";
import "./setting-style.css";

function Settings() {
  const [user, setUser] = useState({});
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/dashboard`, {
        withCredentials: true,
      })
      .then((res) => setUser(res.data.user))
      .catch((err) => console.error("Failed to fetch user info", err));

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/updates`, {
        withCredentials: true,
      })
      .then((res) => setUpdates(res.data.updates))
      .catch((err) => console.error("Failed to fetch updates", err));
  }, []);

  const sendMessageToAdmin = (e) => {
    e.preventDefault();

    if (!message.trim()) {
      setStatus("Please enter a message.");
      return;
    }

    axios
      .post(
        `
        ${process.env.REACT_APP_API_URL}/api/messages/admin`,
        { from: user.id, message },
        { withCredentials: true }
      )
      .then(() => {
        setStatus("✅ Message sent to admin!");
        setMessage("");
      })
      .catch((err) => {
        console.error("Failed to send message", err);
        setStatus("❌ Error sending message. Please try again.");
      });
  };

  return (
    <div className="settings-landing">
      <div className="generalDIV">
        <section className="hero">
          <h1>Welcome back, {user.name || "User"} 👋</h1>
          <p>Your personalized settings and updates are right below!</p>
        </section>

        <section className="updates-section">
          <h2>📢 Latest Events & Updates</h2>
          {updates.length > 0 ? (
            <div className="updates-grid">
              {updates.map((update, index) => (
                <div className="update-card" key={index}>
                  <h3>{update.title}</h3>
                  <p>{update.message}</p>
                  <small>{new Date(update.date).toLocaleDateString()}</small>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-updates">No updates yet. Stay tuned!</p>
          )}
        </section>

        <section className="message-admin">
          <h2>💬 Message the Admin</h2>
          <form onSubmit={sendMessageToAdmin}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows="5"
            />
            <button className="setting-btn" type="submit">
              Send Message
            </button>
            {status && <p className="status-message">{status}</p>}
          </form>
        </section>

        <section className="about-codex">
          <h2>🧠 About Codex Intel Team</h2>
          <p>
            We are a team of passionate engineers, designers, and innovators who
            build tools for the next-gen future.
          </p>
          <ul>
            <li>Added by Lapore Jericho · @erinasaurus.rex</li>
            <li>Added by Lapore Jericho · @floridafati.24</li>
            <li>Added by Lapore Jericho · @jakelynard.lullegao</li>
            <li>Group creator · @jericho.flor.37</li>
            <li>Added by Lapore Jericho · @llemaurc</li>
            <li>Added by Lapore Jericho · @rheaaaa.montabon</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default Settings;
