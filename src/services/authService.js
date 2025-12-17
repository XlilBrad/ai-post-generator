import { 
  GoogleAuthProvider, 
  GithubAuthProvider,
  signInWithPopup, 
  signOut
} from "firebase/auth";
import { auth } from "../firebaseConfig";

// Providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Login Google
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Erreur login Google:", error);
    throw error;
  }
};

// Login GitHub avec gestion account-exists
export const loginWithGithub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    return result.user;
  } catch (error) {
    // Gérer le cas où l'email existe déjà avec un autre provider
    if (error.code === 'auth/account-exists-with-different-credential') {
      const email = error.customData.email;
      alert(`Ce compte existe déjà avec Google. Veuillez vous connecter avec Google pour l'email: ${email}`);
      throw new Error("Utilisez Google pour cet email");
    }
    console.error("Erreur login GitHub:", error);
    throw error;
  }
};

// Logout
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Erreur logout:", error);
    throw error;
  }
};