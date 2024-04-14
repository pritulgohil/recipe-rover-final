let emailInput = document.getElementById("email");
let passwordInput = document.getElementById("password");
let loginButton = document.getElementById("login-btn");

loginButton.addEventListener("click", loginUser);

function loginUser() {
  var emailValue = emailInput.value;
  var passwordValue = passwordInput.value;

  if (emailValue && passwordValue) {
    firebase
      .auth()
      .signInWithEmailAndPassword(emailValue, passwordValue)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(`User logged in ${user.email} with user id ${user.uid}`);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });
    loginButton.textContent = "Logging In...";
    loginButton.style.backgroundColor = "white";
    loginButton.style.color = "#1a936f";
    loginButton.style.border = "1px solid #1a936f";
    loginButton.style.transform = "none";
    loginButton.disabled = true;
    loginButton.style.cursor = "auto";
    loginButton.style.borderColor = "#1a936f";
    let emailError = document.getElementById("emailError");
    emailError.style.display = "none";
    emailInput.style.border = "none";
    let passwordError = document.getElementById("passwordError");
    passwordError.style.display = "none";
    passwordInput.style.border = "none";
    setTimeout(function () {
      window.location.href = "login-process.html";
    }, 2000);
  } else if (!emailValue && !passwordValue) {
    let emailError = document.getElementById("emailError");
    emailError.style.display = "block";
    emailInput.style.border = "2px solid red";
    let passwordError = document.getElementById("passwordError");
    passwordError.style.display = "block";
    passwordInput.style.border = "2px solid red";
  } else if (!emailValue) {
    let emailError = document.getElementById("emailError");
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
