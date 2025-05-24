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

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please fill in both username and password");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, role }), // Include role in the request
      });
  
      const data = await response.json();
  
      if (data.success) {
        // ✅ Store user in localStorage
        localStorage.setItem("bachtbank_user", JSON.stringify(data.user));
        localStorage.setItem("bachtbank_token", data.token); // optional if you're using tokens
  
        setError(""); // clear error
        navigate(`/${data.user.role}/dashboard`);
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Something went wrong. Please try again later.");
    }
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
