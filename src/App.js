import React, { useState, useEffect } from 'react';
import './App.css';
import { auth } from './firebaseConfig';
import Auth from './components/Auth';
import Navbar from './components/Navbar';
import PostForm from './components/PostForm';
import PostList from './components/PostList';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handlePostCreated = () => {
    // Incrémenter pour déclencher le refresh de PostList
    setRefreshTrigger(prev => prev + 1);
  };

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
            <PostForm user={user} onPostCreated={handlePostCreated} />
            <PostList user={user} refreshTrigger={refreshTrigger} />
          </main>
        </div>
      )}
    </div>
  );
}

export default App;