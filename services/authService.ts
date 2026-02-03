import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from './firebase';

export interface AdminUser {
  uid: string;
  email: string | null;
}

// Sign in with email and password
export const signInAdmin = async (email: string, password: string): Promise<AdminUser> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return {
    uid: userCredential.user.uid,
    email: userCredential.user.email,
  };
};

// Sign out
export const signOutAdmin = async (): Promise<void> => {
  await signOut(auth);
};

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Subscribe to auth state changes
export const onAuthChange = (callback: (user: AdminUser | null) => void): (() => void) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback({
        uid: user.uid,
        email: user.email,
      });
    } else {
      callback(null);
    }
  });
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return auth.currentUser !== null;
};
