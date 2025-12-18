import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebaseConfig";

const POSTS_COLLECTION = "posts";

// CREATE - Créer un nouveau post
export const createPost = async (userId, content, context, imageURL = "") => {
  try {
    const docRef = await addDoc(collection(db, POSTS_COLLECTION), {
      userId,
      content,
      improvedContent: "", // Vide pour l'instant, sera rempli par l'IA
      context,
      imageURL,
      createdAt: serverTimestamp()
    });
    console.log("Post créé avec ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Erreur création post:", error);
    throw error;
  }
};

// READ - Récupérer tous les posts d'un utilisateur
export const getUserPosts = async (userId) => {
  try {
    const q = query(
      collection(db, POSTS_COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc") // Index activé ✅
    );
    
    const querySnapshot = await getDocs(q);
    const posts = [];
    
    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return posts;
  } catch (error) {
    console.error("Erreur récupération posts:", error);
    throw error;
  }
};

// UPDATE - Mettre à jour un post
export const updatePost = async (postId, updates) => {
  try {
    const postRef = doc(db, POSTS_COLLECTION, postId);
    await updateDoc(postRef, updates);
    console.log("Post mis à jour:", postId);
  } catch (error) {
    console.error("Erreur mise à jour post:", error);
    throw error;
  }
};

// DELETE - Supprimer un post
export const deletePost = async (postId) => {
  try {
    await deleteDoc(doc(db, POSTS_COLLECTION, postId));
    console.log("Post supprimé:", postId);
  } catch (error) {
    console.error("Erreur suppression post:", error);
    throw error;
  }
};