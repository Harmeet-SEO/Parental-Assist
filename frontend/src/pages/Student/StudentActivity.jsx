import React, { useState, useEffect } from "react";
import "./StudentActivity.css";
import activities from "../../data/studentActivities";
import { api } from "../../api";
import StudentNavbar from "../../components/Student/StudentNavbar";

export default function StudentActivity() {
  const [activity, setActivity] = useState(null);
  const [selected, setSelected] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    // Pick one activity randomly
    const randomActivity =
      activities[Math.floor(Math.random() * activities.length)];
    setActivity(randomActivity);
  }, []);

  const handleSubmit = async () => {
    if (!activity || !selected) return;

    const isCorrect = selected === activity.answer;
    setFeedback(
      isCorrect
        ? "🎉 Correct! You're amazing!"
        : "❌ Not quite! Give it another try!"
    );

    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/api/student/complete-activity",
        {
          question: activity.question,
          is_correct: isCorrect,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Activity recorded.");
    } catch (error) {
      console.error("Failed to record activity", error);
    }
  };

  if (!activity) return <p>Loading activity...</p>;

  return (
    <>
      {" "}
      <StudentNavbar />
      <div className="student-activity">
        <h2>Today's Activity 🧠</h2>
        <p className="question">{activity.question}</p>

        <div className="options">
          {activity.options.map((opt, i) => (
            <button
              key={i}
              className={`option-btn ${selected === opt ? "selected" : ""}`}
              onClick={() => setSelected(opt)}
            >
              {opt}
            </button>
          ))}
        </div>

        <button onClick={handleSubmit} className="submit-btn">
          Submit Answer
        </button>

        {feedback && <p className="feedback">{feedback}</p>}
      </div>
    </>
  );
}
