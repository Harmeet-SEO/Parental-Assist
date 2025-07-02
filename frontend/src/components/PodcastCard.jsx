import React from "react";
import "./PodcastCard.css";

const PodcastCard = ({ title, duration, author, image }) => {
  return (
    <div className="podcast-card">
      {image && <img src={image} alt={title} className="podcast-thumbnail" />}
      <div className="podcast-card__top">
        <h4>{title}</h4>
        <p className="duration">{duration}</p>
      </div>
      <div className="podcast-card__bottom">
        <p className="author">🎙 {author}</p>
        <audio controls>
          <source
            src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
            type="audio/mpeg"
          />
        </audio>
      </div>
    </div>
  );
};

export default PodcastCard;
