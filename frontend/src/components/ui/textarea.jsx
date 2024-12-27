// src/components/ui/textarea.js
import React from 'react';

const Textarea = ({ value, onChange, placeholder, className }) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full p-2 border border-gray-300 rounded ${className}`}
      rows={5}
    />
  );
};

export default Textarea;
