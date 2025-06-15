import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';
import "./Home.css";
import Navbar from "../components/Navbar";

const testimonials = [
  {
    name: "John Doe",
    text: "This app is amazing!",
    image: "/assets/testi1.png"
  },
  {
    name: "Jane Smith",
    text: "Helped me a lot with parenting.",
    image: "/assets/testi2.png"
  },
  {
    name: "David Kumar",
    text: "Highly recommend it.",
    image: "/assets/testi3.png"
  },
  {
    name: "Aisha Khan",
    text: "Life-changing experience!",
    image: "/assets/testi4.png"
  },
  {
    name: "Ravi Patel",
    text: "Simple, smart and useful.",
    image: "/assets/testi5.png"
  },
  {
    name: "Emily Chen",
    text: "Perfect for working parents.",
    image: "/assets/testi6.jpg"
  }
];

export default function Home() {
  const [showSetOne, setShowSetOne] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    AOS.refresh();

    const interval = setInterval(() => {
      setShowSetOne((prev) => !prev);
      setIndex((prev) => (prev + 3) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar />
      <main className="home">
        <section className="hero">
          <div className="hero-left" data-aos="fade-right">
            <h1>Assistive <br />Parental <br />Platform</h1>
            <p>Guidance, Tools and Support to help you navigate your child’s overall well being.</p>
          </div>
          <div className="hero-right" data-aos="fade-left">
            <img src="/assets/hero-girl.png" alt="Hero visual" />
          </div>
        </section>

<section className="features-icons" id="features">
  <h2 className="section-heading">Empowering You with Smart Tools</h2>
  <p className="section-subtext">Everything you need to guide your child — smarter, better, faster.</p>

  <div className="feature-items-wrapper">
    <div className="feature-item" data-aos="fade-up" data-aos-delay="100">
      <img src="/assets/icon-education.png" alt="Education" />
      <h3>Education Help</h3>
      <p>Professional Teacher always online to support your child’s education</p>
    </div>
    <div className="feature-item" data-aos="fade-up" data-aos-delay="200">
      <img src="/assets/icon-health.png" alt="Health Tracker" />
      <h3>Health Tracker</h3>
      <p>Daily monitoring like heartbeat, EVM and other tracking is available.</p>
    </div>
    <div className="feature-item" data-aos="fade-up" data-aos-delay="300">
      <img src="/assets/icon-screen.png" alt="Screen Time" />
      <h3>Screen Time Control</h3>
      <p>Assist more impaired content plan, which can align with each parent’s requirement.</p>
    </div>
    <div className="feature-item" data-aos="fade-up" data-aos-delay="400">
      <img src="/assets/icon-tips.png" alt="Parenting Tips" />
      <h3>Parenting Tips</h3>
      <p>Helping parents get best advice for their little ones.</p>
    </div>
  </div>
</section>


        <section className="testimonials" data-aos="fade-in">
          <h2>What Parents are saying</h2>
          <div className="testimonial-carousel">
            {testimonials.slice(showSetOne ? 0 : 3, showSetOne ? 3 : 6).map((t, i) => (
              <div className="testimonial-card" key={i}>
                <img src={t.image} alt={t.name} className="testimonial-img" />
                <p>"{t.text}"</p>
                <h5>- {t.name}</h5>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
