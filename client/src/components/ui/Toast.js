// client/src/components/ui/Toast.js
import React, { useState, useEffect } from 'react';
import './Toast.css';

function Toast({ message, type, duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) {
          onClose();
        }
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) {
    return null;
  }

  const className = `toast ${type}`; // type can be 'success', 'error', etc.

  return (
    <div className={className}>
      {message}
    </div>
  );
}

export default Toast;