import React from 'react';
import { logout } from '../services/authService';
import './Navbar.css';

function Navbar({ user }) {
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      alert("Erreur de déconnexion");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <h1>🚀 AI Post Generator</h1>
        </div>
        <div className="navbar-user">
          <span className="user-email">{user.email}</span>
          <button onClick={handleLogout} className="btn-logout">
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;