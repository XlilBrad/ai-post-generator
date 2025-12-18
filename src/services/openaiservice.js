import { httpsCallable } from "firebase/functions";
import { functions } from "../firebaseConfig";

// Appeler la Cloud Function pour améliorer un post
export const improvePostWithAI = async (content, context) => {
  try {
    // Référence à la Cloud Function
    const improvePost = httpsCallable(functions, "improvePost");
    
    // Appel de la function avec les données
    const result = await improvePost({
      content: content,
      context: context || ""
    });
    
    console.log("OpenAI réponse:", result.data);
    
    return result.data.improvedContent;
    
  } catch (error) {
    console.error("Erreur appel Cloud Function:", error);
    
    // Gestion des erreurs spécifiques
    if (error.code === "unauthenticated") {
      throw new Error("Vous devez être connecté pour utiliser l'IA");
    } else if (error.code === "invalid-argument") {
      throw new Error("Le contenu ne peut pas être vide");
    } else {
      throw new Error("Erreur lors de l'amélioration du post");
    }
  }
};