// lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDe3eZEIstbhtWPAGXKcofhwbSndp4dwhU",
    authDomain: "muscle-app-9976f.firebaseapp.com",
    projectId: "muscle-app-9976f",
  storageBucket: "muscle-app-9976f.appspot.com",
  messagingSenderId: "244259259880",
  appId: "1:244259259880:web:2914f99c6a3566b37df05d"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);
