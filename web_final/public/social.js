const { useState } = React;

// Default activities data
const activitiesData = [
    {
        title: "Yoga for Special Children",
        date: "2024-10-20",
        description: "Relax and unwind with a calming yoga session.",
    },
    {
        title: "Music Therapy Sessions",
        date: "2024-11-15",
        description: "Engage in music therapy to enhance emotional well-being.",
    },
];

// Retrieve events data from localStorage or use default data
const eventsData = JSON.parse(localStorage.getItem('eventsData')) || [
    {
        title: "Art Therapy Workshop",
        date: "2024-11-10",
        description: "Join us for a creative day of art therapy.",
    },
    {
        title: "Special Needs Awareness Day",
        date: "2024-12-05",
        description: "An event to raise awareness about special needs.",
    },
];

const EventsActivitiesApp = () => {
    return (
        <div className="container">
            <h1>Events & Activities</h1>

            {/* Upcoming Events Section */}
            <h2>Upcoming Events</h2>
            <div className="card-container">
                {eventsData.map((event, index) => (
                    <div className="card" key={index}>
                        <h3 className="card-title">{event.title}</h3>
                        <div className="details">
                            <span className="date">{event.date}</span>
                            <button className="button">More Info</button>
                        </div>
                        <p className="description">{event.description}</p>
                    </div>
                ))}
            </div>

            {}
            <h2>Activities</h2>
            <div className="card-container">
                {activitiesData.map((activity, index) => (
                    <div className="card" key={index}>
                        <h3 className="card-title">{activity.title}</h3>
                        <div className="details">
                            <span className="date">{activity.date}</span>
                            <button className="button">Join</button>
                        </div>
                        <p className="description">{activity.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

ReactDOM.render(<EventsActivitiesApp />, document.getElementById('root'));
