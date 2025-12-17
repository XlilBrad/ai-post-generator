import React, { useState, useEffect } from 'react';
import './App.css';
import { auth } from './firebaseConfig.js';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Auth state listener (Section 2)
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 AI Post Generator</h1>
        <p>Créez des posts sociaux améliorés par l'IA</p>
      </header>

      <main className="container">
        {user ? (
          <div>
            <p>Bienvenue {user.displayName || user.email}</p>
            {/* Components vont ici */}
          </div>
        ) : (
          <div className="auth-section">
            <h2>Connectez-vous pour commencer</h2>
            {/* Auth buttons Section 2 */}
          </div>
        )}
      </main>

      <footer>
        <p>Services: Firestore | Storage | Auth | Hosting | App Check | OpenAI</p>
      </footer>
    </div>
  );
}

export default App;