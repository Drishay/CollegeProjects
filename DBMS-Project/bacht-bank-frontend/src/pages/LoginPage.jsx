import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const { role } = useParams();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleLogin = () => {
    if (!username || !password) {
      setError('Please fill in both username and password');
      return;
    }

    navigate(`/${role}/dashboard`);
  };

  return (
    <div className="login-page">
      <header className="header">Bacht Bank</header>

      <div className="login-box">
        <h2>LOGIN ({role?.toUpperCase()})</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Submit</button>
        <p className="forgot-link" onClick={() => setShowForgotModal(true)}>Forgot password?</p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      {showForgotModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Forgot Password</h3>
            <input type="text" placeholder="Security Question" />
            <input type="text" placeholder="Your Answer" />
            <button>Submit</button>
            <button onClick={() => setShowForgotModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      <footer className="footer">© Copyright reserved to Bacht Bank</footer>
    </div>
  );
}

export default LoginPage;
