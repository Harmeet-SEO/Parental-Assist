import React from "react";
import "./HomeBanner.css";

const HomeBanner = () => {
  return (
    <div className="banner">
      <div className="banner-text">
        <h1>Welcome to Parental Assist</h1>
        <p>
          Your go-to space for parenting tips, podcasts, and peace of mind 💡
        </p>
        <button className="banner-btn">Explore Articles</button>
      </div>
    </div>
  );
};

export default HomeBanner;
