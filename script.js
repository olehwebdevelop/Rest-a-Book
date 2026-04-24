const frontColorInput = document.getElementById("frontColor");
const back = document.getElementById("backColor");
const spine = document.getElementById("spineColor");

frontColorInput.addEventListener("input", (e) => {
    document.documentElement.style.setProperty("--book-front", e.target.value);
});

back.addEventListener("input", (e) => {
    document.documentElement.style.setProperty("--book-back", e.target.value);
});

spine.addEventListener("input", (e) => {
    document.documentElement.style.setProperty("--book-spine", e.target.value);
});

const book = document.querySelector(".book-inner");

let isDragging = false;
let lastX = 0;
let lastY = 0;
let rotY = -25;
let rotX = 10;

book.addEventListener("mousedown", (e) => {
    if (e.target.closest(".controls") || e.target.closest(".book-option")) return;

    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
});

document.addEventListener("mouseup", () => {
    isDragging = false;
});

document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;

    rotY += dx * 0.5;
    rotX -= dy * 0.5;

    book.style.transform = `rotateY(${rotY}deg) rotateX(${rotX}deg)`;

    lastX = e.clientX;
    lastY = e.clientY;
});

const options = document.querySelectorAll(".book-option");
const frontFace = document.querySelector(".front");
const titleElement = document.querySelector(".book-title");

let currentCover = "";
let currentTitle = "";

if (options.length > 0) {
    options[0].classList.add("active");
    currentCover = options[0].dataset.cover;
    currentTitle = options[0].dataset.title;

    frontFace.style.backgroundImage = `url(${currentCover})`;
    titleElement.textContent = currentTitle;
}

options.forEach(option => {
    option.addEventListener("click", () => {
        options.forEach(o => o.classList.remove("active"));
        option.classList.add("active");

        currentCover = option.dataset.cover;
        currentTitle = option.dataset.title;

        titleElement.textContent = currentTitle;

        if (showTitle) {
            frontFace.style.backgroundImage = "none";
            frontFace.classList.add("title-only");
        } else {
            frontFace.classList.remove("title-only");
            frontFace.style.backgroundImage = `url(${currentCover})`;
        }
    });
});

const titleToggle = document.getElementById("titleToggle");

let showTitle = false;

titleToggle.addEventListener("click", () => {
    showTitle = !showTitle;

    titleElement.classList.toggle("active");
    frontFace.classList.toggle("title-only");

    titleToggle.textContent = showTitle ? "Hide Title" : "Show Title";

    if (showTitle) {
        frontFace.style.backgroundImage = "none";
    } else {
        frontFace.style.backgroundImage = `url(${currentCover})`;
    }
});

const registerDiv = document.getElementById("sign-up-menu");
const loginDiv = document.getElementById("log-in-menu");

const signUpBtn = document.getElementById("sign-up-btn");
const logInBtn = document.getElementById("log-in-btn");

signUpBtn.addEventListener('click', () => {
  registerDiv.classList.add('active');
  loginDiv.classList.remove('active');
});

logInBtn.addEventListener('click', () => {
  loginDiv.classList.add('active');
  registerDiv.classList.remove('active');
});

const cancelRegister = document.getElementById("cancelSignUp");
const cancelLogin = document.getElementById("cancelLogIn");

cancelRegister.addEventListener('click', () => {
  registerDiv.classList.remove('active');
});

cancelLogin.addEventListener('click', () => {
  loginDiv.classList.remove('active');
});

const logInLink = document.getElementById("log-in-a");
logInLink.addEventListener('click', (e) => {
  e.preventDefault();
  registerDiv.classList.remove('active');
  loginDiv.classList.add('active');
});

const createLink = document.getElementById("sign-up-a");
createLink.addEventListener('click', (e) => {
  e.preventDefault();
  loginDiv.classList.remove('active');
  registerDiv.classList.add('active');
});

const heroStartBtn = document.getElementById("started");
const heroLoginBtn = document.getElementById("hero-login");

heroStartBtn.addEventListener('click', () => {
  registerDiv.classList.add('active');
  loginDiv.classList.remove('active');
});

heroLoginBtn.addEventListener('click', () => {
  loginDiv.classList.add('active');
  registerDiv.classList.remove('active');
});
