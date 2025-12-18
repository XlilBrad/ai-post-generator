import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../firebaseConfig";

// Upload une image vers Firebase Storage
export const uploadImage = async (file, userId) => {
  try {
    // Créer un nom de fichier unique avec timestamp
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    
    // Créer la référence: posts/userId/fileName
    const storageRef = ref(storage, `posts/${userId}/${fileName}`);
    
    // Upload le fichier
    const snapshot = await uploadBytes(storageRef, file);
    console.log("Image uploadée:", snapshot.ref.fullPath);
    
    // Récupérer l'URL publique
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
    
  } catch (error) {
    console.error("Erreur upload image:", error);
    throw error;
  }
};

// Supprimer une image de Storage (optionnel)
export const deleteImage = async (imageURL) => {
  try {
    // Extraire le path de l'URL
    const imageRef = ref(storage, imageURL);
    await deleteObject(imageRef);
    console.log("Image supprimée:", imageURL);
  } catch (error) {
    console.error("Erreur suppression image:", error);
    // Ne pas throw l'erreur, juste log
  }
};