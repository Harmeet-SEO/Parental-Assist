import React from "react";
import "./PodcastCard.css";

const PodcastCard = ({ title, duration, author }) => {
  return (
    <div className="podcast-card">
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
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  );
};

export default PodcastCard;
