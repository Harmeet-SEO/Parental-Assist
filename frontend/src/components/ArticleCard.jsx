import React from "react";
import "./ArticleCard.css";

const ArticleCard = ({ title, date }) => {
  return (
    <div className="article-card">
      <div className="image-placeholder"></div>
      <h4>{title}</h4>
      <p className="date">{date}</p>
    </div>
  );
};

export default ArticleCard;
