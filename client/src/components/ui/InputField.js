// client/src/components/ui/InputField.js
import React from 'react';
import './InputField.css';

function InputField({ label, type, id, value, onChange, required }) {
  return (
    <div className="input-group">
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}

export default InputField;