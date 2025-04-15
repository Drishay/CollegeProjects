import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage'; // Make sure this path is correct
import DashboardPage from './pages/DashboardPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/:role/login" element={<LoginPage />} /> {/* ✅ Key part */}
        <Route path="/:role/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
}

export default App;
