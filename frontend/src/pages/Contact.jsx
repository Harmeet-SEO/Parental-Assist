import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "./Contact.css";

export default function Contact() {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      title: "How to manage screen time for kids?",
      description:
        "Looking for tips on balancing screen time and outdoor activities.",
    },
    {
      id: 2,
      title: "Best books for early learning?",
      description: "What are some great books for 3-5 year old children?",
    },
  ]);

  const [newQuestion, setNewQuestion] = useState({
    title: "",
    description: "",
  });

  const handleChange = (e) => {
    setNewQuestion({ ...newQuestion, [e.target.name]: e.target.value });
  };

  const handlePost = (e) => {
    e.preventDefault();
    if (newQuestion.title && newQuestion.description) {
      const newEntry = {
        id: questions.length + 1,
        title: newQuestion.title,
        description: newQuestion.description,
      };
      setQuestions([newEntry, ...questions]);
      setNewQuestion({ title: "", description: "" });
    }
  };

  return (
    <>
      <Navbar />
      <main className="contact-page">
        <h1>Community Forum</h1>

        {/* Ask a Question Form */}
        <form className="forum-form" onSubmit={handlePost}>
          <h2>Ask a Question</h2>
          <input
            type="text"
            name="title"
            placeholder="Question Title"
            value={newQuestion.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Question Description"
            value={newQuestion.description}
            onChange={handleChange}
            required
          ></textarea>
          <button type="submit">Post Question</button>
        </form>

        {/* List of Questions */}
        <div className="forum-questions">
          {questions.map((q) => (
            <div key={q.id} className="forum-question-card">
              <h3>{q.title}</h3>
              <p>{q.description}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
