const express = require("express");
const mongoose = require("mongoose");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();

// ✅ Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Define Note Schema (MongoDB)
const noteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  summary: { type: String }, // Optional: Store AI summary
  createdAt: { type: Date, default: Date.now },
});

const Note = mongoose.model("Note", noteSchema);


// ROUTES

// ➤ Get all notes
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// ➤ Add a note
router.post("/", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text required" });

  try {
    const newNote = new Note({ text });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    console.error("Add error:", err);
    res.status(500).json({ error: "Failed to add note" });
  }
});

// ➤ Update a note
router.put("/:id", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text required" });

  try {
    const updated = await Note.findByIdAndUpdate(
      req.params.id,
      { text },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Note not found" });
    res.json(updated);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Failed to update note" });
  }
});

// ➤ Delete a note
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Note.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Note not found" });
    res.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete note" });
  }
});

// ➤ Summarize a note (Gemini Integration) - Updated to valid model
router.post("/summarize/:id", async (req, res) => {
  
  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ error: "note not found" });

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Updated to stable model

    const result = await model.generateContent(
      `Summarize this note in 5 short bullet points in a list format:\n\n${note.text}`
    );


    const summary = result.response.text();

    note.summary=summary;
    await note.save();
    res.json({ summary });
  } catch (error) {
    console.error("Gemini error:", error);
    res.status(500).json({ error: "Failed to summarize" });
  }
});

module.exports = router;