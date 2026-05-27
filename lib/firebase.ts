import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDhXK9nSweeRc_Z3ueJt5JT-tcX3vJZc8Y",
    authDomain: "bang-movie.firebaseapp.com",
    databaseURL:
        "https://bang-movie-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "bang-movie",
    storageBucket: "bang-movie.firebasestorage.app",
    messagingSenderId: "65855329884",
    appId: "1:65855329884:web:7819ad4abf2984e8713899",
    measurementId: "G-Z7PLYLXV03",
};

const app =
    getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
