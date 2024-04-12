import React from 'react';

function Card({ image, title, description, onActionClick }) {
  return (
    <div className="card">
      <img src={image} alt={title} className="card-image" />
      <h3>{title}</h3>
      <p>{description}</p>
      <button onClick={onActionClick}>Ver Más</button>
    </div>
  );
}

export default Card;
