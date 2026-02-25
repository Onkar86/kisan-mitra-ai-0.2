import { initializeApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged,
  signOut,
  User,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  collection,
  addDoc,
  query,
  getDocs,
  Firestore,
  orderBy,
  limit,
  updateDoc
} from 'firebase/firestore';
import { UserProfile, DiagnosisResult } from '../types';

// Firebase config - From Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyAOifhW06Co4FoqrKWqW43hVKqF-43EoD0",
  authDomain: "kisan-mitra-ai-a362f.firebaseapp.com",
  projectId: "kisan-mitra-ai-a362f",
  storageBucket: "kisan-mitra-ai-a362f.firebasestorage.app",
  messagingSenderId: "483867268048",
  appId: "1:483867268048:web:2da049c9ba94e0cf339fd5",
  measurementId: "G-E47146W11C"
};

let app: FirebaseApp | null = null;
let auth: any = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;

// Initialize Firebase
const initializeFirebase = () => {
  if (app) return { app, auth, db, googleProvider };
  
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    
    // Configure Google Sign-In Provider
    googleProvider = new GoogleAuthProvider();
    googleProvider.addScope('profile');
    googleProvider.addScope('email');
    googleProvider.setCustomParameters({
      'prompt': 'consent'
    });
    
    // Set persistence to LOCAL
    setPersistence(auth, browserLocalPersistence).catch((err) => {
      console.warn('Persistence setup failed:', err.message);
    });
    
    console.log('Firebase initialized successfully');
    return { app, auth, db, googleProvider };
  } catch (error: any) {
    console.error('Firebase initialization error:', error);
    throw new Error(`Firebase init failed: ${error.message}`);
  }
};

// Initialize on module load
const { app: fbApp, auth: fbAuth, db: fbDb, googleProvider: fbProvider } = initializeFirebase();

/**
 * Sign in with Google - Works for both new and existing users
 */
export const signInWithGoogle = async (): Promise<User> => {
  try {
    if (!fbAuth || !fbProvider) {
      throw new Error('Firebase not initialized. Check Firebase configuration.');
    }
    
    const result = await signInWithPopup(fbAuth, fbProvider);
    const user = result.user;
    
    if (!user.uid) {
      throw new Error('User ID not found');
    }
    
    console.log('User signed in:', user.email);
    
    // Check if user exists in Firestore
    const userDoc = await getDoc(doc(fbDb!, 'users', user.uid));
    
    // If new user, create profile
    if (!userDoc.exists()) {
      console.log('Creating new user profile');
      await saveUserProfile({
        uid: user.uid,
        name: user.displayName || "Farmer",
        email: user.email || "",
        phone: user.phoneNumber || "",
        photoURL: user.photoURL || "",
        onboarded: false,
        aiProvider: 0 as any,
        language: 'en' as any,
        address: '',
        farmSize: 0,
        crops: []
      });
    }
    
    return user;
  } catch (error: any) {
    console.error("Google Sign-In Error:", error);
    
    // Provide user-friendly error messages
    if (error.code === 'auth/configuration-not-found') {
      throw new Error('❌ Firebase Auth not enabled. Enable Google Sign-In in Firebase Console → Authentication → Google provider.');
    } else if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('You closed the sign-in popup. Please try again.');
    } else if (error.code === 'auth/unauthorized-domain') {
      throw new Error('❌ Domain not authorized. Add "onkar86.github.io" in Firebase Console → Authentication → Settings → Authorized domains.');
    } else if (error.code === 'auth/operation-not-supported-in-this-environment') {
      throw new Error('Sign-in not supported. Try a different browser or clear cache.');
    } else if (error.code === 'auth/invalid-api-key') {
      throw new Error('❌ Invalid Firebase API key. Check Firebase configuration.');
    }
    
    throw error;
  }
};

/**
 * Sign out
 */
export const logout = async (): Promise<void> => {
  try {
    if (fbAuth) {
      await signOut(fbAuth);
      console.log('User signed out');
    }
  } catch (error) {
    console.error("Sign Out Error:", error);
    throw error;
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = (): User | null => {
  if (!fbAuth) return null;
  return fbAuth.currentUser;
};

/**
 * Subscribe to auth state changes
 */
export const subscribeToAuthState = (callback: (user: User | null) => void) => {
  if (!fbAuth) {
    console.error('Auth not initialized');
    return () => {};
  }
  
  const unsubscribe = onAuthStateChanged(fbAuth, callback);
  return unsubscribe;
};

/**
 * Save user profile to Firestore
 */
export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  try {
    if (!fbDb || !profile.uid) {
      console.warn("No database or user ID");
      return;
    }
    
    const userRef = doc(fbDb, 'users', profile.uid);
    await setDoc(userRef, {
      ...profile,
      updatedAt: new Date().toISOString(),
      createdAt: profile.createdAt || new Date().toISOString()
    }, { merge: true });
    console.log('Profile saved for user:', profile.uid);
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
    if (!fbDb) return null;
    
    const userRef = doc(fbDb, 'users', uid);
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
    if (!fbDb) throw new Error('Database not initialized');
    
    const historyRef = collection(fbDb, 'users', uid, 'history');
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
    if (!fbDb) return [];
    
    const historyRef = collection(fbDb, 'users', uid, 'history');
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

// Save chat message to Firestore
export const saveChatMessage = async (userId: string, message: any) => {
  try {
    if (!fbDb) {
      throw new Error("Firebase not initialized");
    }
    
    const messagesRef = collection(fbDb, 'users', userId, 'chat_messages');
    const docRef = await addDoc(messagesRef, {
      ...message,
      userId,
      createdAt: new Date().toISOString()
    });
    
    return docRef.id;
  } catch (error) {
    console.error("Error saving chat message:", error);
    throw error;
  }
};

// Get chat history for user
export const getChatHistory = async (userId: string, limit_: number = 50) => {
  try {
    if (!fbDb) {
      throw new Error("Firebase not initialized");
    }
    
    const messagesRef = collection(fbDb, 'users', userId, 'chat_messages');
    const q = query(
      messagesRef,
      orderBy('createdAt', 'desc'),
      limit(limit_)
    );
    
    const snapshot = await getDocs(q);
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return messages.reverse(); // Return oldest first
  } catch (error) {
    console.error("Error getting chat history:", error);
    return [];
  }
};

// Update user farming profile
export const updateFarmingProfile = async (userId: string, profile: any) => {
  try {
    if (!fbDb) {
      throw new Error("Firebase not initialized");
    }
    
    const userRef = doc(fbDb, 'users', userId);
    await updateDoc(userRef, {
      farmingMode: profile.farmingMode,
      soilType: profile.soilType,
      district: profile.district,
      state: profile.state,
      currentFertilizers: profile.currentFertilizers,
      updatedAt: new Date().toISOString()
    });
    
    console.log('Farming profile updated for user:', userId);
  } catch (error) {
    console.error("Error updating farming profile:", error);
    throw error;
  }
};

export { fbAuth as auth, fbDb as db };


