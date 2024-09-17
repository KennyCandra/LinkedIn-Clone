import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore  } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBPTBRcQ1teigi2zDSrRU5o3J0j_7L51vE",
  authDomain: "linkedin-clone3-f269e.firebaseapp.com",
  projectId: "linkedin-clone3-f269e",
  storageBucket: "linkedin-clone3-f269e.appspot.com",
  messagingSenderId: "779520598616",
  appId: "1:779520598616:web:2c760623b4984e0cb9202d",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
const storage = getStorage();

export {auth, db, storage, provider };
