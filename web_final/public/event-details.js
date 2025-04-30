// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, doc, getDoc, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAL0UKvBVHertMHi9Zg0zJZdHgydXXxzIM",
    authDomain: "login-8133e.firebaseapp.com",
    projectId: "login-8133e",
    storageBucket: "login-8133e.firebasestorage.app",
    messagingSenderId: "668804295177",
    appId: "1:668804295177:web:fb0bba99c987da360a26d8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", async () => {
    const eventDetailsContainer = document.getElementById("eventDetails");
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get("eventId"); // Get event ID from the query parameter

    if (!eventId) {
        eventDetailsContainer.innerHTML = "<p>Event not found.</p>";
        return;
    }

    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            eventDetailsContainer.innerHTML = "<p>Please log in to register for events.</p>";
            return;
        }

        try {
            // Fetch event details from Firestore
            const eventDocRef = doc(db, "events", eventId);
            const eventDoc = await getDoc(eventDocRef);

            if (eventDoc.exists()) {
                const event = eventDoc.data();

                // Convert Firestore Timestamp to readable Date
                let eventDate = event.date;
                if (eventDate && eventDate.toDate) {
                    eventDate = eventDate.toDate().toLocaleDateString();
                } else if (typeof eventDate === 'string') {
                    eventDate = new Date(eventDate).toLocaleDateString();
                } else {
                    eventDate = "Invalid date";
                }

                eventDetailsContainer.innerHTML = `
                    <h2>${event.title}</h2>
                    <p>${event.description}</p>
                    <p><strong>Date:</strong> ${eventDate}</p>
                    <button id="registerButton">Register for Event</button>
                    <p id="registrationStatus"></p>
                `;

                const registrationStatus = document.getElementById("registrationStatus");
                const registerButton = document.getElementById("registerButton");

                // Check if the user is already registered for this event
                const registrationQuery = query(
                    collection(db, "eventRegistrations"),
                    where("eventId", "==", eventId),
                    where("userId", "==", user.uid)
                );
                const registrationSnapshot = await getDocs(registrationQuery);

                if (!registrationSnapshot.empty) {
                    // User is already registered
                    registerButton.innerHTML = "Registered";
                    registerButton.disabled = true;
                    registrationStatus.innerHTML = "You are already registered for this event!";
                } else {
                    // Handle registration
                    registerButton.addEventListener("click", () => {
                        const registrationForm = document.createElement("form");
                        registrationForm.innerHTML = `
                            <label for="username">Username:</label>
                            <input type="text" id="username" required>
                            <label for="email">Email:</label>
                            <input type="email" id="email" required>
                            <button type="submit">Register</button>
                        `;

                        eventDetailsContainer.appendChild(registrationForm);

                        registrationForm.addEventListener("submit", async (e) => {
                            e.preventDefault();
                            const username = document.getElementById("username").value;
                            const email = document.getElementById("email").value;

                            // Save registration details to Firestore
                            await addDoc(collection(db, "eventRegistrations"), {
                                eventId,
                                username,
                                email,
                                userId: user.uid,
                                registeredAt: new Date(),
                            });

                            // Update UI to show registered status
                            registerButton.innerHTML = "Registered";
                            registerButton.disabled = true;
                            registrationStatus.innerHTML = "You have successfully registered for the event!";
                            registrationForm.style.display = "none"; // Hide the registration form
                        });
                    });
                }
            } else {
                eventDetailsContainer.innerHTML = "<p>Event not found.</p>";
            }
        } catch (error) {
            console.error("Error fetching event details:", error);
            eventDetailsContainer.innerHTML = "<p>Failed to load event details.</p>";
        }
    });
});
