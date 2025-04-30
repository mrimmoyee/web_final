const uploadBtn = document.getElementById('uploadBtn');
const uploadModal = document.getElementById('uploadModal');
const closeModal = document.getElementById('closeModal');
const submitUpload = document.getElementById('submitUpload');
const vlogGrid = document.getElementById('vlogGrid');

let vlogPosts = [
    {
        title: "Introduction to Programming",
        description: "Learn the basics of programming with this comprehensive tutorial",
        videoUrl: "tutorial.mp4"
    },
    {
        title: "Introduction to Programming",
        description: "Learn the basics of programming with this comprehensive tutorial",
        videoUrl: "tutorial.mp4"
    },
    {
        title: "Introduction to Programming",
        description: "Learn the basics of programming with this comprehensive tutorial",
        videoUrl: "tutorial.mp4"
    },
    {
        title: "Introduction to Programming",
        description: "Learn the basics of programming with this comprehensive tutorial",
        videoUrl: "tutorial.mp4"
    }
];

// Save to localStorage on page load
localStorage.setItem('vlogPosts', JSON.stringify(vlogPosts));

const displayVlogs = () => {
    vlogGrid.innerHTML = '';
    vlogPosts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('vlog-item');
        
        // Create thumbnail container
        const thumbnailContainer = document.createElement('div');
        thumbnailContainer.classList.add('thumbnail-container');
        
        // Create video element
        const videoElement = document.createElement('video');
        videoElement.src = post.videoUrl;
        videoElement.preload = 'metadata';
        
        // Create play overlay
        const playOverlay = document.createElement('div');
        playOverlay.classList.add('play-overlay');
        const playIcon = document.createElement('div');
        playIcon.classList.add('play-icon');
        playOverlay.appendChild(playIcon);
        
        // Add click handler
        thumbnailContainer.addEventListener('click', () => {
            if (videoElement.paused) {
                videoElement.play();
                playOverlay.style.display = 'none';
            } else {
                videoElement.pause();
                playOverlay.style.display = 'flex';
            }
        });
        
        // Handle video end
        videoElement.addEventListener('ended', () => {
            playOverlay.style.display = 'flex';
        });
        
        thumbnailContainer.appendChild(videoElement);
        thumbnailContainer.appendChild(playOverlay);
        
        const titleElement = document.createElement('h3');
        titleElement.innerText = post.title;
        
        const descriptionElement = document.createElement('p');
        descriptionElement.innerText = post.description;
        
        postDiv.appendChild(thumbnailContainer);
        postDiv.appendChild(titleElement);
        postDiv.appendChild(descriptionElement);
        
        vlogGrid.appendChild(postDiv);
    });
};

const openModal = () => {
    uploadModal.style.display = 'flex';
};

const closeUploadModal = () => {
    uploadModal.style.display = 'none';
};

const handleUpload = () => {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const videoFile = document.getElementById('videoFile').files[0];

    if (!title || !description || !videoFile) {
        alert('All fields are required!');
        return;
    }

    const videoUrl = URL.createObjectURL(videoFile);

    const newPost = {
        title: title,
        description: description,
        videoUrl: videoUrl,
    };

    vlogPosts.push(newPost);
    localStorage.setItem('vlogPosts', JSON.stringify(vlogPosts));

    displayVlogs();
    closeUploadModal();
};

uploadBtn.addEventListener('click', openModal);
closeModal.addEventListener('click', closeUploadModal);
submitUpload.addEventListener('click', handleUpload);

// Display vlog posts on page load
displayVlogs();