const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const verifyToken = require("../middleware/verifyToken");

// GET all notes for the logged-in user
router.get("/", verifyToken, async (req, res) => {
  const username = req.user.username;
  const notes = await Note.find({ user: username });
  res.json(notes);
});

// POST a new note
router.post("/", verifyToken, async (req, res) => {
  const { text } = req.body;
  const note = new Note({
    text,
    time: new Date().toLocaleString(),
    done: false,
    user: req.user.username,
  });
  await note.save();
  res.status(201).json(note);
});

// DELETE a note by ID
router.delete("/:id", verifyToken, async (req, res) => {
  const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user.username });
  if (!note) return res.status(404).json({ message: "Note not found" });
  res.json({ message: "Note deleted" });
});

// PATCH to toggle 'done' or update text
router.patch("/:id", verifyToken, async (req, res) => {
  const { text, done } = req.body;
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.user.username },
    { text, done },
    { new: true }
  );
  res.json(note);
});

module.exports = router;
