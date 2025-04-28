import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { isUserSignedIn, redirectToSignIn } from './firebaseauth.js';

document.addEventListener("DOMContentLoaded", async () => {
    const db = getFirestore();
    const noticeList = document.getElementById("noticeList");
    const eventList = document.getElementById("eventList");

    if (!eventList) {
        console.error("Event list element not found.");
        return;
    }

    // Fetch notices from Firestore
    async function loadNotices() {
        try {
            const noticesRef = collection(db, "notices");
            const noticesSnapshot = await getDocs(noticesRef);

            // Clear existing notices
            noticeList.innerHTML = "";

            if (!noticesSnapshot.empty) {
                noticesSnapshot.forEach((doc) => {
                    const notice = doc.data();
                    const noticeBox = document.createElement("div");
                    noticeBox.classList.add("notice-box"); // Add the notice-box class

                    noticeBox.innerHTML = `
                        <h3>${notice.title}</h3>
                        <p>${notice.details}</p>
                        <p><small>Posted on: ${new Date(
                         notice.timestamp.seconds * 1000
                        ).toLocaleDateString()}</small></p>
                    `;
                    noticeList.appendChild(noticeBox);
                });
            } else {
                noticeList.innerHTML = "<p>No notices available at the moment.</p>";
            }
        } catch (error) {
            console.error("Error fetching notices:", error);
            noticeList.innerHTML = "<p>Failed to load notices.</p>";
        }
    }

   
    async function loadEvents() {
        try {
            const eventsRef = collection(db, "events");
            const eventsSnapshot = await getDocs(eventsRef);

            
            eventList.innerHTML = "";

            if (!eventsSnapshot.empty) {
                eventsSnapshot.forEach((doc) => {
                    const event = doc.data();
                    
        
                    let eventDate = event.date;
                    if (eventDate && eventDate.toDate) {

                        eventDate = eventDate.toDate();
                    } else {
                 
                        eventDate = new Date(eventDate);
                    }

      
                    const formattedDate = eventDate.toLocaleDateString();

                    const eventCard = document.createElement("div");
                    eventCard.classList.add("event-card");

         
                    eventCard.innerHTML = `
                        <h3 class="event-title">
                            <a href="event-details.html?eventId=${doc.id}">${event.title}</a>
                        </h3>
                        <p class="event-date">${formattedDate}</p>
                        <p class="event-description">${event.description}</p>
                    `;

                    eventList.appendChild(eventCard);
                });
            } else {
                eventList.innerHTML = "<p>No events available at the moment.</p>";
            }
        } catch (error) {
            console.error("Error fetching events:", error);
            eventList.innerHTML = "<p>Failed to load events.</p>";
        }
    }

    
    await loadNotices();
    await loadEvents();
});


function addAuthCheck() {
    const buttons = Array.from(document.getElementsByTagName('button')).filter(btn => 
        !btn.classList.contains('btn-signin'));
    const links = Array.from(document.getElementsByTagName('a')).filter(link => 
        !link.classList.contains('btn-signin') && !link.id.includes('profile'));

    const handleClick = (e, originalOnClick) => {
        if (!isUserSignedIn()) {
            e.preventDefault();
            redirectToSignIn();
            return false;
        }
        if (originalOnClick) {
            return originalOnClick.call(this, e);
        }
    };

    buttons.forEach(button => {
        const originalOnClick = button.onclick;
        button.onclick = (e) => handleClick(e, originalOnClick);
    });

    links.forEach(link => {
        const originalOnClick = link.onclick;
        link.onclick = (e) => handleClick(e, originalOnClick);
    });
}


document.addEventListener('DOMContentLoaded', addAuthCheck);
