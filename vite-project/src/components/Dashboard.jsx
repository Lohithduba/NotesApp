import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

const Dashboard = () => {
  const { user, logout } = useAuth();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [note, setNote] = useState("");
  const [tags, setTags] = useState("");
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [editTags, setEditTags] = useState("");

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
  const handleTagsChange = (e) => setTags(e.target.value);
  const handleSearchChange = (e) => setSearch(e.target.value);

  const handleSaveNote = () => {
    if (!note.trim()) return;
    const newNote = {
      text: note.trim(),
      time: new Date().toLocaleString(),
      done: false,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean), // split and trim tags
    };
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    localStorage.setItem(`notes-${user.username}`, JSON.stringify(updatedNotes));
    setNote("");
    setTags("");
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
    setEditTags(notes[index].tags.join(", "));
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setEditText("");
    setEditTags("");
  };

  const handleSaveEdit = () => {
    const updatedNotes = [...notes];
    updatedNotes[editIndex].text = editText;
    updatedNotes[editIndex].tags = editTags.split(",").map((t) => t.trim()).filter(Boolean);
    setNotes(updatedNotes);
    localStorage.setItem(`notes-${user.username}`, JSON.stringify(updatedNotes));
    setEditIndex(null);
    setEditText("");
    setEditTags("");
    setMessage("Note updated!");
    setTimeout(() => setMessage(""), 2000);
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.text.toLowerCase().includes(search.toLowerCase()) ||
      n.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user.username}</h2>
      <p className="current-time">{currentTime.toLocaleString()}</p>

      <div className="card">
        <h3>Add a New Note</h3>
        <textarea
          value={note}
          onChange={handleNoteChange}
          rows={3}
          placeholder="Write a task or note..."
        />
        <input
          type="text"
          placeholder="Add tags (comma separated)"
          value={tags}
          onChange={handleTagsChange}
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
            placeholder="Search notes or tags..."
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
                    <input
                      type="text"
                      value={editTags}
                      onChange={(e) => setEditTags(e.target.value)}
                      placeholder="Edit tags"
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
                    <div className="note-time">{n.time}</div>
                    <div className="note-tags">
                      {n.tags && n.tags.length > 0 && (
                        <span className="tags">
                          {n.tags.map((tag, i) => (
                            <span key={i} className="tag">
                              #{tag}
                            </span>
                          ))}
                        </span>
                      )}
                    </div>
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
