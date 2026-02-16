require('dotenv').config();  // Load this FIRST, only ONCE

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose"); 
const notesRouter = require("./routes/notes");

// Debug logging
console.log('=== SERVER DEBUG ===');
console.log('GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
console.log('GEMINI_API_KEY length:', process.env.GEMINI_API_KEY?.length);
console.log('GEMINI_API_KEY first 20 chars:', process.env.GEMINI_API_KEY?.substring(0, 20));
console.log('===================');

const app = express();
const PORT = process.env.PORT || 5000;



mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

app.use(cors());
app.use(express.json());

app.use("/api/notes", notesRouter);

app.listen(PORT, () => {
    console.log(`the server is running on localhost:${PORT}`);
});