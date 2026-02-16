import React from "react";
import Note from "./Note";

export default function NoteList({ notes, setNotes }) {
  const removeNote = (id) => {
    setNotes(notes.filter((n) => n._id !== id));
  };

  const updateNote = (id, updatedNote) => {
    setNotes(notes.map((n) => (n._id === id ? updatedNote : n)));
  };

  const generateSummary = (id, summaryText) => {
    setNotes(notes.map((n) => (n._id === id ? { ...n, summary: summaryText } : n)));
  };

  return (
    <div className="note-list">
      {notes.map((note) => (
        <Note
          key={note._id}
          note={note}
          onDelete={removeNote}
          onUpdate={updateNote}
          onGenerateSummary={generateSummary}
        />
      ))}
      {notes.length === 0 && (
        <p style={{ textAlign: "center", color: "#888", fontStyle: "italic" }}>
          No notes yet. Add one above!
        </p>
      )}
    </div>
  );
}