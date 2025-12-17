import React, { useState } from 'react';
import './PostForm.css';

function PostForm() {
  const [imagePreview, setImagePreview] = useState(null);
  const [content, setContent] = useState('');
  const [context, setContext] = useState('');

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

  const handleGeneratePost = () => {
    // Fonctionnalité à ajouter plus tard
    console.log("Generate Post clicked");
    console.log("Content:", content);
    console.log("Context:", context);
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
      >
        ✨ Generate Post
      </button>
    </div>
  );
}

export default PostForm;