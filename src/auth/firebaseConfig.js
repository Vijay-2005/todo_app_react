import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase config (copy from Firebase Console -> Project settings)
const firebaseConfig = {
  apiKey: "AIzaSyCC9CHDajNnYyJ4oyZZ_DLoz0PswUlmixg",
  authDomain: "todo-app-auth-2e667.firebaseapp.com",
  projectId: "todo-app-auth-2e667",
  storageBucket: "todo-app-auth-2e667.appspot.com", // Fixed storage bucket URL format
  messagingSenderId: "258007276648",
  appId: "1:258007276648:web:c5d606d60a4286cfb5afdd"
};

// Initialize Firebase
console.log("Initializing Firebase app...");
let auth = null;
let db = null;

try {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  
  // Set persistence to LOCAL
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      console.log("Firebase persistence set to LOCAL");
    })
    .catch((error) => {
      console.error("Error setting persistence:", error);
    });
    
  db = getFirestore(app);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);
  // Log more details about the error
  console.error("Error code:", error.code);
  console.error("Error message:", error.message);
  // auth remains null to prevent crashes
}

export { auth, db };

