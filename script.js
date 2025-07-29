
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
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

let confirmationResult;

function normalizePhone(input) {
  input = input.replace(/\D/g, '');
  if (input.startsWith('0')) input = input.slice(1);
  return '+966' + input;
}

window.onload = function () {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      size: 'normal',
      callback: function (response) {
        document.getElementById("msg").innerText = "جارٍ إرسال الرسالة...";
      }
    });
    window.recaptchaVerifier.render().then(function (widgetId) {
      window.recaptchaWidgetId = widgetId;
    });
  }

  const urlParams = new URLSearchParams(window.location.search);
  const redirectTo = urlParams.get('redirect');
  if (auth.currentUser && window.location.pathname.includes("login.html") && redirectTo) {
    window.location.href = redirectTo;
  }
};

function sendCode() {
  const rawPhone = document.getElementById("phone").value;
  const phone = normalizePhone(rawPhone);

  auth.signInWithPhoneNumber(phone, window.recaptchaVerifier)
    .then(result => {
      confirmationResult = result;
      document.getElementById("verify-section").style.display = "block";
      document.getElementById("msg").innerText = "تم إرسال الرمز، يرجى التحقق من جوالك.";
    })
    .catch(error => {
      document.getElementById("msg").innerText = error.message;
    });
}

function verifyCode() {
  const code = document.getElementById("code").value;
  confirmationResult.confirm(code)
    .then(result => {
      document.getElementById("msg").innerText = "تم التحقق! سيتم تحويلك...";
      const redirectTo = new URLSearchParams(window.location.search).get('redirect') || "index.html";
      setTimeout(() => window.location.href = redirectTo, 1000);
    })
    .catch(error => {
      document.getElementById("msg").innerText = "رمز غير صحيح.";
    });
}

function logOut() {
  auth.signOut().then(() => {
    alert("تم تسجيل الخروج");
    window.location.href = "index.html";
  });
}

auth.onAuthStateChanged(user => {
  const current = window.location.pathname.split("/").pop();
  if (current === "AllLands.html" && !user) {
    const loginURL = new URL("login.html", window.location.origin);
    loginURL.searchParams.set("redirect", window.location.pathname.split("/").pop());
    window.location.href = loginURL.href;
  }
});
