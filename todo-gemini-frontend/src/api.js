import axios from "axios";

export const api = axios.create({
  baseURL: "https://notes-app-with-ai.onrender.com/api/notes", // your backend URL
});
