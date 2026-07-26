// // This is a simple placeholder, you can customize it later
// importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
// importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// firebase.initializeApp({
//   apiKey: "AIzaSyBeWwsckk03XXNWz_846efgNHJXNhYjn2s",
//   authDomain: "doclabpharm.firebaseapp.com",
//   projectId: "doclabpharm",
//   storageBucket: "doclabpharm.firebasestorage.app",
//   messagingSenderId: "891787785661",
//   appId: "1:891787785661:web:aeaa9060b2e4451f5bced4",
// });
 
// const messaging = firebase.messaging();




// importScripts("https://www.gstatic.com/firebasejs/10.12.1/firebase-app-compat.js");
// importScripts("https://www.gstatic.com/firebasejs/10.12.1/firebase-messaging-compat.js");

importScripts("https://www.gstatic.com/firebasejs/10.10.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.10.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBeWwsckk03XXNWz_846efgNHJXNhYjn2s",
  authDomain: "doclabpharm.firebaseapp.com",
  projectId: "doclabpharm",
  storageBucket: "doclabpharm.firebasestorage.app",
  messagingSenderId: "891787785661",
  appId: "1:891787785661:web:aeaa9060b2e4451f5bced4"
});


const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message", payload);
  const { title, body } = payload.notification;
  self.registration.showNotification(title, {
    body,
    icon: "/logo.png",
  });
});