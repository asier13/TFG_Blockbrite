import React from 'react';

function ListItem({ title, onClick }) {
  return (
    <div className="list-item" onClick={onClick}>
      <h3>{title}</h3>
    </div>
  );
}

export default ListItem;
