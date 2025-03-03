import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAuaklyP2VkerZbn6DIKfUuMpeOWI05QYc",
    authDomain: "galagacourse01.firebaseapp.com",
    projectId: "galagacourse01",
    storageBucket: "galagacourse01.firebasestorage.app",
    messagingSenderId: "978562601329",
    appId: "1:978562601329:web:4c07f96a08320c7388a6d0",
    measurementId: "G-T00XYGQME8"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth();

const storage = getStorage(app);

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        console.log('User signed in with Google:', user);
    } catch (error) {
        console.error('Error during Google Sign-In:', error.message);
    }
};

const signUp = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('User signed up:', userCredential.user);
    } catch (error) {
        console.error('Error during sign-up:', error.message);
    }
};

const signIn = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('User signed in:', userCredential.user);
    } catch (error) {
        console.error('Error during sign-in:', error.message);
    }
};

const signOutUser = async () => {
    try {
        await signOut(auth);
        console.log('User signed out');
    } catch (error) {
        console.error('Error during sign-out:', error.message);
    }
};

// Upload file to Firebase Storage
const uploadFile = async (file) => {
    try {
        const storageRef = ref(storage, `files/${file.name}`);
        const uploadResult = await uploadBytes(storageRef, file);
        console.log('File uploaded successfully:', uploadResult);
        const downloadURL = await getDownloadURL(uploadResult.ref);
        console.log('File available at:', downloadURL);
        return downloadURL; // You can return or use the download URL to store in your database or elsewhere
    } catch (error) {
        console.error('Error during file upload:', error.message);
    }
};

export { signUp, signIn, signOutUser, auth, signInWithGoogle, uploadFile };
