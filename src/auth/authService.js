import { auth } from "./firebaseConfig";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  sendEmailVerification 
} from "firebase/auth";

// Sign Up Function
export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User created successfully:", userCredential.user.uid);
    
    // Send verification email
    await sendEmailVerification(userCredential.user);
    console.log("Verification email sent to:", email);
    
    return { 
      success: true, 
      verificationEmailSent: true 
    };
  } catch (error) {
    console.error("Signup error:", error.code, error.message);
    // Provide more user-friendly error messages based on Firebase error codes
    let errorMessage = error.message;
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'This email is already registered. Please use a different email or try logging in.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Please enter a valid email address.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password is too weak. Please use a stronger password.';
    }
    return { success: false, error: errorMessage, code: error.code };
  }
};

// Log In Function - improved with better error handling and email verification check
export const logIn = async (email, password) => {
  try {
    console.log("Attempting login with Firebase...");
    
    // Check if auth is initialized
    if (!auth) {
      console.error("Firebase auth is not initialized");
      return { success: false, error: "Authentication service not available. Please try again later." };
    }
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Firebase login successful:", userCredential.user.uid);
    
    // Check if email is verified
    if (!userCredential.user.emailVerified) {
      console.log("Email not verified for user:", userCredential.user.uid);
      return { 
        success: false, 
        error: "Please verify your email before logging in. Check your inbox for the verification link.",
        emailVerification: true,
        user: userCredential.user
      };
    }
    
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error("Login error:", error.code, error.message);
    // Provide more user-friendly error messages based on Firebase error codes
    let errorMessage = error.message;
    if (error.code === 'auth/invalid-credential' || 
        error.code === 'auth/user-not-found' || 
        error.code === 'auth/wrong-password') {
      errorMessage = 'Invalid email or password. Please try again.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Please enter a valid email address.';
    } else if (error.code === 'auth/user-disabled') {
      errorMessage = 'Your account has been disabled. Please contact support.';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many failed login attempts. Please try again later.';
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'Network error. Please check your internet connection.';
    }
    return { success: false, error: errorMessage, code: error.code };
  }
};

// Resend verification email
export const resendVerificationEmail = async (user) => {
  try {
    await sendEmailVerification(user);
    return { success: true };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return { 
      success: false, 
      error: "Failed to send verification email. Please try again later."
    };
  }
};

// Log Out Function
export const logOut = async () => {
  try {
    await signOut(auth);
    console.log("User signed out successfully");
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error.code, error.message);
    return { success: false, error: error.message };
  }
};
