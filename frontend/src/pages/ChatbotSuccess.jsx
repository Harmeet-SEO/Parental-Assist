// replace file with:
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function ChatbotSuccess() {
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      try {
        await api.post("/api/mark-chatbot-paid");
      } catch (e) {
        console.error("mark paid failed:", e);
      } finally {
        localStorage.setItem("chatbot_paid", "true");
        navigate("/");
      }
    })();
  }, [navigate]);

  return <h2>✅ Payment Successful. Enjoy ChatBot!</h2>;
}
