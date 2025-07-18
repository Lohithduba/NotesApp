const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  time: { type: String, required: true },
  done: { type: Boolean, default: false },
  user: { type: String, required: true }, 
});

module.exports = mongoose.model("Note", noteSchema);
