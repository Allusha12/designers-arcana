import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { firebaseApp, firebaseConfigured } from "./config";

export const auth = firebaseConfigured && firebaseApp ? getAuth(firebaseApp) : null;
export const googleProvider = firebaseConfigured ? new GoogleAuthProvider() : null;

export async function signInWithGoogle() {
  if (!auth || !googleProvider) throw new Error("Firebase not configured");
  return signInWithPopup(auth, googleProvider);
}

export async function signOutUser() {
  if (!auth) return;
  return signOut(auth);
}
