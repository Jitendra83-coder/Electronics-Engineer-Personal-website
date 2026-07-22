// ============================================================
// Firebase initialization (shared by admin.js and script.js)
// Used to sync Blog posts & Learning courses across ALL
// browsers/devices, instead of only the local browser's
// localStorage. Loaded via CDN <script> tags before admin.js /
// script.js in the HTML files, so it must stay compatible with
// the Firebase "compat" (non-module) SDK.
// ============================================================

const firebaseConfig = {
    apiKey: "AIzaSyCeQMG9EKm7JhhXGcf9iVQazXKgEKKUN1M",
    authDomain: "jitendra-sharma-portfoli-945d6.firebaseapp.com",
    projectId: "jitendra-sharma-portfoli-945d6",
    storageBucket: "jitendra-sharma-portfoli-945d6.firebasestorage.app",
    messagingSenderId: "856409412134",
    appId: "1:856409412134:web:63904ec719db1fb18f8ce7",
    measurementId: "G-P36JMNBXK0"
};

try {
    firebase.initializeApp(firebaseConfig);
    window.db = firebase.firestore();
} catch (e) {
    console.error('Firebase failed to initialize:', e);
    window.db = null;
}
