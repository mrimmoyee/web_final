import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

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

let selectedSet = "Set 1";
let questions = [];

document.addEventListener("DOMContentLoaded", () => {
    const setSelection = document.getElementById("setSelection");
    const addQuestionButton = document.getElementById("addQuestion");
    const publishSetButton = document.getElementById("publishSet");
    const questionCount = document.getElementById("questionCount");

    setSelection.addEventListener("change", (e) => {
        selectedSet = e.target.value;
        questions = [];
        questionCount.textContent = "Questions Added: 0/5";
    });

    addQuestionButton.addEventListener("click", () => {
        if (questions.length >= 5) {
            alert("Each set can only have 5 questions!");
            return;
        }

        const question = document.getElementById("question").value;
        const option1 = document.getElementById("option1").value;
        const option2 = document.getElementById("option2").value;
        const option3 = document.getElementById("option3").value;
        const option4 = document.getElementById("option4").value;
        const correctOption = parseInt(document.getElementById("correctOption").value);

        if (!question || !option1 || !option2 || !option3 || !option4 || !correctOption) {
            alert("All fields are required!");
            return;
        }

        questions.push({
            question,
            options: [option1, option2, option3, option4],
            correctOption,
        });

        questionCount.textContent = `Questions Added: ${questions.length}/5`;
        document.getElementById("quizForm").reset();
    });

    publishSetButton.addEventListener("click", async () => {
        if (questions.length !== 5) {
            alert("Each set must have exactly 5 questions before publishing!");
            return;
        }

        try {
            await setDoc(doc(collection(db, "quizSets"), selectedSet), {
                questions,
            });
            alert(`Set ${selectedSet} published successfully!`);
            questions = [];
            questionCount.textContent = "Questions Added: 0/5";
        } catch (error) {
            console.error("Error publishing set: ", error);
            alert("Failed to publish set!");
        }
    });
});
