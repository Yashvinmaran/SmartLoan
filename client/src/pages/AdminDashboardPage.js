// client/src/pages/AdminDashboardPage.js
import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import './AdminDashboardPage.css';

function AdminDashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filteredApplications, setFilteredApplications] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/admin/dashboard', {
          headers: {
            // Include admin authorization token here
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
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (dashboardData && dashboardData.recentApplications) {
      if (filterStatus === 'all') {
        setFilteredApplications(dashboardData.recentApplications);
      } else {
        setFilteredApplications(
          dashboardData.recentApplications.filter((app) => app.status === filterStatus)
        );
      }
    }
  }, [dashboardData, filterStatus]);

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };

  if (loading) {
    return <div>Loading admin dashboard data...</div>;
  }

  if (error) {
    return <div>Error loading admin dashboard: {error}</div>;
  }

  return (
    <div className="admin-dashboard-page">
      <h1>Admin Dashboard</h1>
      {dashboardData && (
        <>
          <div className="dashboard-summary">
            <Card>Total Applications: {dashboardData.totalApplications}</Card>
            <Card>Pending Applications: {dashboardData.pendingApplications}</Card>
            <Card>Approved Applications: {dashboardData.approvedApplications}</Card>
            <Card>Rejected Applications: {dashboardData.rejectedApplications}</Card>
            <Card>Payment Initiated: {dashboardData.paymentInitiatedApplications}</Card>
            <Card>Payment Verified: {dashboardData.paymentVerifiedApplications}</Card>
            <Card>Total Users: {dashboardData.totalUsers}</Card>
            <Card>Total Admins: {dashboardData.totalAdmins}</Card>
          </div>

          <Card>
            <h2>Filter Applications</h2>
            <div className="filter-controls">
              <label htmlFor="statusFilter">Filter by Status:</label>
              <select id="statusFilter" value={filterStatus} onChange={handleFilterChange}>
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="payment_initiated">Payment Initiated</option>
                <option value="payment_verified">Payment Verified</option>
              </select>
            </div>
          </Card>

          {filteredApplications && filteredApplications.length > 0 && (
            <Card>
              <h2>Recent Loan Applications</h2>
              <ul className="recent-applications-list">
                {filteredApplications.map((app) => (
                  <li key={app._id}>
                    ID: {app._id}, User: {app.userId.username}, Amount: ₹{app.loanAmount}, Status: {app.status}
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

export default AdminDashboardPage;