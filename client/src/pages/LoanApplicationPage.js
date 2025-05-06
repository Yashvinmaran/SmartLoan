// client/src/pages/LoanApplicationPage.js
import React, { useState } from 'react';
import InputField from '../components/ui/InputField';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import './LoanApplicationPage.css';

function LoanApplicationPage() {
  const [loanAmount, setLoanAmount] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [purpose, setPurpose] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Replace with actual API call to submit loan application
    console.log('Submitting loan application:', { loanAmount, loanTerm, purpose });
    try {
      const response = await fetch('/api/loans/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include authorization token here
        },
        body: JSON.stringify({ loanAmount, loanTerm, purpose }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setLoanAmount('');
        setLoanTerm('');
        setPurpose('');
      } else {
        alert(data.error || 'Failed to submit application.');
      }
    } catch (error) {
      console.error('Error submitting loan application:', error);
      alert('An unexpected error occurred.');
    }
  };

  return (
    <div className="loan-application-page">
      <h1>Apply for a Loan</h1>
      <Card>
        <form onSubmit={handleSubmit} className="loan-application-form">
          <InputField
            label="Loan Amount (₹)"
            type="number"
            id="loanAmount"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            required
          />
          <InputField
            label="Loan Term (months)"
            type="number"
            id="loanTerm"
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
            required
          />
          <InputField
            label="Purpose of Loan (Optional)"
            type="text"
            id="purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          />
          <Button type="submit" className="apply-button">
            Submit Application
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default LoanApplicationPage;