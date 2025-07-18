import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

const Dashboard = () => {
  const { user, logout } = useAuth();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const [editIndex, setEditIndex] = useState(null); // ✏️
  const [editText, setEditText] = useState("");     // ✏️

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem(`notes-${user.username}`));
    if (savedNotes) setNotes(savedNotes);
  }, [user.username]);

  const handleNoteChange = (e) => setNote(e.target.value);
  const handleSearchChange = (e) => setSearch(e.target.value);

  const handleSaveNote = () => {
    if (!note.trim()) return;
    const newNote = {
      text: note.trim(),
      time: new Date().toLocaleString(),
      done: false,
    };
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    localStorage.setItem(`notes-${user.username}`, JSON.stringify(updatedNotes));
    setNote("");
    setMessage("Note added!");
    setTimeout(() => setMessage(""), 2000);
  };

  const handleDeleteNote = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
    localStorage.setItem(`notes-${user.username}`, JSON.stringify(updatedNotes));
    setMessage("Note deleted!");
    setTimeout(() => setMessage(""), 2000);
  };

  const toggleDone = (index) => {
    const updatedNotes = [...notes];
    updatedNotes[index].done = !updatedNotes[index].done;
    setNotes(updatedNotes);
    localStorage.setItem(`notes-${user.username}`, JSON.stringify(updatedNotes));
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditText(notes[index].text);
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setEditText("");
  };

  const handleSaveEdit = () => {
    const updatedNotes = [...notes];
    updatedNotes[editIndex].text = editText;
    setNotes(updatedNotes);
    localStorage.setItem(`notes-${user.username}`, JSON.stringify(updatedNotes));
    setEditIndex(null);
    setEditText("");
    setMessage("Note updated!");
    setTimeout(() => setMessage(""), 2000);
  };

  const filteredNotes = notes.filter((n) =>
    n.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user.username}</h2>
      <p>{currentTime.toLocaleString()}</p>

      <div className="card">
        <h3>Add a New Note</h3>
        <textarea
          value={note}
          onChange={handleNoteChange}
          rows={3}
          placeholder="Write a task or note..."
        />
        <button onClick={handleSaveNote}>Add Note</button>
        {message && <p style={{ color: "green" }}>{message}</p>}
      </div>

      {notes.length > 0 && (
        <div className="card">
          <h3>Your Saved Notes</h3>

          <input
            type="text"
            className="search-input"
            placeholder="Search notes..."
            value={search}
            onChange={handleSearchChange}
          />

          <ul className="note-list">
            {filteredNotes.map((n, index) => (
              <li key={index} className="note-item">
                {editIndex === index ? (
                  <>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={3}
                    />
                    <button onClick={handleSaveEdit}>Save</button>
                    <button onClick={handleCancelEdit} className="delete-btn">Cancel</button>
                  </>
                ) : (
                  <>
                    <div
                      className="note-text"
                      style={{
                        textDecoration: n.done ? "line-through" : "none",
                        color: n.done ? "#888" : "#000",
                      }}
                    >
                      {n.text}
                    </div>
                    <div className="note-time">🕒 {n.time}</div>
                    <button onClick={() => toggleDone(index)}>
                      {n.done ? "Undo" : "Mark Done"}
                    </button>
                    <button onClick={() => handleEdit(index)}>Edit</button>
                    <button onClick={() => handleDeleteNote(index)} className="delete-btn">
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button className="logout-btn" onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
