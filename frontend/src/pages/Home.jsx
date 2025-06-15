import React from "react";
import "./Home.css";
import ArticleCard from "../components/ArticleCard";
import { Link } from "react-router-dom";
import EditorPickCard from "../components/EditorPickCard";
import PodcastCard from "../components/PodcastCard";
import Header from "../components/Header";

const Home = () => {
  return (
    <div className="homepage">
      {/* === HEADER === */}
      <Header />

      <nav className="nav-links">
        <span>LATEST</span>
        <span>WORLD</span>
        <span>SPORTS</span>
        <span>CULTURE</span>
        <span>ECONOMY</span>
      </nav>

      <div className="homepage__content">
        <div className="left-column">
          {/* === PODCAST HIGHLIGHT === */}
          <section className="podcast-highlight">
            <h3>🎧 Podcast spotlight</h3>
            <PodcastCard
              title="DAILY MINUTE: Reports from around the world"
              duration="22:14"
              author="Media Studio"
            />
          </section>
        </div>

        <div className="right-column">
          {/* === FEATURED ARTICLES === */}
          <section className="featured-articles">
            <div className="article-grid">
              <ArticleCard
                title="Best summer reads for your vacation"
                date="13 June 2025"
              />
              <ArticleCard
                title="Footballer leads Argentina to victory"
                date="12 June 2025"
              />
              <ArticleCard
                title="Lost cat found the way back to her home"
                date="11 June 2025"
              />
            </div>
          </section>
        </div>
      </div>

      {/* === FOOD AND DRINK === */}
      <section className="food-section">
        <h3>Food and Drink</h3>
        <div className="article-row">
          <ArticleCard
            title="One hour for the next kombucha"
            date="10 June 2025"
          />
          <ArticleCard title="Shoemaker's herb hotdogs" date="9 June 2025" />
          <ArticleCard title="Cooking on a budget" date="8 June 2025" />
          <ArticleCard title="Best alcohol-free cocktails" date="7 June 2025" />
        </div>
      </section>

      {/* === EDITOR'S PICKS === */}
      <section className="editors-picks">
        <h3>Editor’s picks</h3>
        <div className="editor-pick-grid">
          <EditorPickCard
            number={1}
            title="People are happy and healthy everywhere"
          />
          <EditorPickCard
            number={2}
            title="Hockey Championship is about to start"
          />
          <EditorPickCard number={3} title="Finally a good theatre!" />
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="homepage__footer">
        <div className="footer-links">
          <span>About</span>
          <span>Authors</span>
          <span>Archive</span>
          <span>Terms and Conditions</span>
          <span>Cookie Policy</span>
        </div>
        <div className="social-icons">🔗 🌐 📧</div>
        <p>&copy; 2025 Parental Assist</p>
      </footer>
    </div>
  );
};

export default Home;
