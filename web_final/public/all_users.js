import app from "./firebase-config.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", async () => {
    const allUsersList = document.getElementById("allUsersList");

    async function loadAllUsers() {
        try {
            const usersRef = collection(db, "users");
            const usersSnapshot = await getDocs(usersRef);

            allUsersList.innerHTML = "";

            if (usersSnapshot.empty) {
                allUsersList.textContent = "No users found.";
                return;
            }

            usersSnapshot.forEach((doc) => {
                const user = doc.data();
                const listItem = document.createElement("li");
                listItem.textContent = `${user.name || "No Name"} (${user.email || "No Email"})`;
                allUsersList.appendChild(listItem);
            });
        } catch (error) {
            console.error("Error loading all users:", error);
            allUsersList.textContent = "Error loading users. Check the console for details.";
        }
    }

    loadAllUsers();
});





