import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const { role } = useParams();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    // This is where we'll connect the backend later
    if (!username || !password) {
      setMessage("Please enter both fields");
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, username, password })
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Login successful ✅");
        navigate(`/${role}/dashboard`);  // Redirect to respective dashboard
      } else {
        setMessage("Invalid credentials ❌");
      }
    } catch (err) {
      setMessage("Login error. Is your backend running?");
    }
  };

  return (
    <div className="login-page">
      <header className="header">Bacht Bank</header>

      <div className="login-box">
        <h2>LOGIN ({role?.toUpperCase()})</h2>
        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Submit</button>
        {message && <p>{message}</p>}

        <p className="forgot-link" onClick={() => setShowForgot(true)}>Forgot password?</p>
      </div>

      {showForgot && (
        <div className="modal">
          <div className="modal-box">
            <h3>Forgot Password</h3>
            <input type="text" placeholder="Forgot Question" />
            <input type="text" placeholder="Your Answer" />
            <button>Submit</button>
            <button onClick={() => setShowForgot(false)}>Cancel</button>
          </div>
        </div>
      )}

      <footer className="footer">© Copyright reserved to Bacht Bank</footer>
    </div>
  );
}

export default LoginPage;
