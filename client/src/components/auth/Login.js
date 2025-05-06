// client/src/components/auth/Login.js
import React, { useState } from 'react';
import InputField from '../ui/InputField';
import Button from '../ui/Button';
import './Login.css';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ email, password });
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
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
      <Button type="submit" className="login-button">
        Log In
      </Button>
    </form>
  );
}

export default Login;