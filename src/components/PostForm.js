import React, { useState } from 'react';
import { createPost } from '../services/firestoreService';
import './PostForm.css';

function PostForm({ user, onPostCreated }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [content, setContent] = useState('');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGeneratePost = async () => {
    // Validation
    if (!content.trim()) {
      alert("Veuillez entrer du contenu");
      return;
    }

    try {
      setLoading(true);
      
      // Créer le post dans Firestore
      await createPost(
        user.uid,
        content,
        context,
        imagePreview || "" // Pour l'instant on stocke le base64, Section 4 utilisera Storage
      );

      // Réinitialiser le formulaire
      setContent('');
      setContext('');
      setImagePreview(null);
      
      alert("Post créé avec succès! ✅");
      
      // Notifier le parent pour rafraîchir la liste
      if (onPostCreated) {
        onPostCreated();
      }
      
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la création du post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-form">
      <h2>Créer un nouveau post</h2>
      
      <div className="form-section">
        <label className="form-label">Image du post</label>
        <div className="image-upload-container">
          {imagePreview ? (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
              <button 
                className="btn-remove-image"
                onClick={() => setImagePreview(null)}
              >
                ✕
              </button>
            </div>
          ) : (
            <label className="upload-box">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <div className="upload-placeholder">
                <span className="upload-icon">📷</span>
                <p>Cliquez pour téléverser une image</p>
              </div>
            </label>
          )}
        </div>
      </div>

      <div className="form-section">
        <label className="form-label">Contenu à améliorer</label>
        <textarea
          className="post-textarea"
          placeholder="Écrivez votre texte brut ici... L'IA l'améliorera pour vous!"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
        />
      </div>

      <div className="form-section">
        <label className="form-label">Contexte pour l'IA</label>
        <textarea
          className="post-textarea context-textarea"
          placeholder="Ex: Ton professionnel, style amical, c'était lors d'une fête, mon premier job, pour LinkedIn..."
          value={context}
          onChange={(e) => setContext(e.target.value)}
          rows={3}
        />
      </div>

      <button 
        className="btn-generate"
        onClick={handleGeneratePost}
        disabled={loading}
      >
        {loading ? "Création..." : "✨ Generate Post"}
      </button>
    </div>
  );
}

export default PostForm;