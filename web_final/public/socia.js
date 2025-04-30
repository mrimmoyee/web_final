import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, query, where, serverTimestamp, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";

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

document.addEventListener('DOMContentLoaded', () => {
  const profileGrid = document.getElementById('profileGrid');
  const requestsList = document.getElementById('requestsList');
  const connectedUsersList = document.getElementById('connectedUsersList');
  let currentUserEmail = null;

  // Authenticate user
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUserEmail = user.email;
      console.log("Current User:", currentUserEmail);

      // Load data once user is authenticated
      loadProfiles();
      loadReceivedRequests();
      loadConnectedUsers();
    } else {
      console.log("No user signed in.");
    }
  });

  async function loadProfiles() {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));

      if (querySnapshot.empty) {
        profileGrid.innerHTML = "<p>No profiles available to connect with.</p>";
        return;
      }

      const connectedUsersSnapshot = await getDocs(
        query(collection(db, "connected_users"), where("users", "array-contains", currentUserEmail))
      );
      const connectedUsers = connectedUsersSnapshot.docs
        .map(doc => doc.data().users)
        .flat();

      profileGrid.innerHTML = "";

      querySnapshot.forEach(doc => {
        const profile = doc.data();
        const role = profile.role?.toLowerCase();

        if ((role === "special child" || role === "educator") && !connectedUsers.includes(profile.email)) {
          const profileCard = document.createElement('div');
          profileCard.className = 'profile-card';

          profileCard.innerHTML = `
            <img src="${profile.photoURL || 'https://via.placeholder.com/100'}" alt="${profile.firstName} ${profile.lastName}" class="profile-img">
            <h2>${profile.firstName} ${profile.lastName}</h2>
            <p><strong>Email:</strong> ${profile.email}</p>
            <p><strong>Role:</strong> ${role === "special child" ? "Special Child" : "Educator"}</p>
            <button class="connect-btn" data-email="${profile.email}">Connect</button>
          `;

          profileGrid.appendChild(profileCard);
        }
      });

      document.querySelectorAll('.connect-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
          const recipientEmail = event.target.getAttribute('data-email');

          if (!currentUserEmail) {
            alert("You must be logged in to send connection requests.");
            return;
          }

          try {
            const connectionRef = collection(db, "connection_requests");
            await addDoc(connectionRef, {
              from: currentUserEmail,
              to: recipientEmail,
              status: "pending",
              timestamp: serverTimestamp(),
            });

            event.target.innerText = 'Pending';
            event.target.disabled = true;

            alert(`Connection request sent to ${recipientEmail}.`);
          } catch (error) {
            console.error("Error sending connection request:", error);
            alert("Failed to send connection request. Please try again.");
          }
        });
      });
    } catch (error) {
      console.error("Error loading profiles:", error);
      profileGrid.innerHTML = "<p>Failed to load profiles. Please try again later.</p>";
    }
  }

  async function loadReceivedRequests() {
    if (!currentUserEmail) return;

    try {
      const q = query(
        collection(db, "connection_requests"),
        where("to", "==", currentUserEmail),
        where("status", "==", "pending")
      );

      const querySnapshot = await getDocs(q);

      requestsList.innerHTML = "";

      if (querySnapshot.empty) {
        requestsList.innerHTML = "<p>No connection requests received.</p>";
        return;
      }

      querySnapshot.forEach(doc => {
        const request = doc.data();
        const requestCard = document.createElement('div');
        requestCard.className = 'request-card';

        requestCard.innerHTML = `
          <p><strong>From:</strong> ${request.from}</p>
          <button class="accept-btn" data-id="${doc.id}">Accept</button>
          <button class="reject-btn" data-id="${doc.id}">Reject</button>
        `;

        requestsList.appendChild(requestCard);
      });

      document.querySelectorAll('.accept-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
          const docId = event.target.getAttribute('data-id');
          await updateRequestStatus(docId, "accepted");
        });
      });

      document.querySelectorAll('.reject-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
          const docId = event.target.getAttribute('data-id');
          await updateRequestStatus(docId, "rejected");
        });
      });
    } catch (error) {
      console.error("Error loading received requests:", error);
      requestsList.innerHTML = "<p>Failed to load requests. Please try again later.</p>";
    }
  }

  async function loadConnectedUsers() {
    if (!currentUserEmail) {
      connectedUsersList.innerHTML = "<p>Please log in to see your connected users.</p>";
      return;
    }

    try {
      const connectedQuery = query(
        collection(db, "connected_users"),
        where("users", "array-contains", currentUserEmail)
      );

      const querySnapshot = await getDocs(connectedQuery);

      connectedUsersList.innerHTML = "";

      if (querySnapshot.empty) {
        connectedUsersList.innerHTML = "<p>No connected users yet.</p>";
        return;
      }

      querySnapshot.forEach(doc => {
        const connection = doc.data();
        const otherUser = connection.users.find(email => email !== currentUserEmail);

        const userCard = document.createElement('div');
        userCard.className = 'user-card';

        userCard.innerHTML = `
          <p><strong>Email:</strong> ${otherUser}</p>
          <button class="chat-btn" data-email="${otherUser}">Chat</button>
        `;

        connectedUsersList.appendChild(userCard);
      });

      document.querySelectorAll('.chat-btn').forEach(button => {
        button.addEventListener('click', (event) => {
          const otherUser = event.target.getAttribute('data-email');
          window.location.href = `chat.html?currentUser=${encodeURIComponent(currentUserEmail)}&otherUser=${encodeURIComponent(otherUser)}`;
        });
      });
    } catch (error) {
      console.error("Error loading connected users:", error);
      connectedUsersList.innerHTML = "<p>Failed to load connected users. Please try again later.</p>";
    }
  }

  async function updateRequestStatus(docId, status) {
    try {
      const requestRef = doc(db, "connection_requests", docId);
      const requestSnap = await getDoc(requestRef);

      if (requestSnap.exists()) {
        const request = requestSnap.data();
        const senderEmail = request.from;
        const recipientEmail = request.to;

        await updateDoc(requestRef, { status });

        if (status === "accepted") {
          await addDoc(collection(db, "connected_users"), {
            users: [senderEmail, recipientEmail],
            timestamp: serverTimestamp(),
          });
        }

        alert(`Request ${status}.`);
        loadReceivedRequests();
        loadConnectedUsers();
      }
    } catch (error) {
      console.error("Error updating request status:", error);
      alert("Failed to update request status. Please try again.");
    }
  }
});
