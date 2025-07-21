import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const token = localStorage.getItem("token");

  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // Load notes on mount
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/api/notes", { headers })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch notes");
        return res.json();
      })
      .then((data) => setNotes(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const handleNoteChange = (e) => setNote(e.target.value);
  const handleSearchChange = (e) => setSearch(e.target.value);

  const handleSaveNote = async () => {
    if (!note.trim()) return;

    try {
      const res = await fetch("http://localhost:5000/api/notes", {
        method: "POST",
        headers,
        body: JSON.stringify({ text: note }),
      });
      const data = await res.json();
      setNotes([...notes, data]);
      setNote("");
      setMessage("Note added!");
    } catch (err) {
      console.error("Save error:", err);
    }

    setTimeout(() => setMessage(""), 2000);
  };

  const handleDeleteNote = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: "DELETE",
        headers,
      });
      setNotes(notes.filter((n) => n._id !== id));
      setMessage("Note deleted!");
    } catch (err) {
      console.error("Delete error:", err);
    }

    setTimeout(() => setMessage(""), 2000);
  };

  const toggleDone = async (noteItem) => {
    try {
      const res = await fetch(`http://localhost:5000/api/notes/${noteItem._id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ done: !noteItem.done }),
      });
      const updated = await res.json();
      setNotes(notes.map((n) => (n._id === updated._id ? updated : n)));
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  const handleEdit = (noteItem) => {
    setEditId(noteItem._id);
    setEditText(noteItem.text);
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditText("");
  };

  const handleSaveEdit = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/notes/${editId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ text: editText }),
      });
      const updated = await res.json();
      setNotes(notes.map((n) => (n._id === updated._id ? updated : n)));
      setEditId(null);
      setEditText("");
      setMessage("Note updated!");
    } catch (err) {
      console.error("Edit error:", err);
    }

    setTimeout(() => setMessage(""), 2000);
  };

  const filteredNotes = notes.filter((n) =>
    n.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user.username}</h2>

      {/* ✅ Debug Section */}
      <div className="debug-box" style={{
        background: "#f4f4f4",
        padding: "12px",
        borderRadius: "8px",
        marginBottom: "20px",
        fontSize: "14px",
        border: "1px solid #ccc"
      }}>
        <strong>🔧 Debug Info:</strong><br />
        👤 User: <code>{user.username}</code><br />
        🗂 Notes Fetched: <code>{notes.length}</code><br />
        🔐 Token: <code>{token ? token.slice(0, 20) + "..." : "No token"}</code>
      </div>

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
            {filteredNotes.map((n) => (
              <li key={n._id} className="note-item">
                {editId === n._id ? (
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
                    <button onClick={() => toggleDone(n)}>
                      {n.done ? "Undo" : "Mark Done"}
                    </button>
                    <button onClick={() => handleEdit(n)}>Edit</button>
                    <button
                      onClick={() => handleDeleteNote(n._id)}
                      className="delete-btn"
                    >
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
