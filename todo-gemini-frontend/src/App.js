import React, { useState, useEffect } from "react";
import { api } from "./api"; // Adjust if path is wrong
import NoteList from "./components/NoteList";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/");
        setNotes(res.data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };
    fetchNotes();
  }, []);

  const handleAddNote = async () => {
    if (!text.trim()) return;
    try {
      const res = await api.post("/", { text });
      setNotes([res.data, ...notes]);
      setText("");
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddNote();
    }
  };

  return (
    <div className="app">
      <h1>📝 AI Notes / To-Do</h1>
      <div className="input-group">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Write a note..."
        />
        <button onClick={handleAddNote}>Add</button>
      </div>
      <NoteList notes={notes} setNotes={setNotes} />
    </div>
  );
}

export default App;