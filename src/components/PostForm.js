import React, { useState } from 'react';
import { createPost } from '../services/firestoreService';
import { uploadImage } from '../services/storageService';
import './PostForm.css';

function PostForm({ user, onPostCreated }) {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [content, setContent] = useState('');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Créer preview
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
      
      let imageURL = "";
      
      // Upload image vers Storage si présente
      if (imageFile) {
        console.log("Upload de l'image vers Storage...");
        imageURL = await uploadImage(imageFile, user.uid);
        console.log("Image uploadée, URL:", imageURL);
      }
      
      // Créer le post dans Firestore avec l'URL de Storage
      await createPost(
        user.uid,
        content,
        context,
        imageURL
      );

      // Réinitialiser le formulaire
      setContent('');
      setContext('');
      setImageFile(null);
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
                onClick={() => {
                  setImagePreview(null);
                  setImageFile(null);
                }}
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
        {loading ? "⏳ Création en cours..." : "✨ Generate Post"}
      </button>
    </div>
  );
}

export default PostForm;