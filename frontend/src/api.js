import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000", // 👈 your Flask backend
  headers: {
    "Content-Type": "application/json",
  },
});