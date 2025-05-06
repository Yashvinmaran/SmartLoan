// client/src/components/LoanForm.js
import React, { useState } from 'react';

function LoanForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    loanAmount: '',
    loanTerm: '',
    purpose: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        setFormData({
          fullName: '',
          email: '',
          loanAmount: '',
          loanTerm: '',
          purpose: '',
        });
      } else {
        alert(data.error || 'Failed to submit application.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An unexpected error occurred.');
    }
  };

  const formContainerStyle = {
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
  };

  const formTitleStyle = {
    fontSize: '1.8em',
    marginBottom: '20px',
    color: '#333',
    textAlign: 'center',
  };

  const formGroupStyle = {
    marginBottom: '20px',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    color: '#555',
    fontWeight: 'bold',
    fontSize: '1em',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid #ced4da',
    borderRadius: '4px',
    fontSize: '1em',
    boxSizing: 'border-box',
  };

  const textareaStyle = {
    ...inputStyle,
    resize: 'vertical',
    minHeight: '100px',
  };

  const submitButtonStyle = {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1.1em',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out',
    width: '100%',
  };

  const submitButtonHoverStyle = {
    backgroundColor: '#218838',
  };

  const mediaQueryStyle = `@media (max-width: 576px) {
    .loan-form-container {
      padding: 20px;
    }
    .loan-form-container h2 {
      font-size: 1.5em;
      margin-bottom: 15px;
    }
    .form-group {
      margin-bottom: 15px;
    }
    .form-group label {
      font-size: 0.9em;
    }
    .form-group input[type="text"],
    .form-group input[type="email"],
    .form-group input[type="number"],
    .form-group textarea,
    .submit-button {
      font-size: 1em;
      padding: 10px;
    }
  }`;

  return (
    <div style={formContainerStyle} className="loan-form-container">
      <style>{mediaQueryStyle}</style> {/* Inject media query style */}
      <h2 style={formTitleStyle}>Loan Application Details</h2>
      <form onSubmit={handleSubmit}>
        <div style={formGroupStyle}>
          <label htmlFor="fullName" style={labelStyle}>Full Name:</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>
        <div style={formGroupStyle}>
          <label htmlFor="email" style={labelStyle}>Email Address:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>
        <div style={formGroupStyle}>
          <label htmlFor="loanAmount" style={labelStyle}>Loan Amount (₹):</label>
          <input
            type="number"
            id="loanAmount"
            name="loanAmount"
            value={formData.loanAmount}
            onChange={handleChange}
            min="100"
            required
            style={inputStyle}
          />
        </div>
        <div style={formGroupStyle}>
          <label htmlFor="loanTerm" style={labelStyle}>Loan Term (months):</label>
          <input
            type="number"
            id="loanTerm"
            name="loanTerm"
            value={formData.loanTerm}
            onChange={handleChange}
            min="1"
            max="360"
            required
            style={inputStyle}
          />
        </div>
        <div style={formGroupStyle}>
          <label htmlFor="purpose" style={labelStyle}>Purpose of Loan (Optional):</label>
          <textarea
            id="purpose"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            style={textareaStyle}
          />
        </div>
        <button type="submit" style={submitButtonStyle} onMouseOver={(e) => Object.assign(e.target.style, submitButtonHoverStyle)} onMouseOut={(e) => Object.assign(e.target.style, submitButtonStyle)}>
          Submit Application
        </button>
      </form>
    </div>
  );
}

export default LoanForm;