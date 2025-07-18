const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); 


mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));




const authRoutes = require("./routes/auth");

app.get('/',(req,res)=>{
  res.send('API is working');
})

app.use("/api", authRoutes); 

const PORT = process.env.PORT  || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));