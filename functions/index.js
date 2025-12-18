/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onCall, HttpsError} = require("firebase-functions/v2/https");
const {initializeApp} = require("firebase-admin/app");
const OpenAI = require("openai");

// Initialize Firebase Admin
initializeApp();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Clé stockée dans Firebase Functions config
});

/**
 * Cloud Function pour améliorer un post avec OpenAI
 * @param {Object} data - { content: string, context: string }
 * @return {Object} { improvedContent: string }
 */
exports.improvePost = onCall(async (request) => {
  // Vérifier que l'utilisateur est authentifié
  if (!request.auth) {
    throw new HttpsError(
        "unauthenticated",
        "L'utilisateur doit être authentifié.",
    );
  }

  const {content, context} = request.data;

  // Validation
  if (!content || content.trim() === "") {
    throw new HttpsError(
        "invalid-argument",
        "Le contenu ne peut pas être vide.",
    );
  }

  try {
    // Construire le prompt pour OpenAI
    const systemPrompt = `Tu es un expert en création de contenu pour les réseaux sociaux. 
Ton rôle est d'améliorer le texte brut fourni par l'utilisateur en le rendant plus engageant, 
professionnel et adapté aux réseaux sociaux.

Contexte fourni par l'utilisateur: ${context || "Aucun contexte spécifique"}

Instructions:
- Améliore le style et la clarté
- Ajoute des émojis pertinents (2-3 maximum)
- Garde le message authentique
- Respecte le ton demandé dans le contexte
- Maximum 280 caractères si possible`;

    // Appel à OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Modèle recommandé qualité/prix
      messages: [
        {role: "system", content: systemPrompt},
        {role: "user", content: content},
      ],
      temperature: 0.7, // Créativité modérée
      max_tokens: 300, // Limite pour un post court
    });

    const improvedContent = completion.choices[0].message.content;

    console.log("Post amélioré avec succès pour l'utilisateur:", request.auth.uid);

    return {
      improvedContent: improvedContent,
      usage: completion.usage, // Optionnel: retourner les stats d'utilisation
    };
  } catch (error) {
    console.error("Erreur OpenAI:", error);
    throw new HttpsError(
        "internal",
        "Erreur lors de l'amélioration du post: " + error.message,
    );
  }
});