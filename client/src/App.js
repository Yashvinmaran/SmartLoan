// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import LoanApplicationPage from './pages/LoanApplicationPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { AuthProvider, AuthContext } from './contexts/AuthContext';

function App() {
  const appContainerStyle = {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
    width: '90%',
    maxWidth: '960px',
  };

  const bodyStyle = {
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.6',
    backgroundColor: '#f4f4f4',
    color: '#333',
    margin: 0,
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  };

  const mediaQueryStyle = `@media (max-width: 768px) {
    .app-container {
      width: 95%;
      margin: 15px;
      padding: 20px;
    }
  }`;

  return (
    <AuthProvider>
      <style>
        {`
          body {
            ${Object.entries(bodyStyle)
              .map(([key, value]) => `${key}: ${value};`)
              .join('\n')}
          }
          .app-container {
            ${Object.entries(appContainerStyle)
              .map(([key, value]) => `${key}: ${value};`)
              .join('\n')}
          }
          ${mediaQueryStyle}
        `}
      </style>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/apply-loan" element={<ProtectedRoute><LoanApplicationPage /></ProtectedRoute>} />
            <Route path="/user/dashboard" element={<ProtectedRoute><UserDashboardPage /></ProtectedRoute>} />
            <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboardPage /></AdminProtectedRoute>} />
            <Route path="/" element={<ProtectedRoute><UserDashboardPage /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

const ProtectedRoute = ({ children }) => {
  const { user } = React.useContext(AuthContext);
  return user ? children : <Navigate to="/auth" />;
};

const AdminProtectedRoute = ({ children }) => {
  const { user } = React.useContext(AuthContext);
  return user && user.isAdmin ? children : <Navigate to="/auth" />;
};

export default App;
