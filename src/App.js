import React, { useState, useEffect } from 'react';
import './App.css';
import { auth } from './firebaseConfig';
import Auth from './components/Auth';
import Navbar from './components/Navbar';
import PostForm from './components/PostForm';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="App">
      {!user ? (
        // Page de connexion
        <div className="auth-page">
          <header className="App-header">
            <h1>🚀 AI Post Generator</h1>
            <p>Créez des posts sociaux améliorés par l'IA</p>
          </header>
          <main className="container">
            <Auth user={user} />
          </main>
        </div>
      ) : (
        // Page principale après connexion
        <div className="main-app">
          <Navbar user={user} />
          <main className="main-content">
            <PostForm />
          </main>
        </div>
      )}
    </div>
  );
}

export default App;