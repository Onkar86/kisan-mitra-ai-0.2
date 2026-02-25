import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged,
  signOut,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { UserProfile, DiagnosisResult } from '../types';

// Firebase config - Replace with your Firebase project config
const firebaseConfig = {
  apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || "AIzaSyDemoKey",
  authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || "kisan-mitra-ai.firebaseapp.com",
  projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || "kisan-mitra-ai",
  storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || "kisan-mitra-ai.appspot.com",
  messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID || "1:123456789:web:abc123"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Enable offline persistence
// enableIndexedDbPersistence(db).catch(() => {
//   // Ignore errors for now
// });

/**
 * Sign in with Google
 */
export const signInWithGoogle = async (): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Save user profile to Firestore if new
    await saveUserProfile({
      uid: user.uid,
      name: user.displayName || "Farmer",
      email: user.email || "",
      photoURL: user.photoURL || "",
      onboarded: false,
      aiProvider: 0 as any,
      language: 'en' as any,
      address: '',
      farmSize: 0,
      crops: [],
      phone: user.phoneNumber || ""
    });
    
    return user;
  } catch (error: any) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
};

/**
 * Sign out
 */
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Sign Out Error:", error);
    throw error;
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Subscribe to auth state changes
 */
export const subscribeToAuthState = (callback: (user: User | null) => void) => {
  const unsubscribe = onAuthStateChanged(auth, callback);
  return unsubscribe;
};

/**
 * Save user profile to Firestore
 */
export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  try {
    if (!profile.uid) {
      console.warn("No user ID provided");
      return;
    }
    
    const userRef = doc(db, 'users', profile.uid);
    await setDoc(userRef, {
      ...profile,
      updatedAt: new Date().toISOString(),
      createdAt: profile.createdAt || new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error("Error saving user profile:", error);
    throw error;
  }
};

/**
 * Get user profile from Firestore
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
};

/**
 * Save diagnosis result to Firestore
 */
export const saveDiagnosisResult = async (uid: string, result: DiagnosisResult): Promise<string> => {
  try {
    const historyRef = collection(db, 'users', uid, 'history');
    const docRef = await addDoc(historyRef, {
      ...result,
      timestamp: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving diagnosis result:", error);
    throw error;
  }
};

/**
 * Get user's diagnosis history from Firestore
 */
export const getUserHistory = async (uid: string): Promise<DiagnosisResult[]> => {
  try {
    const historyRef = collection(db, 'users', uid, 'history');
    const q = query(historyRef);
    const querySnapshot = await getDocs(q);
    
    const history: DiagnosisResult[] = [];
    querySnapshot.forEach((doc) => {
      history.push({
        id: doc.id,
        ...doc.data()
      } as DiagnosisResult);
    });
    
    // Sort by timestamp, newest first
    return history.sort((a, b) => {
      const timeA = new Date(a.timestamp || 0).getTime();
      const timeB = new Date(b.timestamp || 0).getTime();
      return timeB - timeA;
    });
  } catch (error) {
    console.error("Error getting user history:", error);
    return [];
  }
};

export { auth, db };
