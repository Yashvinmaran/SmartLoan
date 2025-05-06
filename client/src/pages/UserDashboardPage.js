// client/src/pages/UserDashboardPage.js
import React, { useState, useEffect, useContext } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import './UserDashboardPage.css';
import { AuthContext } from '../contexts/AuthContext'; // Import AuthContext
import Toast from '../components/ui/Toast';

function UserDashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [currentPaymentOrderId, setCurrentPaymentOrderId] = useState(null);
  const [currentPaymentAmount, setCurrentPaymentAmount] = useState(null);
  const [currentLoanId, setCurrentLoanId] = useState(null);
  const { user } = useContext(AuthContext); // Get user and token from context
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState(null);

  const showToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
      setToastType(null);
    }, 3000);
  };

  const token = user?.token;

  const fetchDashboardData = React.useCallback(async () => {
    try {
      const response = await fetch('/api/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`, // Include authorization token
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDashboardData(data.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]); // Re-fetch data if fetchDashboardData changes

  const initiatePayment = async (loanId, amount) => {
    try {
      const response = await fetch(`/api/loans/${loanId}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`, // Include authorization token
        },
      });
      const data = await response.json();
      if (response.ok && data.data && data.data.orderId) {
        setCurrentPaymentOrderId(data.data.orderId);
        setCurrentPaymentAmount(data.data.amount);
        setCurrentLoanId(loanId);
        setPaymentModalVisible(true);
                  showToast('Payment initiated successfully!', 'success');

      } else {
        alert(data.error || 'Failed to initiate payment.');
                  showToast(data.error || 'Failed to initiate payment.', 'error');

      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('Could not initiate payment.');
            showToast('Could not initiate payment.', 'error');

    }
  };

  const handlePaymentSuccess = async (response) => {
    const { order_id, payment_id, razorpay_signature } = response;
    try {
      const verificationResponse = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_id,
          payment_id,
          razorpay_signature,
          loanApplicationId: currentLoanId,
        }),
      });
      const data = await verificationResponse.json();

      if(verificationResponse.ok){
        showToast(data.message, 'success');
        setPaymentModalVisible(false);
        // Refresh dashboard data after successful payment
        fetchDashboardData();
      }
      else{
         showToast("Payment verification failed", 'error');
      }


    } catch (error) {
      console.error('Error verifying payment:', error);
      alert('Payment verification failed.');
            showToast('Payment verification failed.', 'error');

    }
  };

  // Removed handlePaymentError as it is not used

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const showRazorpayModal = async () => {
    const res = await loadRazorpay();

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
            showToast('Razorpay SDK failed to load. Are you online?', 'error');

      return;
    }

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Replace with your key ID
      order_id: currentPaymentOrderId,
      amount: currentPaymentAmount,
      currency: 'INR',
      name: 'MicroLoan Application',
      description: 'Payment for loan application',
      handler: handlePaymentSuccess,
      modal: {
        ondismiss: () => {
          alert('Payment window closed.');
          setPaymentModalVisible(false);
                    showToast('Payment window closed.', 'error');

        },
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return <div>Error loading dashboard: {error}</div>;
  }

  const loanStatusData = dashboardData?.loanApplications?.reduce((acc, loan) => { //Added ?.
    acc[loan.status] = (acc[loan.status] || 0) + 1;
    return acc;
  }, {});

  const chartData = loanStatusData ? Object.keys(loanStatusData).map(status => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    count: loanStatusData[status] || 0,
  })) : [];

  return (
    <div className="user-dashboard-page">
      <h1>User Dashboard</h1>
      {dashboardData && dashboardData.loanApplications && (
        <Card>
          <h2>Your Loan Applications</h2>
          {dashboardData.loanApplications.length > 0 ? (
            <ul className="loan-applications-list">
              {dashboardData.loanApplications.map((loan) => (
                <li key={loan._id}>
                  Loan ID: {loan._id}, Amount: ₹{loan.loanAmount}, Status: {loan.status}
                  {loan.status === 'approved' && (
                    <Button onClick={() => initiatePayment(loan._id, loan.loanAmount)}>
                      Initiate Payment
                    </Button>
                  )}
                  {loan.status === 'payment_initiated' && (
                    <span>Payment Pending</span>
                  )}
                  {loan.status === 'payment_verified' && (
                    <span>Payment Verified</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No loan applications submitted yet.</p>
          )}
        </Card>
      )}

      {chartData.length > 0 && (
        <Card>
          <h2>Loan Application Status</h2>
          <BarChart width={400} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </Card>
      )}

      {paymentModalVisible && currentPaymentOrderId && (
        <div className="payment-modal">
          <Card>
            <h2>Initiate Payment</h2>
            <p>Order ID: {currentPaymentOrderId}</p>
            <p>Amount: ₹{(currentPaymentAmount / 100).toFixed(2)}</p>
            <Button onClick={showRazorpayModal}>Pay Now</Button>
            <Button onClick={() => setPaymentModalVisible(false)}>Cancel</Button>
          </Card>
        </div>
      )}
            {toastMessage && <Toast message={toastMessage} type={toastType} />}

    </div>
  );
}

export default UserDashboardPage;

