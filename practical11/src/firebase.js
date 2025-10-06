import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {

  apiKey: "AIzaSyAiAmfl8xsv5kfrYxNvKwZKrZrRSpVpqdM",

  authDomain: "fsd-lab-prac-11.firebaseapp.com",

  projectId: "fsd-lab-prac-11",

  storageBucket: "fsd-lab-prac-11.firebasestorage.app",

  messagingSenderId: "1022270383986",

  appId: "1:1022270383986:web:92672d0e6189b0d60adfeb"

};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
