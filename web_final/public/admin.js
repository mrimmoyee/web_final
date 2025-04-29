import { getAuth, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getDoc, doc, getFirestore, collection, getDocs, addDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
    const auth = getAuth();
    const db = getFirestore();
    // Add Profile elements
    
    const profileContainer = document.getElementById("profileContainer");
    const profileForm = document.getElementById("profileForm");
    const headerProfilePic = document.getElementById("headerProfilePic");
    const profilePic = document.getElementById("profilePic");

    // Sidebar elements
    const sidebar = document.getElementById("sidebar");
    const menuButton = document.getElementById("menuButton");
    const closeButton = document.getElementById("closeButton");
    const logoutLink = document.getElementById("logoutLink");

    // Profile and user details elements
    const profileSection = document.getElementById("profileSection");
    const userDetails = document.getElementById("userDetails");
    const userList = document.getElementById("userList");

    // Post Notice elements
    const postNoticeButton = document.getElementById("postNoticeButton");
    const postNoticeForm = document.getElementById("postNoticeForm"); // Form container
    const noticeForm = document.getElementById("noticeForm");
    const noticeTitleInput = document.getElementById("noticeTitle");
    const noticeDetailsInput = document.getElementById("noticeDetails");

    // Post Event elements
    const postEventButton = document.getElementById("postEventButton");

     // Event Registration Details elements
     const eventRegistrationDetailsButton = document.getElementById("eventRegistrationDetailsButton");
     const eventRegistrationsSection = document.getElementById("eventRegistrationsSection");
     const eventList = document.getElementById("eventList");

    // Sidebar Toggle
    menuButton.addEventListener("click", () => {
        sidebar.style.width = "250px";
    });

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
// Load Users and Toggle User Details
const detailsButton = document.getElementById("detailsButton");
detailsButton.addEventListener("click", async () => {
    if (userDetails.style.display === "none") {
        userDetails.style.display = "block";
        await loadUsers();
    } else {
        userDetails.style.display = "none";
    }
});

async function loadUsers() {
    try {
        const usersRef = collection(db, "users");
        const usersSnapshot = await getDocs(usersRef);
        const users = usersSnapshot.docs;

        const maxUsersToShow = 3;
        const displayedUsers = users.slice(0, maxUsersToShow); // Limit to 3 users

        userList.innerHTML = ""; // Clear existing content
        displayedUsers.forEach((doc) => {
            const user = doc.data();
            const listItem = document.createElement("li");
            listItem.textContent = `${user.firstName} (${user.email})`;
            userList.appendChild(listItem);
        });

        // Add the "View All Users" button if there are more users to load
        if (users.length > maxUsersToShow) {
            const viewAllButton = document.createElement("button");
            viewAllButton.textContent = "View All Users";
            viewAllButton.addEventListener("click", () => {
                window.location.href = "all_users.html"; // Redirect to the details page
            });
            userList.appendChild(viewAllButton); // Add the button after the users
        }
    } catch (error) {
        console.error("Error loading users:", error);
    }
}


    // ✅ Fix: Show Post Notice Form when clicking "Post Notice" button
    postNoticeButton.addEventListener("click", () => {
        if (postNoticeForm.style.display === "none" || postNoticeForm.style.display === "") {
            postNoticeForm.style.display = "block"; // Show the form
        } else {
            postNoticeForm.style.display = "none"; // Hide the form
        }
    });

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
            
            // Check if elements exist before updating
            if (headerProfilePic) {
                headerProfilePic.src = userData.photoURL || '/default-profile.png';
            }
            
            const headerProfileName = document.getElementById('headerProfileName');
            if (headerProfileName) {
                headerProfileName.textContent = userData.firstName || 'User';
            }
            
            if (profilePic) {
                profilePic.src = userData.photoURL || '/default-profile.png';
            }
            
            const aboutInput = document.getElementById('about');
            if (aboutInput) {
                aboutInput.value = userData.about || '';
            }

            // Store in localStorage for persistence
            localStorage.setItem('userProfile', JSON.stringify(userData));
            
        } catch (error) {
            console.error("Error loading profile:", error);
        }
    }

    // Show/Hide Profile Section
    profileSection.addEventListener('click', () => {
        profileContainer.style.display = 'block';
        userDetails.style.display = 'none';
        postNoticeForm.style.display = 'none';
    });

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

                // Update UI
                if (headerProfilePic) headerProfilePic.src = photoURL;
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

    // ✅ Handle Notice Form Submission
    noticeForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const title = noticeTitleInput.value.trim();
        const details = noticeDetailsInput.value.trim();

        if (title && details) {
            try {
                await addDoc(collection(db, "notices"), {
                    title,
                    details,
                    timestamp: new Date(),
                });

                alert("Notice posted successfully!");
                noticeTitleInput.value = "";
                noticeDetailsInput.value = "";
                postNoticeForm.style.display = "none"; // Hide form after posting
            } catch (error) {
                console.error("Error posting notice:", error);
            }
        } else {
            alert("Please fill out both fields before submitting.");
        }
    });

        // ✅ Toggle Event Registration Details Section
        eventRegistrationDetailsButton.addEventListener("click", async () => {
            if (eventRegistrationsSection.style.display === "none") {
                eventRegistrationsSection.style.display = "block";
                await loadEventRegistrations();
            } else {
                eventRegistrationsSection.style.display = "none";
            }
        });
    
        // ✅ Fetch and Display Event Registrations from Firebase
        // Fetch event registrations from Firestore
// Fetch event registrations from Firestore
async function loadEventRegistrations() {
    try {
        const registrationsRef = collection(db, "eventRegistrations"); // Collection with registration details
        const registrationsSnapshot = await getDocs(registrationsRef);

        eventList.innerHTML = ""; // Clear previous data

        if (registrationsSnapshot.empty) {
            eventList.innerHTML = "<p>No registrations found.</p>";
            return;
        }

    
        for (const docSnapshot of registrationsSnapshot.docs) {
            const registration = docSnapshot.data();
            
           
            const eventRef = doc(db, "events", registration.eventId); // Correct reference to the event document
            const eventSnapshot = await getDoc(eventRef);

            if (eventSnapshot.exists()) {
                const eventData = eventSnapshot.data();
                const eventTitle = eventData.title; 

                const listItem = document.createElement("div");
                listItem.classList.add("event-registration-item");

                listItem.innerHTML = `
                    <strong>Event:</strong> ${eventTitle} <br>
                    <strong>User:</strong> ${registration.username} (${registration.email})
                    <hr>
                `;

                eventList.appendChild(listItem);
            } else {
                console.error("Event not found for eventId:", registration.eventId);
            }
        }
    } catch (error) {
        console.error("Error loading event registrations:", error);
    }
}


    

    
    postEventButton.addEventListener("click", () => {
        window.location.href = "post-event.html";
    });

    
    async function loadEvents() {
        const eventsRef = collection(db, "events");
        const eventsSnapshot = await getDocs(eventsRef);

        const eventsSection = document.getElementById("clients");
        eventsSection.innerHTML = ""; 

        eventsSnapshot.forEach((doc) => {
            const event = doc.data();
            const newEvent = document.createElement("div");
            newEvent.classList.add("client-item");

            const img = document.createElement("img");
            img.src = event.imageUrl;
            img.alt = event.title;

            const h3 = document.createElement("h3");
            h3.classList.add("event-title");
            h3.textContent = event.title;

            newEvent.appendChild(img);
            newEvent.appendChild(h3);
            eventsSection.appendChild(newEvent);
        });
    }

    loadEvents(); 

    


});
