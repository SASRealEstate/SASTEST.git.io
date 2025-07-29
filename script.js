const firebaseConfig = {
  apiKey: "AIzaSyClkUIAwd4rkHLWMxVLKU59IW2RZkZUnNY",
  authDomain: "sas-realestate-c79bf.firebaseapp.com",
  projectId: "sas-realestate-c79bf",
  storageBucket: "sas-realestate-c79bf.appspot.com",
  messagingSenderId: "1014311982277",
  appId: "1:1014311982277:web:0cb545d498b32b90078cac"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

firebase.auth().onAuthStateChanged(user => {
  const isProtectedPage = window.location.pathname.includes("AllLands.html");

  if (isProtectedPage) {
    if (!user) {
      // Not logged in → redirect
      window.location.href = "login.html";
    }
    // If logged in → do nothing, stay on page
  }
});

