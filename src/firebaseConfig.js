import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut }
    from "firebase/auth";
import { getFirestore, query, getDocs, collection, where, addDoc }
    from "firebase/firestore";

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDHQQWc6QKyo5H_hmZ1gUwbDCLm90Geq-Q",
    authDomain: "cadastrojogoslpe.firebaseapp.com",
    projectId: "cadastrojogoslpe",
    storageBucket: "cadastrojogoslpe.appspot.com",
    messagingSenderId: "623107818280",
    appId: "1:623107818280:web:cfe3a6a581eef93b91061d"
  };

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, googleProvider);
        const user = res.user;
        const q = query(collection(db, "users"), where("uid", "==",
            user.uid));
        const docs = await getDocs(q);
        if (docs.docs.length === 0) {
            await addDoc(collection(db, "users"), {
                uid: user.uid,
                name: user.displayName,
                authProvider: "google",
                email: user.email,
            });
        }
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};
const logout = () => {
    signOut(auth);
};

export {
    auth,
    db,
    signInWithGoogle,
    logout,
};