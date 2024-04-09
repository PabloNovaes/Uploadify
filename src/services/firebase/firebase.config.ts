import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDMhtlhc7XShIExm1jh15L_yw9eqWpaTx8",
    authDomain: "upload-hub-fdabc.firebaseapp.com",
    projectId: "upload-hub-fdabc",
    storageBucket: "upload-hub-fdabc.appspot.com",
    messagingSenderId: "948276888984",
    appId: "1:948276888984:web:726a5298dceafa5d8117ed"
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app)