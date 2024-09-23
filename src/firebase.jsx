import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore  } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCjF5Eo1IiYttDHzZpGH8BN0ADB208DvzE",
  authDomain: "linkedin-clone-ec897.firebaseapp.com",
  projectId: "linkedin-clone-ec897",
  storageBucket: "linkedin-clone-ec897.appspot.com",
  messagingSenderId: "840854516670",
  appId: "1:840854516670:web:dd58f7d72f100696363fef"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
const storage = getStorage();

export {auth, db, storage, provider };
