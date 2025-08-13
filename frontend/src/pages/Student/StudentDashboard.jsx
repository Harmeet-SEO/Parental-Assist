import React, { useEffect, useState } from "react";
import "./StudentDashboard.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import StudentNavbar from "../../components/Student/StudentNavbar";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [chartData, setChartData] = useState([]);

  const [student, setStudent] = useState({
    name: "Student",
    age: 8,
    progress: 0,
    badges: [],
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    const fetchUserData = async () => {
      try {
        const userRes = await axios.get("http://localhost:5000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { firstname, lastname } = userRes.data;

        setStudent((prev) => ({
          ...prev,
          name: `${firstname} ${lastname}`.trim() || "Student",
        }));
      } catch (err) {
        console.error("Failed to load user profile", err);
      }
    };

    fetchUserData();

    axios
      .get("http://localhost:5000/api/student/completed", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data.activities || [];

        // Calculate progress
        const total = data.length;
        const correct = data.filter((a) => a.is_correct).length;
        const progress = total > 0 ? Math.round((correct / total) * 100) : 0;
        const badges = [];

        // === New Badge Calculation ===
        // 1. Get last 7 days
        const dayMap = {};
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          const key = d.toDateString();
          dayMap[key] = { attempted: false, correct: false };
        }

        // 2. Fill dayMap
        let currentStreak = 0;
        let maxStreak = 0;
        let consecutiveDays = 0;
        let prevDate = null;
        const daysWithActivity = new Set();

        data.forEach((a) => {
          const d = new Date(a.answered_on);
          const key = d.toDateString();
          dayMap[key] = {
            attempted: true,
            correct: a.is_correct,
          };

          daysWithActivity.add(key);

          if (a.is_correct) {
            currentStreak++;
            maxStreak = Math.max(maxStreak, currentStreak);
          } else {
            currentStreak = 0;
          }

          if (prevDate) {
            const diff = (d - prevDate) / (1000 * 60 * 60 * 24);
            if (diff === 1) {
              consecutiveDays++;
            } else if (diff > 1) {
              consecutiveDays = 1;
            }
          } else {
            consecutiveDays = 1;
          }

          prevDate = d;
        });

        // === Award Badges ===
        if (correct >= 1) badges.push("Started Strong");
        if (correct >= 3) badges.push("Brainy Champ");
        if (total >= 5 && correct / total >= 0.8) badges.push("Accuracy Hero");
        if (consecutiveDays >= 2) badges.push("Starter Streak");
        if (daysWithActivity.size >= 5) badges.push("Weekly Warrior");
        if (maxStreak >= 3) badges.push("Correct Streak");

        setStudent((prev) => ({
          ...prev,
          progress,
          badges,
        }));

        setActivities(data);
        // 1. Create a date-keyed object for last 7 days
        const chartMap = {};
        for (let i = 6; i >= 0; i--) {
          const day = new Date(today);
          day.setDate(today.getDate() - i);
          const label = day.toLocaleDateString("en-US", { weekday: "short" });
          chartMap[label] = 0;
        }

        // 2. Fill in the correct counts
        data.forEach((act) => {
          const answeredDate = new Date(act.answered_on);
          const label = answeredDate.toLocaleDateString("en-US", {
            weekday: "short",
          });
          if (chartMap[label] !== undefined && act.is_correct) {
            chartMap[label] += 1;
          }
        });

        // 3. Format for Recharts
        const formatted = Object.entries(chartMap).map(([day, correct]) => ({
          day,
          correct,
        }));

        setChartData(formatted);
      })
      .catch(console.error);
  }, [token]);

  return (
    <>
      <StudentNavbar />
      <div className="student-dashboard">
        <h1 className="student-welcome">Welcome back, {student.name}! 🎉</h1>
        <p className="student-age">Age: {student.age} years</p>

        <section className="progress-section">
          <h2>Your Weekly Progress</h2>
          <div className="progress-bar">
            <div
              className="filled-bar"
              style={{ width: `${student.progress}%` }}
            ></div>
          </div>
          <p>{student.progress}% completed this week</p>
        </section>

        <section className="badges-section">
          <h2>🏅 Badges You've Earned</h2>
          {student.badges.length > 0 ? (
            <ul className="badge-list">
              {student.badges.map((badge, i) => (
                <li key={i}>{badge}</li>
              ))}
            </ul>
          ) : (
            <p>No badges earned yet. Keep going!</p>
          )}
        </section>

        <section className="chart-section">
          <h2>📊 Weekly Performance</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="correct" stroke="#4caf50" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p>No data yet for chart. Complete some activities!</p>
          )}
        </section>

        <button
          className="activity-btn"
          onClick={() => navigate("/student/activity")}
        >
          Start Today's Activity
        </button>
      </div>
    </>
  );
}
