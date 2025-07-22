import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "./Feedback.css";
import ChatBot from "../components/ChatBot";

export default function Feedback() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackList, setFeedbackList] = useState([
    { id: 1, rating: 5, text: "Great platform! Very helpful for parents." },
    { id: 2, rating: 4, text: "Useful features, but can improve UI a bit." },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating > 0 && feedbackText.trim() !== "") {
      const newFeedback = {
        id: feedbackList.length + 1,
        rating,
        text: feedbackText,
      };
      setFeedbackList([newFeedback, ...feedbackList]);
      setRating(0);
      setHover(0);
      setFeedbackText("");
    }
  };

  return (
    <>
      <Navbar />
      <ChatBot />
      <main className="feedback-page">
        <h1>Feedback & Rating</h1>

        {/* Feedback Form */}
        <form className="feedback-form" onSubmit={handleSubmit}>
          <h2>Rate our Platform</h2>

          {/* Star Rating */}
          <div className="star-rating">
            {[...Array(5)].map((star, index) => {
              const ratingValue = index + 1;
              return (
                <label key={index}>
                  <input
                    type="radio"
                    name="rating"
                    value={ratingValue}
                    onClick={() => setRating(ratingValue)}
                  />
                  <span
                    className="star"
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(0)}
                    style={{
                      color:
                        ratingValue <= (hover || rating) ? "#FF867C" : "#ccc",
                      cursor: "pointer",
                    }}
                  >
                    &#9733;
                  </span>
                </label>
              );
            })}
          </div>

          {/* Feedback Text */}
          <textarea
            name="feedbackText"
            placeholder="Write your feedback..."
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            required
          ></textarea>

          <button type="submit">Submit Feedback</button>
        </form>

        {/* Feedback List */}
        <div className="feedback-list">
          {feedbackList.map((fb) => (
            <div key={fb.id} className="feedback-card">
              <div className="stars">
                {"★".repeat(fb.rating)}
                {"☆".repeat(5 - fb.rating)}
              </div>
              <p>{fb.text}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
