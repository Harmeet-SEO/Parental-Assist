import React from "react";
import Navbar from "../components/Navbar";
import "./About.css";
import ChatBot from "../components/ChatBot";

export default function About() {
  return (
    <>
      <Navbar />
      <ChatBot />
      <main className="about">
        <section className="about-content">
          <h1 className="about-title">About Parental Assist</h1>
          <p className="about-description">
            We are a team of passionate educators, engineers, and parents
            dedicated to building digital safety tools that empower families.
            With cutting-edge technology and a human-first mindset, we help
            parents navigate modern digital challenges with confidence.
          </p>
          <img
            src="/assets/about-hero.png"
            alt="About visual"
            className="about-image"
          />
        </section>
      </main>
    </>
  );
}
