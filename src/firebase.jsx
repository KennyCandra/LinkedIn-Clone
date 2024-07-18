
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyD0G9XnKe6RhqK8UZN_5iQJS81OmuPY6mA",
  authDomain: "linkedin-clone-ae249.firebaseapp.com",
  projectId: "linkedin-clone-ae249",
  storageBucket: "linkedin-clone-ae249.appspot.com",
  messagingSenderId: "1086080469362",
  appId: "1:1086080469362:web:769733aac0cceb33e9f5eb",
  measurementId: "G-RHDSFSGE6H"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider
export {auth,db , provider}