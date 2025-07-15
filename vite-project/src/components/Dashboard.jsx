import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

const Dashboard = () => {
  const { user, logout } = useAuth();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [note, setNote] = useState("");
  const [savedNote, setSavedNote] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("note");
    if (saved) {
      setNote(saved);
      setSavedNote(saved);
    }
  }, []);

  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };

  const handleSaveNote = () => {
    localStorage.setItem("note", note);
    setSavedNote(note);
    setSavedMessage("✅ Note saved!");
    setTimeout(() => setSavedMessage(""), 2000);
  };

  const handleDeleteNote = () => {
    localStorage.removeItem("note");
    setNote("");
    setSavedNote("");
    setSavedMessage("🗑️ Note deleted!");
    setTimeout(() => setSavedMessage(""), 2000);
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome</h2>
      


      <div className="card">
        <h3>📋 Your Notes</h3>
        <textarea
          value={note}
          onChange={handleNoteChange}
          rows={4}
          placeholder="Write something..."
        />
        <div className="button-group">
          <button onClick={handleSaveNote}>Save Note</button>
          <button onClick={handleDeleteNote} className="delete-btn">Delete Note</button>
        </div>
        {savedMessage && <p style={{ color: "green" }}>{savedMessage}</p>}

        {savedNote && (
          <div className="saved-note-display">
            <h4>🗒️ Saved Note Preview:</h4>
            <p>{savedNote}</p>
          </div>
        )}
      </div>

      <button className="logout-btn" onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
