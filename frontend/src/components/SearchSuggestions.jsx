import React from "react";
import { useNavigate } from "react-router-dom";
import "./SearchSuggestions.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faBox,
  faPodcast,
} from "@fortawesome/free-solid-svg-icons";

export default function SearchSuggestions({ results, onClose }) {
  const navigate = useNavigate();

  if (!results || results.length === 0) return null;

  const handleClick = (item) => {
    onClose();
    if (item.type === "podcast") {
      navigate("/podcasts");
    } else if (item.link) {
      navigate(item.link);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "article":
        return faBookOpen;
      case "product":
        return faBox;
      case "podcast":
        return faPodcast;
      default:
        return faBookOpen;
    }
  };
  console.log("Suggestions shown:", results);

  return (
    <div className="suggestions-dropdown">
      {results.map((item, index) => (
        <div
          key={index}
          className="suggestion-card"
          onClick={() => handleClick(item)}
        >
          <FontAwesomeIcon
            icon={getIcon(item.type)}
            className="suggestion-icon"
          />
          <div className="suggestion-text">
            <strong>{item.label}</strong>
            <span className="result-type">{item.type}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
