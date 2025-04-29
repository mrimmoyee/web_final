import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getAuth, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Initialize Firebase
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

document.addEventListener("DOMContentLoaded", () => {
    const auth = getAuth();

    // Sidebar elements
    const sidebar = document.getElementById("sidebar");
    const menuButton = document.getElementById("menuButton");
    const closeButton = document.getElementById("closeButton");
    const logoutLink = document.getElementById("logoutLink");
    const profileSection = document.getElementById("profileSection");
    const profileContainer = document.getElementById("profileContainer");
    const setsContainer = document.getElementById("setsContainer");
    const profilePic = document.getElementById("profilePic");
    const profileForm = document.getElementById("profileForm");
    const enrolledCoursesContainer = document.getElementById("enrolledCoursesContainer");


    // Open Sidebar
    menuButton.addEventListener("click", () => {
        sidebar.style.width = "250px";
    });

    // Close Sidebar
    closeButton.addEventListener("click", () => {
        sidebar.style.width = "0";
    });

    // Logout functionality
    logoutLink.addEventListener("click", () => {
        signOut(auth)
            .then(() => {
                window.location.href = "index.html";
            })
            .catch((error) => {
                console.error("Error logging out:", error);
            });
    });

    const setsList = document.getElementById("setsList");
    const quizContainer = document.getElementById("quizContainer");
    const setTitle = document.getElementById("setTitle");
    const questionsList = document.getElementById("questionsList");
    const submitQuizButton = document.getElementById("submitQuiz");
    const quizResult = document.getElementById("quizResult");
    const goBackButton = document.getElementById("goBackButton");

    const fetchSets = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "quizSets"));
            setsList.innerHTML = "";

            querySnapshot.forEach((doc) => {
                const setName = doc.id;
                const setElement = document.createElement("div");
                setElement.innerHTML = `
                    <button class="set-button" data-set="${setName}">${setName}</button>
                `;
                setsList.appendChild(setElement);
            });
        } catch (error) {
            console.error("Error fetching sets:", error);
        }
    };

    // Load Profile Data
    async function loadProfileData() {
        const user = auth.currentUser;
        if (!user) {
            console.log("No user logged in");
            return;
        }

        try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (!userDoc.exists()) {
                console.log("No user profile found");
                return;
            }

            const userData = userDoc.data();
            
            if (profilePic) {
                profilePic.src = userData.photoURL || '/default-profile.png';
            }
            
            const aboutInput = document.getElementById('about');
            if (aboutInput) {
                aboutInput.value = userData.about || '';
            }

            localStorage.setItem('userProfile', JSON.stringify(userData));
            
        } catch (error) {
            console.error("Error loading profile:", error);
        }
    }

    // Show/Hide Profile Section
    profileSection.addEventListener('click', () => {
        profileContainer.style.display = 'block';
        setsContainer.style.display = 'none';
        quizContainer.style.display = 'none';
      
    });

    // Add back to dashboard button
    const backToDashboard = document.createElement("button");
    backToDashboard.textContent = "Back to Dashboard";
    backToDashboard.addEventListener('click', () => {
        profileContainer.style.display = 'none';
        setsContainer.style.display = 'block';
    });
    profileContainer.appendChild(backToDashboard);

    // Handle Profile Update
    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const user = auth.currentUser;
            if (!user) {
                alert('Please log in first');
                return;
            }

            try {
                const profileImage = document.getElementById('profileImage').files[0];
                const about = document.getElementById('about').value;

                let photoURL = user.photoURL;
                if (profileImage) {
                    photoURL = await uploadToCloudinary(profileImage);
                }

                // Update Firestore first
                const userRef = doc(db, 'users', user.uid);
                await updateDoc(userRef, {
                    photoURL,
                    about,
                    lastUpdated: new Date()
                });

                // Update Auth Profile
                await updateProfile(user, {
                    photoURL: photoURL
                });

                // Update UI (removed headerProfilePic reference)
                if (profilePic) profilePic.src = photoURL;

                // Update localStorage
                const currentProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
                localStorage.setItem('userProfile', JSON.stringify({
                    ...currentProfile,
                    photoURL,
                    about
                }));

                alert('Profile updated successfully!');
                await loadProfileData(); // Reload profile data
                
            } catch (error) {
                console.error('Error updating profile:', error);
                alert('Failed to update profile: ' + error.message);
            }
        });
    }

    


    // Cloudinary Upload Function
    async function uploadToCloudinary(file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'my_upload_preset');

        try {
            const response = await fetch('https://api.cloudinary.com/v1_1/dra4ykviv/image/upload', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error('Upload failed');
            }
            
            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            console.error('Cloudinary Upload Error:', error);
            throw error;
        }
    }

    // Load profile data when page loads
    loadProfileData();

    setsList.addEventListener("click", async (e) => {
        if (e.target.classList.contains("set-button")) {
            const setName = e.target.dataset.set;
            setTitle.textContent = setName;

            // Fetch the set's questions
            const setDoc = await getDoc(doc(collection(db, "quizSets"), setName));
            const { questions } = setDoc.data();

            displayQuestions(questions);
            quizContainer.style.display = "block";
            submitQuizButton.style.display = "block";
            quizResult.textContent = ""; // Clear previous results
            goBackButton.style.display = "none";
        }
    });

    const displayQuestions = (questions) => {
        questionsList.innerHTML = "";
        questions.forEach((question, index) => {
            const questionElement = document.createElement("div");
            questionElement.innerHTML = `
                <p><strong>Question ${index + 1}:</strong> ${question.question}</p>
                <div class="options">
                    ${question.options
                        .map(
                            (option, i) =>
                                `<label>
                                    <input type="radio" name="question${index}" value="${i + 1}">
                                    ${option}
                                </label>`
                        )
                        .join("<br>")}
                </div>
            `;
            questionsList.appendChild(questionElement);
        });
    };

    submitQuizButton.addEventListener("click", () => {
        const answers = [];
        const questions = document.querySelectorAll(".options");

        questions.forEach((question, index) => {
            const selectedOption = document.querySelector(
                `input[name="question${index}"]:checked`
            );
            answers.push(selectedOption ? parseInt(selectedOption.value) : null);
        });

        calculateResults(answers);
    });

    const calculateResults = async (answers) => {
        const setName = setTitle.textContent;
        const setDoc = await getDoc(doc(collection(db, "quizSets"), setName));
        const { questions } = setDoc.data();

        let correctCount = 0;

        questions.forEach((question, index) => {
            if (answers[index] === question.correctOption) {
                correctCount++;
            }
        });

        quizResult.textContent = `You got ${correctCount} out of ${questions.length} correct!`;
        goBackButton.style.display = "block";
    };

    goBackButton.addEventListener("click", () => {
        quizContainer.style.display = "none";
        setsContainer.style.display = "block";
    });

    fetchSets();
});