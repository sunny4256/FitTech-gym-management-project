
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB2NiDE0N-V41E_4zVQBoQUkLCGepU2xUU",
  authDomain: "fittech-f05a1.firebaseapp.com",
  projectId: "fittech-f05a1",
  storageBucket: "fittech-f05a1.appspot.com",
  messagingSenderId: "1033903274925",
  appId: "1:1033903274925:web:e7ea7106064fdf63ccbf24",
  measurementId: "G-JE3176MNPR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };




// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /users/{userId} {
//       allow read, write: if request.auth != null;
//     }
//   }
// }
