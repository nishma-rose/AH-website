import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAQRAq2egyJoMXbnrUCXu82RJqbWdyG8ow",
  authDomain: "jewel-business-manager.firebaseapp.com",
  projectId: "jewel-business-manager",
  storageBucket: "jewel-business-manager.firebasestorage.app",
  messagingSenderId: "897975581237",
  appId: "1:897975581237:web:418cb53ca75dd217534f7c",
  measurementId: "G-DW1EX8FNZP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

try {
  enableIndexedDbPersistence(db).catch(() => {});
} catch (e) {
  console.log('Persistence error:', e);
}

export { db, auth };