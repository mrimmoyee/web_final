// firebaseauth.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAL0UKvBVHertMHi9Zg0zJZdHgydXXxzIM",
    authDomain: "login-8133e.firebaseapp.com",
    projectId: "login-8133e",
    storageBucket: "login-8133e.firebasestorage.app",
    messagingSenderId: "668804295177",
    appId: "1:668804295177:web:fb0bba99c987da360a26d8"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);  // Export auth here
export const db = getFirestore(app);

// Function to check if the user is signed in
export function isUserSignedIn() {
    return localStorage.getItem('loggedInUserId') !== null;
}

// Redirect to sign-in page if not logged in
export function redirectToSignIn() {
    alert("Please sign in first!");
    window.location.href = 'signin.html';
}

// Show message function
function showMessage(message, divId, isError = false) {
    const messageDiv = document.getElementById(divId);
    if (messageDiv) {
        messageDiv.style.display = "block";
        messageDiv.innerHTML = message;
        messageDiv.style.opacity = 1;
        if (isError) {
            messageDiv.style.backgroundColor = "#ff4444";
        }
        setTimeout(() => messageDiv.style.opacity = 0, 5000);
    }
}

// Set loading state for buttons
function setLoading(buttonId, isLoading) {
    const button = document.getElementById(buttonId);
    if (button) {
        button.disabled = isLoading;
        button.innerHTML = isLoading ? 'Please wait...' : (buttonId === 'submitSignUp' ? 'Sign Up' : 'Sign In');
    }
}

// Retry an operation in case of network issues
async function retryOperation(operation, maxAttempts = 3) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await operation();
        } catch (error) {
            if (error.code === 'auth/network-request-failed' && attempt < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
                continue;
            }
            throw error;
        }
    }
}

// Event listener for DOMContentLoaded to handle sign-up and sign-in forms
document.addEventListener("DOMContentLoaded", function() {

    // Sign-Up form submission
    const signUpForm = document.getElementById("signUpForm");
    if (signUpForm) {
        signUpForm.addEventListener("submit", async function(event) {
            event.preventDefault();
            const firstName = document.getElementById("fName").value.trim();
            const lastName = document.getElementById("lName").value.trim();
            const email = document.getElementById("rEmail").value.trim();
            const password = document.getElementById("rPassword").value.trim();
            const role = document.getElementById("rRole").value;
            const level = document.getElementById("rLevel") ? document.getElementById("rLevel").value : "";

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                const userData = { uid: user.uid, firstName, lastName, email, role, level, createdAt: new Date() };
                await setDoc(doc(db, "users", user.uid), userData);
                showMessage("Account Created Successfully", "signUpMessage");
                setTimeout(() => {
                    window.location.href = role === "Special child" ? "test.html" : "index.html";
                }, 1500);
            } catch (error) {
                showMessage("Error: " + error.message, "signUpMessage", true);
            }
        });
    }

    // Sign-In form submission
    const signIn = document.getElementById('submitSignIn');
    if (signIn) {
        signIn.addEventListener('click', async (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            setLoading('submitSignIn', true);
            try {
                await retryOperation(async () => {
                    const userCredential = await signInWithEmailAndPassword(auth, email, password);
                    showMessage('Login successful', 'signInMessage');
                    localStorage.setItem('loggedInUserId', userCredential.user.uid);
                    setTimeout(() => window.location.href = 'index.html', 1500);
                });
            } catch (error) {
                if (error.code === 'auth/network-request-failed') {
                    showMessage('Network error. Please check your internet connection and try again.', 'signInMessage', true);
                } else if (error.code === 'auth/invalid-credential') {
                    showMessage('Incorrect Email or Password', 'signInMessage', true);
                } else {
                    showMessage('Account does not exist', 'signInMessage', true);
                }
            } finally {
                setLoading('submitSignIn', false);
            }
        });
    }

   
    onAuthStateChanged(auth, async (user) => {
        const profileContainer = document.getElementById("profile-container");
        const signinLink = document.querySelector(".auth-links .btn-signin");

        if (!profileContainer && !signinLink) return;

        if (user) {
            try {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);

                if (profileContainer) profileContainer.style.display = "flex";
                if (signinLink) {
                    signinLink.textContent = "Sign Out";
                    signinLink.onclick = () => signOut(auth).then(() => window.location.href = "index.html");
                }

                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    const profilePicElement = document.getElementById("profilePage");
                    if (profilePicElement) {
                        profilePicElement.href = `${userData.role.toLowerCase()}_child_dashboard.html`;
                        profilePicElement.src = userData.photoURL || '/public/image/logo1.jpeg';
                        if (userData.photoURL) localStorage.setItem('userProfilePic', userData.photoURL);
                    }
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        } else {
            if (profileContainer) profileContainer.style.display = "none";
            if (signinLink) {
                signinLink.textContent = "Sign In";
                signinLink.onclick = null;
                signinLink.href = "signin.html";
            }
        }
    });

   
    const logoutButton = document.getElementById("logout");
    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            signOut(auth)
                .then(() => window.location.href = "index.html")
                .catch((error) => console.error("Error logging out: ", error));
        });
    }

    
    const profilePage = document.getElementById("profilePage");
    if (profilePage) {
        profilePage.addEventListener("click", function(event) {
            event.preventDefault();
            const profileLink = event.target.getAttribute("href");
            if (profileLink) {
                window.location.href = profileLink;
            } else {
                alert("Error: User profile not available.");
            }
        });
    }
});
