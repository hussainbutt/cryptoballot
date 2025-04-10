// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCewJVlk73YSNPQ4dK_VKcJbQkNgNrhBd0",
    authDomain: "cryptoballot-fc053.firebaseapp.com",
    projectId: "cryptoballot-fc053",
    storageBucket: "cryptoballot-fc053.appspot.com",
    messagingSenderId: "440658849537",
    appId: "cdcb2cfe4a648d14e4b500",
    measurementId: "YOUR_MEASUREMENT_ID",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
