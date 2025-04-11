import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <header className="header">Bacht Bank</header>

      <div className="button-container">
      <button onClick={() => navigate('/customer/login')}>Customer</button>
      <button onClick={() => navigate('/employee/login')}>Employee</button>
      <button onClick={() => navigate('/manager/login')}>Manager</button>

      </div>

      <footer className="footer">© Copyright reserved to Bacht Bank</footer>
    </div>
  );
}

export default LandingPage;
