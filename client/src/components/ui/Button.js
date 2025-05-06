// client/src/components/ui/Button.js
import React from 'react';
import './Button.css';

function Button({ type, className, onClick, children }) {
  return (
    <button type={type} className={`button ${className}`} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;