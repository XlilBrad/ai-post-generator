import React, { useState } from 'react';
import { createPost, updatePost } from '../services/firestoreService';
import { uploadImage } from '../services/storageService';
import { improvePostWithAI } from '../services/openaiservice';
import './PostForm.css';

function PostForm({ user, onPostCreated }) {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [content, setContent] = useState('');
  const [context, setContext] = useState('');
  const [improvedContent, setImprovedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);

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
      
      // 1. Appeler OpenAI pour améliorer le texte
      console.log("Appel OpenAI pour améliorer le texte...");
      const aiImprovedText = await improvePostWithAI(content, context);
      setImprovedContent(aiImprovedText);
      
      // 2. Upload image vers Storage si présente
      let imageURL = "";
      if (imageFile) {
        console.log("Upload de l'image vers Storage...");
        imageURL = await uploadImage(imageFile, user.uid);
      }
      
      // 3. Créer le post dans Firestore
      const postId = await createPost(
        user.uid,
        content,
        context,
        imageURL
      );
      
      // 4. Mettre à jour le post avec le contenu amélioré par l'IA
      await updatePost(postId, {
        improvedContent: aiImprovedText
      });
      
      setCurrentPostId(postId);
      alert("Post créé et amélioré par l'IA! ✅");
      
      // Notifier le parent pour rafraîchir la liste
      if (onPostCreated) {
        onPostCreated();
      }
      
      // Réinitialiser uniquement les champs d'input (garder le résultat affiché)
      setContent('');
      setContext('');
      setImageFile(null);
      setImagePreview(null);
      
    } catch (error) {
      console.error("Erreur:", error);
      alert(error.message || "Erreur lors de la création du post");
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
        {loading ? "⏳ L'IA travaille..." : "✨ Generate Post"}
      </button>

      {/* Affichage du résultat IA */}
      {improvedContent && (
        <div className="ai-result">
          <h3>✨ Résultat amélioré par l'IA:</h3>
          <div className="ai-content">
            {improvedContent}
          </div>
          <p className="ai-note">Le post a été sauvegardé avec ce contenu amélioré!</p>
        </div>
      )}
    </div>
  );
}

export default PostForm;