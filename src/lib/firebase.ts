import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAAD7RAXntHQQkNQZv9qc8XkZci0GMuVXg",
  authDomain: "metal-facet-38gvj.firebaseapp.com",
  projectId: "metal-facet-38gvj",
  storageBucket: "metal-facet-38gvj.firebasestorage.app",
  messagingSenderId: "154845553059",
  appId: "1:154845553059:web:5ed20d8504986d7e0aba16"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-remixundanganper-7ada3971-b140-45d4-8db8-80fa13becd77");

export { db };
