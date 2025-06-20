// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDongUfb7I1lKt9Dger8NIipqgCI54zKuQ",
  authDomain: "samrat-ecommerce-web.firebaseapp.com",
  projectId: "samrat-ecommerce-web",
  storageBucket: "samrat-ecommerce-web.firebasestorage.app",
  messagingSenderId: "1094884039829",
  appId: "1:1094884039829:web:c1bf0a7b1a3ff58d090f9c",
  measurementId: "G-PC9F6B3TPG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


const email = document.getElementById('email').value;
const password = document.getElementById('password').value;

// ...existing code...
document.addEventListener('DOMContentLoaded', function() {
    const submit = document.getElementById('submit');
    submit.addEventListener('click', function(e) {
        console.log("ds");
        
        e.preventDefault();
        alert(5);
    });
});
// ...existing code...