import React, { useState, useEffect } from 'react';
import { getUserPosts, deletePost, updatePost } from '../services/firestoreService';
import './PostList.css';

function PostList({ user, refreshTrigger }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editContext, setEditContext] = useState('');

  useEffect(() => {
    loadPosts();
  }, [user, refreshTrigger]);

  const loadPosts = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userPosts = await getUserPosts(user.uid);
      setPosts(userPosts);
    } catch (error) {
      console.error("Erreur chargement posts:", error);
      alert("Erreur lors du chargement des posts");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post.id);
    setEditContent(post.content);
    setEditContext(post.context || '');
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setEditContent('');
    setEditContext('');
  };

  const handleSaveEdit = async (postId) => {
    try {
      await updatePost(postId, {
        content: editContent,
        context: editContext
      });
      
      // Mettre à jour localement
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, content: editContent, context: editContext }
          : post
      ));
      
      setEditingPost(null);
      alert("Post modifié avec succès! ✅");
    } catch (error) {
      alert("Erreur lors de la modification");
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce post?")) return;
    
    try {
      await deletePost(postId);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      alert("Erreur lors de la suppression");
    }
  };

  if (loading) {
    return <div className="posts-loading">Chargement des posts...</div>;
  }

  if (posts.length === 0) {
    return (
      <div className="posts-empty">
        <p>Aucun post pour le moment. Créez-en un! 📝</p>
      </div>
    );
  }

  return (
    <div className="posts-list">
      <h2>Mes Posts ({posts.length})</h2>
      
      {posts.map((post) => (
        <div key={post.id} className="post-card">
          {post.imageURL && (
            <img src={post.imageURL} alt="Post" className="post-image" />
          )}
          
          <div className="post-content-section">
            {editingPost === post.id ? (
              // Mode édition
              <div className="edit-mode">
                <div className="edit-field">
                  <strong>Contenu:</strong>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={4}
                    className="edit-textarea"
                  />
                </div>
                <div className="edit-field">
                  <strong>Contexte:</strong>
                  <textarea
                    value={editContext}
                    onChange={(e) => setEditContext(e.target.value)}
                    rows={2}
                    className="edit-textarea"
                  />
                </div>
                <div className="edit-actions">
                  <button 
                    onClick={() => handleSaveEdit(post.id)}
                    className="btn-save"
                  >
                    💾 Sauvegarder
                  </button>
                  <button 
                    onClick={handleCancelEdit}
                    className="btn-cancel"
                  >
                    ❌ Annuler
                  </button>
                </div>
              </div>
            ) : (
              // Mode lecture
              <>
                <div className="post-text">
                  <strong>Contenu original:</strong>
                  <p>{post.content}</p>
                </div>
                
                {post.context && (
                  <div className="post-context">
                    <strong>Contexte:</strong>
                    <p className="context-text">{post.context}</p>
                  </div>
                )}
                
                {post.improvedContent && (
                  <div className="post-improved">
                    <strong>✨ Amélioré par l'IA:</strong>
                    <p>{post.improvedContent}</p>
                  </div>
                )}
              </>
            )}
          </div>
          
          {editingPost !== post.id && (
            <div className="post-actions">
              <span className="post-date">
                {post.createdAt?.toDate().toLocaleDateString('fr-FR')}
              </span>
              <div className="action-buttons">
                <button 
                  onClick={() => handleEdit(post)}
                  className="btn-edit"
                >
                  ✏️ Modifier
                </button>
                <button 
                  onClick={() => handleDelete(post.id)}
                  className="btn-delete"
                >
                  🗑️ Supprimer
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default PostList;