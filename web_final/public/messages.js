import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

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

function formatTimestamp(timestamp) {
    if (!timestamp) return "Unknown Date";
    
    if (typeof timestamp === "object" && timestamp.seconds) {
        return new Date(timestamp.seconds * 1000).toLocaleString();
    }

    if (typeof timestamp === "string") {
        return new Date(timestamp).toLocaleString();
    }

    return "Invalid Date";
}

async function fetchMessages() {
    const messagesContainer = document.getElementById("messagesContainer");

    try {
        const querySnapshot = await getDocs(collection(db, "contactMessages"));

        if (querySnapshot.empty) {
            messagesContainer.innerHTML = "<p>No messages found.</p>";
            return;
        }

        querySnapshot.forEach((doc) => {
            const messageData = doc.data();
            const messageTile = document.createElement("div");
            messageTile.classList.add("message-tile");

            messageTile.innerHTML = `
                <h3>${messageData.name}</h3>
                <p><strong>Email:</strong> ${messageData.email}</p>
                <p><strong>Message:</strong> ${messageData.message}</p>
                <p><strong>Date:</strong> ${formatTimestamp(messageData.timestamp)}</p>
            `;

            messagesContainer.appendChild(messageTile);
        });
    } catch (error) {
        console.error("Error fetching messages:", error);
        messagesContainer.innerHTML = "<p>Error loading messages. Please try again later.</p>";
    }
}

document.addEventListener("DOMContentLoaded", fetchMessages);
