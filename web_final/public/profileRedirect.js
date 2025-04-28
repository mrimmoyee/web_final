import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";


const auth = getAuth();
const db = getFirestore();


const redirectToRoleDashboard = async () => {
  const user = auth.currentUser;

  if (user) {
    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        const userRole = userData.role;

        if (userRole) {
          const roleDashboard = `${userRole.toLowerCase()}_dashboard.html`;
          console.log(`Redirecting to: ${roleDashboard}`);
          window.location.href = roleDashboard;
        } else {
          console.error("Role not found in Firestore!");
          alert("Your role is not defined. Please contact support.");
        }
      } else {
        console.error("User document does not exist!");
        alert("No user information found. Please sign up again.");
      }
    } catch (error) {
      console.error("Error fetching user role from Firestore:", error);
      alert("An error occurred while fetching your data. Please try again.");
    }
  } else {
    alert("User is not signed in!");
    window.location.href = "signin.html"; 
  }
};

onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        const profileLink = `${userData.role.toLowerCase()}_dashboard.html`;
        document.getElementById("profilePage").setAttribute("href", profileLink);
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  }
});

const dashboardButton = document.getElementById("profilePage");
if (dashboardButton) {
  dashboardButton.addEventListener("click", (event) => {
    event.preventDefault(); 
    redirectToRoleDashboard();
  });
}