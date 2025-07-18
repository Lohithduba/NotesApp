const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");
const noteRoutes = require("./routes/noteRoutes"); 


mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api", authRoutes);
app.use("/api/notes", noteRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
