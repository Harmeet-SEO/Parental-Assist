import React from "react";
import "./EditorPickCard.css";

const EditorPickCard = ({ number, title }) => {
  return (
    <div className="editor-pick-card">
      <div className="number-circle">{number}</div>
      <h5>{title}</h5>
    </div>
  );
};

export default EditorPickCard;
