import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAL0UKvBVHertMHi9Zg0zJZdHgydXXxzIM",
  authDomain: "login-8133e.firebaseapp.com",
  projectId: "login-8133e",
  storageBucket: "login-8133e.firebasestorage.app",
  messagingSenderId: "668804295177",
  appId: "1:668804295177:web:fb0bba99c987da360a26d8",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const urlParams = new URLSearchParams(window.location.search);
const currentUser = urlParams.get("currentUser");
const otherUser = urlParams.get("otherUser");

document.getElementById("otherUser").textContent = otherUser;

const chatMessages = document.getElementById("chatMessages");
const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const emojiBtn = document.getElementById("emojiBtn");
const stickerBtn = document.getElementById("stickerBtn");
const emojiPicker = document.getElementById("emojiPicker");
const stickerPicker = document.getElementById("stickerPicker");

// Generate a unique chat ID for the conversation
const chatId = [currentUser, otherUser].sort().join("_");

// Sample emojis and stickers
const emojis = ['😊', '😂', '❤️', '👍', '🎉', '😍', '😢', '🔥'];
const stickers = [
  's1.jpg',
  's2.jpg',
  's3.jpg',
];

// Populate emoji picker
emojis.forEach(emoji => {
  const span = document.createElement('span');
  span.textContent = emoji;
  span.addEventListener('click', () => {
    messageInput.value += emoji;
    emojiPicker.style.display = 'none';
  });
  emojiPicker.appendChild(span);
});

// Populate sticker picker
stickers.forEach(sticker => {
  const img = document.createElement('img');
  img.src = sticker;
  img.alt = 'Sticker';
  img.addEventListener('click', async () => {
    try {
      await addDoc(chatRef, {
        sender: currentUser,
        type: 'sticker',
        text: sticker,
        timestamp: serverTimestamp(),
      });
      stickerPicker.style.display = 'none';
    } catch (error) {
      console.error("Error sending sticker:", error);
      alert("Failed to send sticker. Please try again.");
    }
  });
  stickerPicker.appendChild(img);
});

// Toggle emoji picker
emojiBtn.addEventListener('click', () => {
  emojiPicker.style.display = emojiPicker.style.display === 'block' ? 'none' : 'block';
  stickerPicker.style.display = 'none';
});

// Toggle sticker picker
stickerBtn.addEventListener('click', () => {
  stickerPicker.style.display = stickerPicker.style.display === 'block' ? 'none' : 'block';
  emojiPicker.style.display = 'none';
});

// Fetch chat messages in real-time
const chatRef = collection(db, "chats", chatId, "messages");
const chatQuery = query(chatRef, orderBy("timestamp"));

onSnapshot(chatQuery, (snapshot) => {
  chatMessages.innerHTML = "";
  snapshot.forEach((doc) => {
    const message = doc.data();
    const messageDiv = document.createElement("div");

    // Determine message alignment based on sender
    const isCurrentUser = message.sender === currentUser;
    messageDiv.classList.add("message", isCurrentUser ? "sent" : "received");

    const profilePic = document.createElement("img");
    profilePic.src = isCurrentUser ? "user1.jpg" : "user2.jpg";
    profilePic.alt = isCurrentUser ? "You" : "Other User";
    profilePic.classList.add("profile-pic");
    messageDiv.appendChild(profilePic);

    const textBubble = document.createElement("div");
    textBubble.classList.add("text");

    if (message.type === 'sticker') {
      messageDiv.classList.add('sticker');
      const img = document.createElement('img');
      img.src = message.text;
      img.alt = 'Sticker';
      textBubble.appendChild(img);
    } else {
      textBubble.textContent = message.text;
    }

    messageDiv.appendChild(textBubble);

    chatMessages.appendChild(messageDiv);
  });

  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const messageText = messageInput.value.trim();

  if (!messageText) return;

  try {
    await addDoc(chatRef, {
      sender: currentUser,
      type: 'text',
      text: messageText,
      timestamp: serverTimestamp(),
    });
    messageInput.value = "";  
  } catch (error) {
    console.error("Error sending message:", error);
    alert("Failed to send message. Please try again.");
  }
});