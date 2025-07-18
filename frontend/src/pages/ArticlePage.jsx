import React from "react";
import "./ArticlePage.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChatBot from "../components/ChatBot";

const ArticlePage = () => {
  return (
    <>
      <Navbar />
      <ChatBot />
      <div className="article-container">
        <div className="article-header">
          <span className="category">WORLD</span>
          <h1>Lost cat found the way back to her home</h1>
          <p className="article-meta">
            By John Doe · 13 June 2025 · 3 min read
          </p>

          <div className="article-social">
            <i>🔗</i>
            <i>🐦</i>
            <i>📘</i>
            <i>📤</i>
          </div>
        </div>

        <img
          src="/assets/article1.jpg"
          alt="Lost cat"
          className="article-image"
        />

        <div className="article-content">
          <p>
            A cat that had been missing for weeks surprised everyone after
            finding her way home across several miles. The family was
            overwhelmed with joy and couldn’t believe how their furry friend
            managed to navigate her way back.
          </p>

          <p>
            Despite the distance, the cat made her way back, guided by instinct.
            Many believe pets have a sixth sense that helps them reconnect with
            their loved ones, even across long distances.
          </p>

          <p>
            Local news outlets praised the story, calling it a feel-good
            headline everyone needed. But beyond the headlines, this
            heartwarming journey holds some important parenting lessons too.
          </p>

          <p>
            At Parental Assist, we believe that small stories like these can be
            used to teach children values such as empathy, responsibility, and
            emotional connection. Talking to your kids about what this cat went
            through, and how her family welcomed her back, can be a great way to
            introduce the topic of caring for others — whether pets, friends, or
            family.
          </p>

          <p>
            You can also use this moment to involve your children in simple,
            caring tasks — like feeding pets, checking water bowls, or helping
            with lost-pet posters in your neighborhood. These experiences not
            only build character but also nurture emotional intelligence early
            on.
          </p>

          <p>
            Want to turn this into a learning opportunity? Try asking your
            child:
            <ul>
              <li>“What do you think the cat felt while she was lost?”</li>
              <li>“How would you help a pet if it was scared?”</li>
              <li>“Why is it important to care for animals and people?”</li>
            </ul>
          </p>

          <p>
            Moments like these are more than just news — they’re everyday
            reminders of love, resilience, and the importance of family. And
            that makes them perfect for every Parental Assist home.
          </p>

          <div className="related-images">
            <img src="/assets/article2.jpg" alt="Image 1" />
            <img src="/assets/article3.jpg" alt="Image 2" />
          </div>
        </div>

        {/* Comments */}
        <div className="comments-section">
          <h3>Comments</h3>
          <input type="text" placeholder="Add your thoughts..." />
          <div className="reaction-icons">
            <button>👍</button>
            <button>👎</button>
          </div>
        </div>

        {/* Related Articles */}
        <div className="related-articles">
          <h3>Related</h3>
          <div className="articles-grid">
            <div className="article-card">
              <img src="/assets/article4.jpg" alt="shelter" />
              <h4>All pets from shelter were adopted</h4>
              <p>11 June 2025</p>
            </div>
            <div className="article-card">
              <img src="/assets/article5.jpg" alt="cycling" />
              <h4>Cycling competition made history</h4>
              <p>10 June 2025</p>
            </div>
            <div className="article-card">
              <img src="/assets/article6.jpg" alt="budget" />
              <h4>Cooking on budget</h4>
              <p>9 June 2025</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ArticlePage;
