
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyD1mI3TUjk5TgSbnyRSqMCGmTs2V4-kvsw",
  authDomain: "linkedin-clone2-4fc40.firebaseapp.com",
  projectId: "linkedin-clone2-4fc40",
  storageBucket: "linkedin-clone2-4fc40.appspot.com",
  messagingSenderId: "885098749198",
  appId: "1:885098749198:web:ce285af3687041a9078b5f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider
const storage = getStorage()
export {auth,db , storage , provider}