let emailInput = document.getElementById("emailInput");
let passwordInput = document.getElementById("passInput");
let userNameInput = document.getElementById("user-name");
let signUpButton = document.getElementById("signup-btn");

signUpButton.addEventListener("click", signupUser);

function signupUser() {
  var email = emailInput.value;
  var pwd = passwordInput.value;
  var userName = userNameInput.value;

  if (email && pwd) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, pwd)
      .then((userCredential) => {
        const user = userCredential.user;
        firebase
          .database()
          .ref("users/" + user.uid)
          .set({ userName: userName, email: email });
      })
      .catch((err) => {
        console.log("error");
      });
    signUpButton.textContent = "Signing Up...";
    signUpButton.style.backgroundColor = "white";
    signUpButton.style.color = "#1a936f";
    signUpButton.style.border = "1px solid #1a936f";
    signUpButton.style.transform = "none";
    signUpButton.disabled = true;
    signUpButton.style.cursor = "auto";
    signUpButton.style.borderColor = "#1a936f";
    let signupLoading = document.getElementById("signup-loading");
    signupLoading.style.display = "block";
    let emailError = document.getElementById("emailError");
    emailError.style.display = "none";
    emailInput.style.border = "none";
    let passwordError = document.getElementById("passwordError");
    passwordError.style.display = "none";
    passwordInput.style.border = "none";
    setTimeout(function () {
      window.location.href = "signup-onboarding.html";
    }, 2000);
  } else if (!email && !pwd) {
    let emailError = document.getElementById("emailError");
    console.log(emailError);
    emailError.style.display = "block";
    emailInput.style.border = "2px solid red";
    let passwordError = document.getElementById("passwordError");
    passwordError.style.display = "block";
    passwordInput.style.border = "2px solid red";
  } else if (!email) {
    console.log("Email has no value");
    let emailError = document.getElementById("emailError");
    console.log(emailError);
    emailError.style.display = "block";
    emailInput.style.border = "2px solid red";
    let passwordError = document.getElementById("passwordError");
    passwordError.style.display = "none";
    passwordInput.style.border = "none";
  } else {
    let passwordError = document.getElementById("passwordError");
    let emailError = document.getElementById("emailError");
    emailError.style.display = "none";
    emailInput.style.border = "none";
    passwordError.style.display = "block";
    passwordInput.style.border = "2px solid red";
  }
}
