import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import './AuthPage.css';
import Toast from '../components/ui/Toast';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState(null);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const showToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
      setToastType(null);
    }, 3000);
  };

  const handleAuthToggle = () => {
    setIsLogin(!isLogin);
  };

  const handleLogin = async (credentials) => {
    try {
      const response = await axios.post('/api/auth/login', credentials);
      if (response.data.success) {
        login(response.data.user); // Update AuthContext with user data including token
        navigate('/user/dashboard');
        showToast('Login successful!', 'success');
      } else {
        showToast(response.data.error || 'Login failed', 'error');
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Login failed', 'error');
    }
  };

  const handleRegister = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      if (response.data.success) {
        setIsLogin(true);
        showToast('Registration successful! Please log in.', 'success');
      } else {
        showToast(response.data.error || 'Registration failed', 'error');
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Registration failed', 'error');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        {isLogin ? (
          <Login onLogin={handleLogin} />
        ) : (
          <Register onRegister={handleRegister} />
        )}
        <button type="button" className="auth-toggle-button" onClick={handleAuthToggle}>
          {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
        </button>
      </div>
      {toastMessage && <Toast message={toastMessage} type={toastType} />}
    </div>
  );
}

export default AuthPage;
