import React from "react";
import "./ArticleCard.css";

const ArticleCard = ({ title, date, image }) => {
  return (
    <div className="article-card">
      {image ? (
        <img src={image} alt={title} className="article-image" />
      ) : (
        <div className="image-placeholder"></div>
      )}
      <h4>{title}</h4>
      <p className="date">{date}</p>
    </div>
  );
};

export default ArticleCard;
