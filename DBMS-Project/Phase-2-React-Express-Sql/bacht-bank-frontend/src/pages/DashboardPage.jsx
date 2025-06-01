import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './DashboardPage.css';

function DashboardPage() {
  const { role } = useParams(); // 'customer', 'employee', 'manager'
  const [selectedFeature, setSelectedFeature] = useState('home');
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  const storedUser = JSON.parse(localStorage.getItem("bachtbank_user")) || {};

  const userInfo = {
    name: storedUser.name || "Guest",
    username: storedUser.username || "unknown_user",
    contact: storedUser.contact || "N/A",
    profilePic: "https://via.placeholder.com/80"
  };

  const features = {
    customer: ['Balance', 'Deposit', 'Withdraw', 'Transfer', 'Transactions'],
    employee: ['Manage Customers', 'Open Account', 'Close Account', 'Verify KYC', 'View All'],
    manager: ['Reports', 'Approve Loans', 'Monitor Staff', 'Revenue', 'System Logs']
  };

  // Fetch data based on selected feature
  useEffect(() => {
    if (!role || !selectedFeature) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/${role}/${selectedFeature.toLowerCase()}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("bachtbank_token")}`
          }
        });

        const data = await response.json();
        
        if (data.success) {
          setUserData(data.data);  // Set the dynamic data based on response
        } else {
          setError(data.message || 'Error fetching data');
        }
      } catch (err) {
        setError('Error fetching data from server');
        console.error('Fetch error:', err);
      }
    };

    fetchData();
  }, [role, selectedFeature]);

  const renderFeature = () => {
    if (!role || !selectedFeature) return null;

    // Based on the selected feature, dynamically render data
    if (role === 'customer') {
      switch (selectedFeature) {
        case 'Balance':
          return userData ? <div>Your current balance is ₹{userData.balance}</div> : <div>Loading...</div>;
        case 'Transactions':
          return userData ? (
            <div>
              <h4>Recent Transactions:</h4>
              <ul>
                {userData.transactions.map((transaction, index) => (
                  <li key={index}>
                    {transaction.date} - {transaction.amount} {transaction.type}
                  </li>
                ))}
              </ul>
            </div>
          ) : <div>Loading...</div>;
        default:
          return <div>{selectedFeature} feature not implemented yet</div>;
      }
    }

    if (role === 'employee') {
      switch (selectedFeature) {
        case 'Manage Customers':
          return userData ? (
            <div>
              <h4>Customer List</h4>
              <ul>
                {userData.customers.map((customer, index) => (
                  <li key={index}>{customer.name}</li>
                ))}
              </ul>
            </div>
          ) : <div>Loading...</div>;
        default:
          return <div>{selectedFeature} feature not implemented yet</div>;
      }
    }

    if (role === 'manager') {
      switch (selectedFeature) {
        case 'Reports':
          return userData ? (
            <div>
              <h4>Monthly Financial Report</h4>
              <p>Total Revenue: ₹{userData.totalRevenue}</p>
              <p>Active Accounts: {userData.activeAccounts}</p>
            </div>
          ) : <div>Loading...</div>;
        default:
          return <div>{selectedFeature} feature not implemented yet</div>;
      }
    }

    return <div>Invalid role or feature</div>;
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
      <button
        onClick={() => {
          localStorage.removeItem('bachtbank_user');
          window.location.href = '/'; // or navigate to login
        }}
        style={{ marginLeft: '20px', backgroundColor: 'red', color: 'white', padding: '5px 10px', borderRadius: '5px' }}
      >
        Logout
      </button>

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
        {error ? <div>{error}</div> : renderFeature()}
      </div>

      <footer className="footer">© Copyright reserved to Bacht Bank</footer>
    </div>
  );
}

export default DashboardPage;
