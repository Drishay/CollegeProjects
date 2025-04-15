import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './DashboardPage.css';

function DashboardPage() {
  const { role } = useParams(); // 'customer', 'employee', 'manager'
  const [selectedFeature, setSelectedFeature] = useState('home');

  const userInfo = {
    name: "John Doe",
    username: "john123",
    contact: "9876543210",
    profilePic: "https://via.placeholder.com/80"
  };

  const features = {
    customer: ['Balance', 'Deposit', 'Withdraw', 'Transfer', 'Transactions'],
    employee: ['Manage Customers', 'Open Account', 'Close Account', 'Verify KYC', 'View All'],
    manager: ['Reports', 'Approve Loans', 'Monitor Staff', 'Revenue', 'System Logs']
  };

  const renderFeature = () => {
    return <div style={{ padding: '20px' }}>[{selectedFeature}] feature selected</div>;
  };

  return (
    <div className="dashboard">
      <header className="header">Bacht Bank</header>

      <div className="user-info">
        <div className="info-text">
          <p><strong>Name:</strong> {userInfo.name}</p>
          <p><strong>Username:</strong> {userInfo.username}</p>
          <p><strong>Contact:</strong> {userInfo.contact}</p>
        </div>
        <div className="info-img">
          <img src={userInfo.profilePic} alt="Profile" />
        </div>
      </div>

      <div className="menu-strip">
        {features[role]?.map((item) => (
          <button
            key={item}
            className={selectedFeature === item ? 'active' : ''}
            onClick={() => setSelectedFeature(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="feature-body">
        {renderFeature()}
      </div>

      <footer className="footer">© Copyright reserved to Bacht Bank</footer>
    </div>
  );
}

export default DashboardPage;
