// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore, collection } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_0wYuDvcSU30NZEdtsbYbadCo7LsDKwU",
  authDomain: "pantry-tracker-ea06d.firebaseapp.com",
  projectId: "pantry-tracker-ea06d",
  storageBucket: "pantry-tracker-ea06d.appspot.com",
  messagingSenderId: "918440913210",
  appId: "1:918440913210:web:ba6b67f0da044267ac8803"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const pantryRef = collection(db, 'pantry');

export {app, db, pantryRef};