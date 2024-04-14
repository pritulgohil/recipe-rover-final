if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/serviceWorker.js", { scope: "/" })
    .then((registration) => {
      // console.log('Registraion Scope: ', registration.scope)
    })
    .catch((err) => {
      // console.log('Error during registration : ', err)
    });
}

let logoutBtn = document.getElementById("logout-button");
let cardArea = document.getElementById("card-area");
let newCard = document.createElement("div");
let plusHeading = document.createElement("h3");
let inputElement = document.createElement("input");
let buttonElement = document.createElement("button");
let notificationButton = document.getElementById("notification-button");
let cardAreaInnerHtml;

let addButton;
let addInput;
let buttonAdd;
let uid;
let htmlCode;

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    uid = user.uid;
    firebase
      .database()
      .ref(`users/${uid}/userName`)
      .once("value")
      .then((snapshot) => {
        const userName = snapshot.val();
        let welcomeUser = document.getElementById("welcome-user");
        welcomeUser.textContent = `${userName}`;
      })
      .catch((error) => {
        console.error("Error reading data:", error);
      });
    readFirebase();
  } else {
    console.log("No user signed in");
  }
});

function readFirebase() {
  firebase
    .database()
    .ref("users")
    .child(`${uid}/recipe`)
    .orderByChild("timestamp")
    .once("value", function (snapshot) {
      snapshot.forEach((childSnapshot) => {
        htmlCode = "";
        var recipe = childSnapshot.key;
        htmlCode = `<div class = "card"><h3>${recipe}</h3></div>`;
        cardArea.innerHTML += htmlCode;
      });
      createPlusCard();
    });
  console.log("Hello World");
}

function createPlusCard() {
  newCard.classList.add("card");
  newCard.id = "addButtonCard";
  plusHeading.id = "addBtn";
  plusHeading.classList.add("add-button");
  plusHeading.innerHTML = "+";
  newCard.appendChild(plusHeading);
  inputElement.setAttribute("placeholder", "Add Recipe");
  inputElement.setAttribute("id", "addInput");
  inputElement.setAttribute("type", "text");
  newCard.appendChild(inputElement);
  buttonElement.setAttribute("id", "buttonAdd");
  buttonElement.textContent = "Add";
  newCard.appendChild(buttonElement);
  //newCard.innerHTML = `<input placeholder = "Add Recipe" id = "addInput" type = "text"><button id = "buttonAdd">Add</button>`;
  newCard.style.backgroundColor = "#efecca";
  cardArea.appendChild(newCard);
  inputElement.style.display = "none";
  buttonElement.style.display = "none";
}

function readForAddButton() {
  firebase
    .database()
    .ref("users")
    .child(`${uid}/recipe`)
    .orderByChild("timestamp")
    .once("value", function (snapshot) {
      snapshot.forEach((childSnapshot) => {
        htmlCode = "";
        var recipe = childSnapshot.key;
        htmlCode = `<div class = "card"><h3>${recipe}</h3></div>`;
        cardArea.innerHTML += htmlCode;
      });
      createPlusCard();
    });
}

logoutBtn.addEventListener("click", logOutApp);

function logOutApp() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      logoutBtn.textContent = "Logging Out...";
      logoutBtn.style.backgroundColor = "white";
      logoutBtn.style.color = "#1a936f";
      logoutBtn.style.border = "1px solid #1a936f";
      logoutBtn.style.transform = "none";
      logoutBtn.disabled = true;
      logoutBtn.style.cursor = "auto";
      logoutBtn.style.borderColor = "#1a936f";
      setTimeout(function () {
        window.location.href = "login.html";
      }, 2000);
    });
}

plusHeading.addEventListener("click", function handleClick() {
  plusHeading.style.display = "none";
  inputElement.style.display = "block";
  buttonElement.style.display = "block";

  buttonElement.addEventListener("click", function () {
    let newRecipeItem = inputElement.value;
    let updateData = {};
    updateData[newRecipeItem] = "";

    firebase
      .database()
      .ref(`users/${uid}/recipe/`)
      .update(
        {
          [newRecipeItem]: {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
          },
        },
        (error) => {
          if (error) {
            console.error(error);
          } else {
            plusHeading.style.display = "block";
            inputElement.style.display = "none";
            buttonElement.style.display = "none";
            console.log("Successfully Added");
            location.reload();
          }
        }
      );
  });
});

if (Notification.permission === "granted") {
  notificationButton.style.display = "none";
  displayNotification();
}

if ("Notification" in window && "serviceWorker" in navigator) {
  notificationButton.addEventListener("click", function () {
    switch (Notification.permission) {
      case "default":
        requestPermission();
        break;

      case "granted":
        displayNotification();
        console.log("Granted");
        break;

      case "denied":
        console.log("denied");
    }
  });
} else {
  console.log("Notifications not allowed");
}

function requestPermission() {
  Notification.requestPermission().then((permission) => {
    console.log("User Choice", permission);
    if (permission === "granted") {
      notificationButton.style.display = "none";
      console.log("Permission granted");
    } else {
    }
  });
}

function displayNotification() {
  const options = {
    title: "Recipe Rover",
    body: "Add Recipes",
    icon: "Assets/logo.jpg",
  };

  navigator.serviceWorker.ready.then((registration) => {
    registration.showNotification("Welcome To Recipe Rover", options);
  });
}
