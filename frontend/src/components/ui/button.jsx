// src/components/ui/button.js
import React from 'react';

const Button = ({ onClick, className, children, type = 'button' }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${className}`}
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;
