import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAL0UKvBVHertMHi9Zg0zJZdHgydXXxzIM",
    authDomain: "login-8133e.firebaseapp.com",
    projectId: "login-8133e",
    storageBucket: "login-8133e.firebasestorage.app",
    messagingSenderId: "668804295177",
    appId: "1:668804295177:web:fb0bba99c987da360a26d8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {
    const postEventForm = document.getElementById("postEventForm");

    postEventForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const eventTitle = document.getElementById("eventTitle").value;
        const eventDate = document.getElementById("eventDate").value; 
        const eventDescription = document.getElementById("eventDescription").value;

        const eventDateObj = new Date(eventDate); 

        try {
            const eventRef = await addDoc(collection(db, "events"), {
                title: eventTitle,
                date: eventDateObj, 
                description: eventDescription,
                createdAt: new Date(), 
            });

            alert("Event posted successfully!");

            window.location.href = "admin_dashboard.html";
        } catch (error) {
            console.error("Error posting event:", error);
            alert("Failed to post the event.");
        }
    });
});
