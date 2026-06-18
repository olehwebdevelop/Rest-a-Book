const frontColorInput = document.getElementById("frontColor");
const back = document.getElementById("backColor");
const spine = document.getElementById("spineColor");

const API_URL = "https://rest-a-book.onrender.com;

if (frontColorInput) {
    frontColorInput.addEventListener("input", (e) => {
        document.documentElement.style.setProperty("--book-front", e.target.value);
    });
}

if (back) {
    back.addEventListener("input", (e) => {
        document.documentElement.style.setProperty("--book-back", e.target.value);
    });
}

if (spine) {
    spine.addEventListener("input", (e) => {
        document.documentElement.style.setProperty("--book-spine", e.target.value);
    });
}

const book = document.querySelector(".book-inner");

let isDragging = false;
let lastX = 0;
let lastY = 0;
let rotY = -25;
let rotX = 10;

if (book) {
    book.addEventListener("pointerdown", (e) => {
        if (e.target.closest(".controls") || e.target.closest(".book-option")) return;

        isDragging = true;
        lastX = e.clientX;
        lastY = e.clientY;

        book.setPointerCapture(e.pointerId);
    });

    book.addEventListener("pointerup", (e) => {
        isDragging = false;
        book.releasePointerCapture(e.pointerId);
    });

    book.addEventListener("pointerleave", () => {
        isDragging = false;
    });

    book.addEventListener("pointermove", (e) => {
        if (!isDragging) return;

        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;

        rotY += dx * 0.5;
        rotX -= dy * 0.5;

        rotX = Math.max(-45, Math.min(45, rotX));

        book.style.transform = `rotateY(${rotY}deg) rotateX(${rotX}deg)`;

        lastX = e.clientX;
        lastY = e.clientY;
    });
}

const options = document.querySelectorAll(".book-option");
const frontFace = document.querySelector(".front");
const titleElement = document.querySelector(".book-title");

let currentCover = "";
let currentTitle = "";
let showTitle = false;

if (options.length > 0 && frontFace && titleElement) {
    options[0].classList.add("active");
    currentCover = options[0].dataset.cover;
    currentTitle = options[0].dataset.title;

    frontFace.style.backgroundImage = `url(${currentCover})`;
    titleElement.textContent = currentTitle;
}

options.forEach(option => {
    option.addEventListener("click", () => {
        if (!frontFace || !titleElement) return;
        
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

if (titleToggle && titleElement && frontFace) {
    titleToggle.addEventListener("click", (e) => {
        e.stopPropagation();

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
}

const registerDiv = document.getElementById("sign-up-menu");
const loginDiv = document.getElementById("log-in-menu");

const signUpBtn = document.getElementById("sign-up-btn");
const logInBtn = document.getElementById("log-in-btn");

const cancelRegister = document.getElementById("cancelSignUp");
const cancelLogin = document.getElementById("cancelLogIn");

const logInLink = document.getElementById("log-in-a");
const createLink = document.getElementById("sign-up-a");

const heroStartBtn = document.getElementById("started");
const heroLoginBtn = document.getElementById("hero-login");

if (signUpBtn && registerDiv && loginDiv) {
    signUpBtn.addEventListener('click', () => {
        registerDiv.classList.add('active');
        loginDiv.classList.remove('active');
    });
}

if (logInBtn && loginDiv && registerDiv) {
    logInBtn.addEventListener('click', () => {
        loginDiv.classList.add('active');
        registerDiv.classList.remove('active');
    });
}

if (cancelRegister && registerDiv) {
    cancelRegister.addEventListener('click', () => registerDiv.classList.remove('active'));
}

if (cancelLogin && loginDiv) {
    cancelLogin.addEventListener('click', () => loginDiv.classList.remove('active'));
}

if (logInLink && registerDiv && loginDiv) {
    logInLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerDiv.classList.remove('active');
        loginDiv.classList.add('active');
    });
}

if (createLink && loginDiv && registerDiv) {
    createLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginDiv.classList.remove('active');
        registerDiv.classList.add('active');
    });
}

if (heroStartBtn && registerDiv && loginDiv) {
    heroStartBtn.addEventListener('click', () => {
        registerDiv.classList.add('active');
        loginDiv.classList.remove('active');
    });
}

if (heroLoginBtn && loginDiv && registerDiv) {
    heroLoginBtn.addEventListener('click', () => {
        loginDiv.classList.add('active');
        registerDiv.classList.remove('active');
    });
}

function checkAuthStatus() {
    const token = localStorage.getItem("token");
    const signUpBtn = document.getElementById("sign-up-btn");
    const logInBtn = document.getElementById("log-in-btn");
    const bookOptionsContainer = document.querySelector(".book-option")?.parentElement;

    if (token) {
        if (signUpBtn) signUpBtn.style.display = "none";
        if (logInBtn) logInBtn.style.display = "none";

        if (signUpBtn && signUpBtn.parentElement) {
            const authButtonsContainer = signUpBtn.parentElement;
            
            if (!document.querySelector(".user-profile-wrapper")) {
                const wrapper = document.createElement("div");
                wrapper.className = "user-profile-wrapper";
                wrapper.style.position = "relative";
                wrapper.style.display = "inline-block";
                wrapper.style.marginRight = "15px";

                const avatar = document.createElement("img");
                avatar.src = "avatar.png"; 
                avatar.className = "user-avatar";
                avatar.alt = "User Profile";
                avatar.style.cursor = "pointer";
                avatar.style.width = "40px";
                avatar.style.height = "40px";
                avatar.style.borderRadius = "50%";
                avatar.style.objectFit = "cover";
                avatar.style.display = "block";

                const dropdown = document.createElement("div");
                dropdown.className = "user-dropdown-menu";
                dropdown.style.position = "absolute";
                dropdown.style.top = "120%";
                dropdown.style.right = "0";
                dropdown.style.backgroundColor = "#111";
                dropdown.style.border = "1px solid #222";
                dropdown.style.borderRadius = "8px";
                dropdown.style.padding = "10px";
                dropdown.style.display = "none";
                dropdown.style.flexDirection = "column";
                dropdown.style.gap = "8px";
                dropdown.style.zIndex = "10000";
                dropdown.style.minWidth = "140px";

                const logoutBtn = document.createElement("button");
                logoutBtn.textContent = "Log out";
                logoutBtn.style.backgroundColor = "transparent";
                logoutBtn.style.color = "#fff";
                logoutBtn.style.border = "none";
                logoutBtn.style.cursor = "pointer";
                logoutBtn.style.textAlign = "left";
                logoutBtn.style.padding = "5px 10px";
                logoutBtn.style.fontSize = "14px";
                logoutBtn.style.width = "100%";

                logoutBtn.addEventListener("click", (e) => {
                    e.stopPropagation(); 
                    localStorage.removeItem("token");
                    window.location.reload();
                });

                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "Delete account";
                deleteBtn.style.backgroundColor = "transparent";
                deleteBtn.style.color = "#ff3333";
                deleteBtn.style.border = "none";
                deleteBtn.style.cursor = "pointer";
                deleteBtn.style.textAlign = "left";
                deleteBtn.style.padding = "5px 10px";
                deleteBtn.style.fontSize = "14px";
                deleteBtn.style.width = "100%";

                deleteBtn.addEventListener("click", async (e) => {
                    e.stopPropagation(); 
                    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                        try {
                            const response = await fetch(`${API_URL}/api/auth/delete`, {
                                method: "DELETE",
                                headers: {
                                    "Authorization": `Bearer ${token}`
                                }
                            });
                            if (response.ok) {
                                localStorage.removeItem("token");
                                window.location.reload();
                            } else {
                                alert("Failed to delete account.");
                            }
                        } catch (err) {
                            console.error(err);
                            alert("Error connecting to server.");
                        }
                    }
                });

                dropdown.appendChild(logoutBtn);
                dropdown.appendChild(deleteBtn);
                wrapper.appendChild(avatar);
                wrapper.appendChild(dropdown);
                authButtonsContainer.appendChild(wrapper);

                dropdown.addEventListener("click", (e) => {
                    e.stopPropagation();
                });

                avatar.addEventListener("click", (e) => {
                    e.stopPropagation();
                    dropdown.style.display = dropdown.style.display === "none" ? "flex" : "none";
                });

                document.addEventListener("click", () => {
                    dropdown.style.display = "none";
                });
            }
        }

       if (bookOptionsContainer && !document.querySelector(".book-option-add")) {
    const addBtn = document.createElement("div");
    addBtn.className = "book-option-add";
    addBtn.textContent = "+";
    
    addBtn.style.display = "inline-flex";
    addBtn.style.alignItems = "center";
    addBtn.style.justifyContent = "center";
    addBtn.style.cursor = "pointer";
    
    addBtn.style.width = "70px";
    addBtn.style.height = "100px";
    addBtn.style.border = "2px dashed #444";
    addBtn.style.borderRadius = "8px";
    addBtn.style.backgroundColor = "#151515";
    addBtn.style.color = "#666";
    addBtn.style.fontSize = "28px";
    addBtn.style.fontWeight = "300";
    addBtn.style.transition = "all 0.2s ease-in-out";
    addBtn.style.userSelect = "none";

    addBtn.addEventListener("mouseenter", () => {
        addBtn.style.borderColor = "#999";
        addBtn.style.color = "#fff";
        addBtn.style.backgroundColor = "#202020";
        addBtn.style.transform = "scale(1.05)";
    });

    addBtn.addEventListener("mouseleave", () => {
        addBtn.style.borderColor = "#444";
        addBtn.style.color = "#666";
        addBtn.style.backgroundColor = "#151515";
        addBtn.style.transform = "scale(1)";
    });
    
    addBtn.addEventListener("click", () => {
        openModal();
    });
    
    bookOptionsContainer.appendChild(addBtn);
}

    } else {
        if (signUpBtn) signUpBtn.style.display = "block";
        if (logInBtn) logInBtn.style.display = "block";
        
        const wrapper = document.querySelector(".user-profile-wrapper");
        if (wrapper) wrapper.remove();

        const addBtn = document.querySelector(".book-option-add");
        if (addBtn) addBtn.remove();
    }
}

document.addEventListener("DOMContentLoaded", checkAuthStatus);

const submitSignUpBtn = registerDiv ? registerDiv.querySelector(".account-btn") : null;

if (submitSignUpBtn) {
    submitSignUpBtn.addEventListener("click", async (e) => {
        e.preventDefault(); 

        const emailInput = document.getElementById("signup-email");
        const passwordInput = document.getElementById("signup-password");

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                try {
                    const loginResponse = await fetch(`${API_URL}/api/auth/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, password })
                    });
                    const loginData = await loginResponse.json();
                    if (loginResponse.ok) {
                        localStorage.setItem("token", loginData.token);
                        registerDiv.classList.remove("active");
                        checkAuthStatus();
                        alert("Account created and logged in successfully!");
                        emailInput.value = "";
                        passwordInput.value = "";
                        return;
                    }
                } catch (loginErr) {
                    console.error(loginErr);
                }

                alert("Account created successfully! Please log in.");
                registerDiv.classList.remove("active");
                loginDiv.classList.add("active");
                emailInput.value = "";
                passwordInput.value = "";
            } else {
                alert(data.message || "Error during registration.");
            }
        } catch (error) {
            console.error("Registration request error:", error);
            alert("Could not connect to the server. Please check if Node.js is running.");
        }
    });
}

const submitLogInBtn = loginDiv ? loginDiv.querySelector(".account-btn") : null;

if (submitLogInBtn) {
    submitLogInBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        const emailInput = document.getElementById("login-email");
        const passwordInput = document.getElementById("login-password");

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                loginDiv.classList.remove("active");
                checkAuthStatus();
                alert("Successfully logged in!");
                emailInput.value = "";
                passwordInput.value = "";
            } else {
                alert(data.message || "Invalid email or password.");
            }
        } catch (error) {
            console.error("Login request error:", error);
            alert("Could not connect to the server. Please check if Node.js is running.");
        }
    });
}

function openModal() {
    document.getElementById('add-book-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('add-book-modal').style.display = 'none';
}

function saveNewBook() {
    const title = document.getElementById('new-book-title').value;
    const imageInput = document.getElementById('new-book-image');
    
    if (!title) {
        alert("Enter the book title!");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const imageUrl = e.target.result;

        const newBook = document.createElement("div");
        newBook.className = "book-option";
        newBook.dataset.cover = imageUrl;
        newBook.dataset.title = title;

        newBook.innerHTML = `
            <img src="${imageUrl}" style="width:100%; height:100%; object-fit:cover;">
            <button class="delete-btn">×</button>
        `;

        newBook.addEventListener("click", () => {
            document.querySelectorAll(".book-option").forEach(o => o.classList.remove("active"));
            newBook.classList.add("active");
            
            currentCover = imageUrl;
            currentTitle = title;
            
            document.querySelector(".book-title").textContent = title;
            
            if (showTitle) {
                document.querySelector(".front").style.backgroundImage = "none";
                document.querySelector(".front").classList.add("title-only");
            } else {
                document.querySelector(".front").classList.remove("title-only");
                document.querySelector(".front").style.backgroundImage = `url(${imageUrl})`;
            }
        });

        newBook.querySelector(".delete-btn").addEventListener("click", (e) => {
            e.stopPropagation();

            const wasActive = newBook.classList.contains("active");

            newBook.remove();

            if (wasActive) {
                const remainingBooks = document.querySelectorAll(".book-option");
                if (remainingBooks.length > 0) {
                    remainingBooks[0].click();
                } else {
                    console.log("No books left");
                }
            }
        });

        const addBtn = document.querySelector(".book-option-add");
        addBtn.parentElement.insertBefore(newBook, addBtn);

        closeModal();
    };

    if (imageInput.files && imageInput.files[0]) {
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        alert("Please select a cover image!");
    }
} 

const buttons = document.querySelectorAll('.card-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            window.location.href = 'https://www.freelancer.com.ua/u/olehwebdevelop?sb=t';
        });
    });
