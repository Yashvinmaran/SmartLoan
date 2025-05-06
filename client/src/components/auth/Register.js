// client/src/components/auth/Register.js
import React, { useState } from 'react';
import InputField from '../ui/InputField';
import Button from '../ui/Button';
import './Register.css';

function Register({ onRegister }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister({ username, email, password });
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <InputField
        label="Username"
        type="text"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <InputField
        label="Email Address"
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <InputField
        label="Password"
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit" className="register-button">
        Register
      </Button>
    </form>
  );
}

export default Register;