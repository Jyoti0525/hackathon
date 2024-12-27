// src/components/ui/card.js
import React from 'react';

const Card = ({ children, className }) => {
  return (
    <div className={`p-4 shadow-lg rounded-lg bg-white ${className}`}>
      {children}
    </div>
  );
};

export default Card;
