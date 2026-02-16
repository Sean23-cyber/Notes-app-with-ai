import React, { useState } from "react";
import { api } from "../api"; // Adjust path if needed

export default function Note({ note, onDelete, onUpdate, onGenerateSummary }) {
  const [summary, setSummary] = useState(note.summary || "");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(note.text);

  const handleSummarize = async () => {
    setLoading(true);
    try {
      const res = await api.post(`/summarize/${note._id}`);
      const summaryText = res.data.summary;
      setSummary(summaryText);
      onGenerateSummary(note._id, summaryText);
    } catch (err) {
      console.error(err);
      setSummary("⚠️ Failed to summarize");
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/${note._id}`);
      onDelete(note._id);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleStartEdit = () => {
    setEditing(true);
    setEditText(note.text);
  };

  const handleSaveEdit = async () => {
    if (!editText.trim()) return;
    try {
      const res = await api.put(`/${note._id}`, { text: editText });
      onUpdate(note._id, res.data);
      setEditing(false);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleCancelEdit = () => {
    setEditText(note.text);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="note">
        <input
          className="edit-input"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSaveEdit();
            if (e.key === "Escape") handleCancelEdit();
          }}
          autoFocus
        />
        <div>
          <button onClick={handleSaveEdit}>Save</button>
          <button className="secondary" onClick={handleCancelEdit}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="note">
      <p>{note.text}</p>
      {summary && <p className="summary">{summary}</p>}
      {!summary && (
        <button onClick={handleSummarize} disabled={loading} className="secondary">
          {loading ? "Summarizing..." : "Summarize"}
        </button>
      )}
      <div>
        <button onClick={handleStartEdit}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
}