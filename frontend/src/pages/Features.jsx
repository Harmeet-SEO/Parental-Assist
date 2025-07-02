import React, { useState } from "react";
import "./Features.css";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const faqs = [
  {
    question: "How can this platform help with my child’s education?",
    answer:
      "We connect you with certified educators and provide daily learning tools tailored for your child’s age and syllabus.",
  },
  {
    question: "Is health tracking compatible with wearables?",
    answer:
      "Yes, our health tracking supports most popular smartwatches and wearables.",
  },
  {
    question: "Can I control screen time remotely?",
    answer:
      "Absolutely! Our dashboard lets you set time limits and block/unblock apps remotely.",
  },
  {
    question: "Is this platform safe for kids?",
    answer:
      "100%. We comply with COPPA and GDPR regulations to ensure child data privacy and safety.",
  },
];

export default function Features() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Navbar />
      <Link to="/" className="home-icon">
        🏠
      </Link>

      <main className="features">
        <h1 className="features-title">Smart Tools for Modern Parents</h1>
        <p className="features-subtitle">
          Support your child’s growth with guidance that adapts to your life.
        </p>

        <div data-aos="zoom-in-up" className="features-grid">
          <div className="feature-box">
            <img
              src="/assets/features-icon-education.png"
              alt="Education Help"
            />
            <div>
              <h2>Education Help</h2>
              <p>
                Personalized Learning Support
                <br />
                Discover tailored educational activities, progress tracking, and
                expert-backed resources to help your child thrive academically.
              </p>
            </div>
          </div>
          <div className="feature-box">
            <img
              src="/assets/features-icon-screen.png"
              alt="Screen Time Control"
            />
            <div>
              <h2>Screen Time Control</h2>
              <p>
                Healthy Digital Habits
                <br />
                Set screen time limits, get usage insights, and pause access
                with a tap – all synced to your parenting goals.
              </p>
            </div>
          </div>
          <div className="feature-box">
            <img
              src="/assets/features-icon-health.png"
              alt="Health & Wellness"
            />
            <div>
              <h2>Health & Wellness at a Glance</h2>
              <p>
                Easily monitor your child’s sleep, nutrition, and physical
                activity with gentle prompts and logs you can trust.
              </p>
            </div>
          </div>
          <div className="feature-box">
            <img src="/assets/features-icon-tips.png" alt="Parenting Tips" />
            <div>
              <h2>Parenting Tips</h2>
              <p>
                Expert-Backed Parenting: Guidance
                <br />
                From tantrums to tech, get curated advice, articles, and Q&A
                from pediatricians, psychologists, and fellow parents.
              </p>
            </div>
          </div>
        </div>

        <Link to="/signup" className="cta-btn">
          Get Started – It’s Free
        </Link>

        <div className="faq-section">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <div className="faq-container">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`faq-item ${openIndex === index ? "open" : ""}`}
              >
                <div className="faq-question" onClick={() => toggleFAQ(index)}>
                  {faq.question}
                </div>
                {openIndex === index && (
                  <div className="faq-answer">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
          <a href="/" className="home-icon">
            🏠
          </a>
        </div>
      </main>
    </>
  );
}
