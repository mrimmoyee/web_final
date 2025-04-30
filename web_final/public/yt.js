document.addEventListener('DOMContentLoaded', () => {
  // Store video data globally
  window.allVideos = [];
  window.allShorts = [];
  window.uploadedVideos = []; // Store specifically user uploaded videos

  // Sample video data
  const sampleVideos = [
    {
      id: 'v1',
      title: 'How to Build a YouTube Clone with HTML, CSS, and JavaScript',
      description: 'In this tutorial, we will build a YouTube clone using HTML, CSS, and JavaScript. Learn about responsive design, video playback, and more.',
      channelName: 'Web Dev Simplified',
      channelIcon: 'https://picsum.photos/36/36?random=1',
      views: '1.2M views',
      uploadedAgo: '3 months ago',
      duration: '18:24',
      thumbnail: 'https://picsum.photos/320/180?random=1',
      category: 'Web Development'
    },
    {
      id: 'v2',
      title: 'Learn CSS Grid in 20 Minutes',
      description: 'CSS Grid is a powerful layout system for web design. In this video, we explore the fundamentals of CSS Grid and how to use it effectively.',
      channelName: 'Dev Ed',
      channelIcon: 'https://picsum.photos/36/36?random=2',
      views: '850K views',
      uploadedAgo: '1 year ago',
      duration: '20:17',
      thumbnail: 'https://picsum.photos/320/180?random=2',
      category: 'Web Development'
    },
    {
      id: 'v3',
      title: 'JavaScript Async/Await Tutorial',
      description: 'Master asynchronous JavaScript with async/await. Learn how to handle promises and make your code more readable and maintainable.',
      channelName: 'Traversy Media',
      channelIcon: 'https://picsum.photos/36/36?random=3',
      views: '1.5M views',
      uploadedAgo: '2 years ago',
      duration: '15:32',
      thumbnail: 'https://picsum.photos/320/180?random=3',
      category: 'Computer programming'
    },
    {
      id: 'v4',
      title: 'How to Make a Music Player with JavaScript',
      description: 'Create your own music player using JavaScript. We cover audio playback, playlist management, and custom controls.',
      channelName: 'Coding Nepal',
      channelIcon: 'https://picsum.photos/36/36?random=4',
      views: '432K views',
      uploadedAgo: '8 months ago',
      duration: '22:45',
      thumbnail: 'https://picsum.photos/320/180?random=4',
      category: 'Music'
    },
    {
      id: 'v5',
      title: 'Building a Game with JavaScript',
      description: 'Learn to build a simple game using JavaScript. We cover game loops, collision detection, and animation techniques.',
      channelName: 'Ania Kubów',
      channelIcon: 'https://picsum.photos/36/36?random=5',
      views: '687K views',
      uploadedAgo: '5 months ago',
      duration: '45:12',
      thumbnail: 'https://picsum.photos/320/180?random=5',
      category: 'Gaming'
    },
    {
      id: 'v6',
      title: 'Responsive Website Design from Scratch',
      description: 'Build a fully responsive website from scratch. Learn how to use media queries, flexible layouts, and responsive images.',
      channelName: 'DesignCourse',
      channelIcon: 'https://picsum.photos/36/36?random=6',
      views: '921K views',
      uploadedAgo: '1 year ago',
      duration: '30:18',
      thumbnail: 'https://picsum.photos/320/180?random=6',
      category: 'Web Development'
    }
  ];

  // Sample shorts data
  const sampleShorts = [
    {
      id: 's1',
      title: 'CSS Animation Tricks You Need to Know',
      thumbnail: 'https://picsum.photos/160/285?random=1',
      views: '1.5M views'
    },
    {
      id: 's2',
      title: 'JavaScript One-liners That Will Blow Your Mind',
      thumbnail: 'https://picsum.photos/160/285?random=2',
      views: '2.3M views'
    },
    {
      id: 's3',
      title: '5 HTML Tips for Beginners',
      thumbnail: 'https://picsum.photos/160/285?random=3',
      views: '987K views'
    },
    {
      id: 's4',
      title: 'How to Center a Div - CSS Hack',
      thumbnail: 'https://picsum.photos/160/285?random=4',
      views: '1.2M views'
    },
    {
      id: 's5',
      title: 'Coolest VS Code Extensions for Web Devs',
      thumbnail: 'https://picsum.photos/160/285?random=5',
      views: '456K views'
    },
    {
      id: 's6',
      title: 'Git Commands You Must Know',
      thumbnail: 'https://picsum.photos/160/285?random=6',
      views: '789K views'
    }
  ];

  // Load user uploaded videos from localStorage
  const loadUploadedVideos = () => {
    const storedVideos = localStorage.getItem('uploadedVideos');
    const currentUser = JSON.parse(localStorage.getItem('userProfile') || '{}');
    
    if (storedVideos) {
      try {
        const videoMetadata = JSON.parse(storedVideos);
        // Filter videos for current user
        window.uploadedVideos = videoMetadata.filter(video => video.userId === currentUser.uid);
        // All videos remain unfiltered
        window.allVideos = [...videoMetadata];
      } catch (error) {
        console.error('Error parsing stored videos:', error);
        window.allVideos = [];
        window.uploadedVideos = [];
      }
    } else {
      window.uploadedVideos = [];
    }
  };

  // Initialize with sample data if nothing in localStorage
  const initializeData = () => {
    loadUploadedVideos();
    
    // Only use sample data if no uploaded videos exist
    if (window.allVideos.length === 0) {
      window.allVideos = [...sampleVideos];
    }
    
    window.allShorts = [...sampleShorts];
    
    // Render videos and shorts
    renderVideos(window.allVideos);
    renderShorts(window.allShorts);
  };

  // Initialize data
  initializeData();

  // Add event listeners
  document.querySelector('.menu-icon').addEventListener('click', toggleSidebar);
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');

      // Filter content based on selected category
      filterContent(chip.textContent.trim());
    });
  });

  // Setup search functionality
  setupSearchFunctionality();

  // Add click events for sidebar items
  setupSidebarNavigation();

  // Setup upload functionality
  setupUploadFunctionality();
  
  // Setup user profile menu functionality
  setupUserProfileMenu();
});

// Function to render videos
function renderVideos(videos) {
  const videoGrid = document.querySelector('.video-grid');
  videoGrid.innerHTML = ''; // Clear current videos

  if (videos.length === 0) {
    videoGrid.innerHTML = `
      <div class="no-results">
        <i class="material-icons">search</i>
        <h3>No videos found</h3>
        <p>Try different keywords or remove search filters</p>
      </div>
    `;
    return;
  }

  videos.forEach(video => {
    const videoCard = document.createElement('div');
    videoCard.className = 'video-card';
    videoCard.innerHTML = `
      <div class="video-thumbnail">
        <img src="${video.thumbnail}" alt="${video.title}" class="thumbnail-img">
        <div class="video-preview-container">
          <video class="video-preview" muted loop preload="none">
            ${video.videoUrl ? `<source src="${video.videoUrl}" type="video/mp4">` : ''}
          </video>
        </div>
        <div class="video-duration">${video.duration || '0:00'}</div>
        <button class="more-button">
          <i class="material-icons">more_vert</i>
        </button>
      </div>
      <div class="video-info">
        <div class="channel-icon">
          <img src="${video.channelIcon}" alt="${video.channelName}">
        </div>
        <div class="video-details">
          <h3 class="video-title">${video.title}</h3>
          <p class="channel-name">${video.channelName}</p>
          <p class="video-meta">${video.views} • ${video.uploadedAgo}</p>
        </div>
      </div>
    `;

    // Add hover events for video preview
    const thumbnailContainer = videoCard.querySelector('.video-thumbnail');
    const videoPreview = videoCard.querySelector('.video-preview');
    
    thumbnailContainer.addEventListener('mouseenter', () => {
      if (video.videoUrl) {
        videoPreview.currentTime = 1; // Start a bit into the video
        videoPreview.play().catch(e => console.log('Preview autoplay prevented:', e));
        thumbnailContainer.classList.add('preview-active');
      }
    });
    
    thumbnailContainer.addEventListener('mouseleave', () => {
      if (video.videoUrl) {
        videoPreview.pause();
        videoPreview.currentTime = 0;
        thumbnailContainer.classList.remove('preview-active');
      }
    });

    videoCard.addEventListener('click', () => {
      playVideo(video);
    });

    videoGrid.appendChild(videoCard);
  });
}

// Function to render shorts
function renderShorts(shorts) {
  const shortsContainer = document.querySelector('.shorts-container');
  shortsContainer.innerHTML = ''; // Clear current shorts

  if (shorts.length === 0) {
    shortsContainer.innerHTML = '<p>No shorts available</p>';
    return;
  }

  shorts.forEach(short => {
    const shortCard = document.createElement('div');
    shortCard.className = 'short-card';
    shortCard.innerHTML = `
      <div class="short-thumbnail">
        <img src="${short.thumbnail}" alt="${short.title}">
      </div>
      <h3 class="short-title">${short.title}</h3>
      <p class="short-views">${short.views}</p>
    `;

    shortCard.addEventListener('click', () => {
      alert(`Playing Short: ${short.title}`);
    });

    shortsContainer.appendChild(shortCard);
  });
}

// Function to play a video
function playVideo(video) {
  // Add to watch history when playing
  addToHistory(video);
  
  // Generate recommended videos (subset of all videos excluding current)
  const recommendedVideos = window.allVideos
    .filter(v => v.id !== video.id)
    .slice(0, 8);

  // Create video player modal
  const videoPlayerModal = document.createElement('div');
  videoPlayerModal.className = 'video-player-modal';

  // Create modal content
  videoPlayerModal.innerHTML = `
    <div class="video-player-header">
      <button class="back-btn"><i class="material-icons">arrow_back</i></button>
      <h2>YouTube</h2>
      <div style="flex: 1;"></div>
      <button class="close-player"><i class="material-icons">close</i></button>
    </div>

    <div class="video-player-container">
      <div class="video-main">
        <div class="video-primary">
          <div class="video-player">
            <video controls class="video-element" ${video.videoUrl ? `src="${video.videoUrl}"` : ''}>
              Your browser does not support the video tag.
            </video>
          </div>

          <div class="video-player-info">
            <h1 class="video-title">${video.title}</h1>

            <div class="video-player-meta">
              <div class="video-meta-stats">
                ${video.views} • ${video.uploadedAgo}
              </div>
              <div class="video-meta-actions">
                <button class="video-action-button like-button ${isVideoLiked(video) ? 'liked' : ''}">
                  <i class="material-icons">thumb_up</i>
                  <span>Like</span>
                </button>
                <button class="video-action-button">
                  <i class="material-icons">thumb_down</i>
                  <span>Dislike</span>
                </button>
                <button class="video-action-button">
                  <i class="material-icons">share</i>
                  <span>Share</span>
                </button>
                <button class="video-action-button">
                  <i class="material-icons">download</i>
                  <span>Download</span>
                </button>
                <button class="video-action-button">
                  <i class="material-icons">more_horiz</i>
                </button>
              </div>
            </div>

            <div class="video-channel-info">
              <div class="channel-details">
                <img src="${video.channelIcon}" class="channel-avatar">
                <div class="channel-text">
                  <div class="channel-name">${video.channelName}</div>
                  <div class="channel-subscribers">12.5K subscribers</div>
                </div>
              </div>
              <button class="subscribe-button">Subscribe</button>
            </div>

            <div class="video-player-description">
              ${video.description || 'No description available.'}
            </div>
            <button class="description-expand">Show more</button>
          </div>
        </div>

        <div class="video-secondary">
          <div class="recommended-videos">
            ${recommendedVideos.map(rec => `
              <div class="recommended-video" data-id="${rec.id}">
                <div class="recommended-video-thumbnail">
                  <img src="${rec.thumbnail}" alt="${rec.title}">
                </div>
                <div class="recommended-video-info">
                  <div class="recommended-video-title">${rec.title}</div>
                  <div class="recommended-video-channel">${rec.channelName}</div>
                  <div class="recommended-video-stats">
                    <span>${rec.views}</span> • <span>${rec.uploadedAgo}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  // Add to body
  document.body.appendChild(videoPlayerModal);

  // Get DOM elements
  const videoElement = videoPlayerModal.querySelector('.video-element');
  const descriptionElement = videoPlayerModal.querySelector('.video-player-description');
  const descriptionExpandBtn = videoPlayerModal.querySelector('.description-expand');

  // Set up event listeners
  const closeButton = videoPlayerModal.querySelector('.close-player');
  closeButton.addEventListener('click', () => {
    videoPlayerModal.remove();
  });

  const backButton = videoPlayerModal.querySelector('.back-btn');
  backButton.addEventListener('click', () => {
    videoPlayerModal.remove();
  });

  // Description expand/collapse
  descriptionExpandBtn.addEventListener('click', () => {
    if (descriptionElement.classList.contains('expanded')) {
      descriptionElement.classList.remove('expanded');
      descriptionExpandBtn.textContent = 'Show more';
    } else {
      descriptionElement.classList.add('expanded');
      descriptionExpandBtn.textContent = 'Show less';
    }
  });

  // Subscribe button functionality
  const subscribeButton = videoPlayerModal.querySelector('.subscribe-button');
  subscribeButton.addEventListener('click', function() {
    if (this.classList.contains('subscribed')) {
      this.classList.remove('subscribed');
      this.textContent = 'Subscribe';
      // Store subscription state
      removeSubscribedChannel(video.channelName);
      showToast(`Unsubscribed from ${video.channelName}`);
    } else {
      this.classList.add('subscribed');
      this.textContent = 'Subscribed';
      // Store subscription state
      addSubscribedChannel(video.channelName);
      showToast(`Subscribed to ${video.channelName}`);
    }
  });

  // Check if already subscribed to this channel
  const isSubscribed = checkIfSubscribed(video.channelName);
  if (isSubscribed) {
    subscribeButton.classList.add('subscribed');
    subscribeButton.textContent = 'Subscribed';
  } else {
    subscribeButton.classList.remove('subscribed');
    subscribeButton.textContent = 'Subscribe';
  }

  // Play recommended videos
  videoPlayerModal.querySelectorAll('.recommended-video').forEach(recVideo => {
    recVideo.addEventListener('click', () => {
      const recVideoId = recVideo.dataset.id;
      const recommendedVideoData = window.allVideos.find(v => v.id === recVideoId);

      videoPlayerModal.remove();

      if (recommendedVideoData) {
        playVideo(recommendedVideoData);
      }
    });
  });

  // Add like button functionality
  const likeButton = videoPlayerModal.querySelector('.like-button');
  likeButton.addEventListener('click', () => {
    const isLiked = handleVideoLike(video);
    likeButton.classList.toggle('liked', isLiked);
  });
}

// Function to toggle sidebar
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');

  if (sidebar.style.width === '72px') {
    sidebar.style.width = '240px';
    mainContent.style.marginLeft = '240px';

    document.querySelectorAll('.sidebar-item span, .subscription-item span, .sidebar-section h3').forEach(el => {
      el.style.display = 'block';
    });

    document.querySelectorAll('.sidebar-item, .subscription-item').forEach(el => {
      el.style.justifyContent = 'flex-start';
      el.style.padding = '8px 24px';
    });

    document.querySelectorAll('.sidebar-item i, .subscription-item img').forEach(el => {
      el.style.marginRight = '24px';
    });
  } else {
    sidebar.style.width = '72px';
    mainContent.style.marginLeft = '72px';

    document.querySelectorAll('.sidebar-item span, .subscription-item span, .sidebar-section h3').forEach(el => {
      el.style.display = 'none';
    });

    document.querySelectorAll('.sidebar-item, .subscription-item').forEach(el => {
      el.style.justifyContent = 'center';
      el.style.padding = '12px 0';
    });

    document.querySelectorAll('.sidebar-item i, .subscription-item img').forEach(el => {
      el.style.marginRight = '0';
    });
  }
}

// Filter content based on category
function filterContent(category) {
  if (category === 'All') {
    renderVideos(window.allVideos);
    return;
  }

  const filteredVideos = window.allVideos.filter(video => 
    video.category === category
  );
  
  renderVideos(filteredVideos);
}

// Setup search functionality
function setupSearchFunctionality() {
  const searchInput = document.querySelector('.search-bar input');
  const searchButton = document.querySelector('.search-button');
  const voiceSearchButton = document.querySelector('.voice-search-button');

  // Create suggestions container
  const suggestionsContainer = document.createElement('div');
  suggestionsContainer.className = 'search-suggestions';
  searchInput.parentElement.appendChild(suggestionsContainer);

  // Handle input changes for suggestions
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    if (query.length > 0) {
      const suggestions = generateSuggestions(query);
      showSuggestions(suggestions, query);
    } else {
      hideSuggestions();
    }
  });

  // Hide suggestions on click outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-bar')) {
      hideSuggestions();
    }
  });

  // Existing search button click handler
  searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim().toLowerCase();
    if (query) {
      performSearch(query);
    }
  });

  // Existing search input enter key handler
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const query = searchInput.value.trim().toLowerCase();
      if (query) {
        performSearch(query);
      }
    }
  });

  // Add voice search functionality
  voiceSearchButton.addEventListener('click', async () => {
    try {
      // Request microphone permission first
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Check if browser supports speech recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        // Show listening indicator
        showToast('Listening...');
        voiceSearchButton.classList.add('listening');
        voiceSearchButton.querySelector('i').textContent = 'mic';

        recognition.start();

        recognition.onresult = (event) => {
          const voiceText = event.results[0][0].transcript;
          searchInput.value = voiceText;
          performSearch(voiceText.toLowerCase());
          voiceSearchButton.classList.remove('listening');
          voiceSearchButton.querySelector('i').textContent = 'mic';
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          showToast('Voice search failed. Please try again.');
          voiceSearchButton.classList.remove('listening');
          voiceSearchButton.querySelector('i').textContent = 'mic';
        };

        recognition.onend = () => {
          voiceSearchButton.classList.remove('listening');
          voiceSearchButton.querySelector('i').textContent = 'mic';
        };
      } else {
        showToast('Voice search is not supported in your browser');
      }
    } catch (err) {
      console.error('Microphone permission error:', err);
      showToast('Please allow microphone access to use voice search');
    }
  });

  function generateSuggestions(query) {
    const allTerms = window.allVideos.reduce((terms, video) => {
      terms.push(video.title, video.channelName);
      if (video.description) terms.push(video.description);
      return terms;
    }, []);

    return [...new Set(allTerms)]
      .filter(term => term.toLowerCase().includes(query))
      .slice(0, 6);
  }

  function showSuggestions(suggestions, query) {
    if (suggestions.length === 0) {
      hideSuggestions();
      return;
    }

    suggestionsContainer.innerHTML = suggestions
      .map(suggestion => `
        <div class="suggestion-item">
          <i class="material-icons">search</i>
          <span>${highlightMatch(suggestion, query)}</span>
        </div>
      `)
      .join('');

    suggestionsContainer.style.display = 'block';

    // Add click handlers for suggestions
    suggestionsContainer.querySelectorAll('.suggestion-item').forEach((item, index) => {
      item.addEventListener('click', () => {
        searchInput.value = suggestions[index];
        performSearch(suggestions[index].toLowerCase());
        hideSuggestions();
      });
    });
  }

  function hideSuggestions() {
    suggestionsContainer.style.display = 'none';
  }

  function highlightMatch(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
  }
}

// Perform search
function performSearch(query) {
  const filteredVideos = window.allVideos.filter(video => 
    video.title.toLowerCase().includes(query) || 
    video.description?.toLowerCase().includes(query) ||
    video.channelName.toLowerCase().includes(query)
  );
  
  renderVideos(filteredVideos);
}

// Setup navigation for sidebar items
function setupSidebarNavigation() {
  // Home button (already active)
  document.querySelector('.sidebar-item.active').addEventListener('click', () => {
    window.location.href = 'yt.html';  // Redirect to yt.html
  });

  // Add event listeners to sidebar items
  document.querySelectorAll('.sidebar-item').forEach(item => {
    if (!item.classList.contains('active')) {
      item.addEventListener('click', () => {
        const itemText = item.querySelector('span')?.textContent;
        if (itemText) {
          switch (itemText) {
            case 'Shorts':
              showShortsContent();
              break;
            case 'Subscriptions':
              showSubscriptionsContent();
              break;
            case 'History':
              showHistoryContent();
              break;
            case 'Playlists':
              showPlaylistsContent();
              break;
            case 'Live Stream':
              showLiveContent();
              break;
            case 'Liked videos':
              showLikedVideosContent();
              break;
            case 'Trending':
              showTrendingContent();
              break;
            case 'Music':
              showMusicContent();
              break;
            case 'Gaming':
              showGamingContent();
              break;
          }
        }
        updateActiveState(item);
      });
    }
  });

  // Add event listeners to subscription items
  document.querySelectorAll('.subscription-item').forEach(item => {
    item.addEventListener('click', () => {
      const channelName = item.querySelector('span')?.textContent;
      if (channelName) {
        showChannelContent(channelName);
      }
    });
  });
}

// Update active state in sidebar
function updateActiveState(element) {
  document.querySelectorAll('.sidebar-item').forEach(item => {
    item.classList.remove('active');
  });
  element.classList.add('active');
}

// Show home content
function showHomeContent() {
  renderVideos(window.allVideos);
}

// Show shorts content
function showShortsContent() {
  const mainContent = document.querySelector('.main-content');
  
  mainContent.innerHTML = `
    <div class="shorts-focused">
      <h2>Shorts</h2>
      <div class="shorts-grid">
        ${window.allShorts.map(short => `
          <div class="short-card">
            <div class="short-thumbnail">
              <img src="${short.thumbnail}" alt="${short.title}">
            </div>
            <h3 class="short-title">${short.title}</h3>
            <p class="short-views">${short.views}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Show subscriptions content
function showSubscriptionsContent() {
  const subscribedChannels = getSubscribedChannels();
  
  if (subscribedChannels.length === 0) {
    showEmptyState(
      'No subscriptions yet', 
      'Subscribe to channels to see the latest videos in your feed', 
      'Browse videos',
      () => {
        showHomeContent();
      }
    );
    return;
  }
  
  // Get all videos from subscribed channels
  const subscriptionVideos = window.allVideos.filter(video => 
    subscribedChannels.includes(video.channelName)
  );
  
  // Group videos by channel name
  const videosByChannel = {};
  subscribedChannels.forEach(channel => {
    videosByChannel[channel] = subscriptionVideos.filter(video => 
      video.channelName === channel
    );
  });
  
  const mainContent = document.querySelector('.main-content');
  
  // Create the subscriptions content with channel sections
  let subscriptionsHTML = `
    <div class="custom-content subscriptions-page">
      <div class="subscriptions-header">
        <h2>Subscriptions</h2>
        <div class="subscriptions-info">
          <span>${subscribedChannels.length} channel${subscribedChannels.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
      
      <!-- Channels grid -->
      <div class="channel-grid">
        ${subscribedChannels.map(channel => {
          const channelVideo = videosByChannel[channel][0] || {};
          return `
            <div class="channel-card" data-channel="${channel}" onclick="showChannelContent('${channel}')">
              <div class="channel-avatar">
                <img src="${channelVideo.channelIcon || 'https://picsum.photos/64/64?random=' + Math.floor(Math.random() * 1000)}" alt="${channel}">
              </div>
              <div class="channel-info">
                <h3>${channel}</h3>
                <p>${videosByChannel[channel].length} video${videosByChannel[channel].length !== 1 ? 's' : ''}</p>
              </div>
            </div>
          `;
        }).join('')}
      </div>
      
      <h3 class="section-title">Latest videos from your subscriptions</h3>
      
      <!-- Videos grid -->
      <div class="video-grid">
        ${subscriptionVideos
          .sort((a, b) => {
            // Sort by newest first (this is mock sorting based on uploadedAgo)
            const timeA = a.uploadedAgo;
            const timeB = b.uploadedAgo;
            return timeA.localeCompare(timeB);
          })
          .map(video => `
            <div class="video-card" data-id="${video.id}">
              <div class="video-thumbnail">
                <img src="${video.thumbnail}" alt="${video.title}">
                <div class="video-duration">${video.duration}</div>
                <div class="video-preview-overlay">
                  <i class="material-icons">play_arrow</i>
                </div>
              </div>
              <div class="video-info">
                <div class="channel-icon">
                  <img src="${video.channelIcon}" alt="${video.channelName}">
                </div>
                <div class="video-details">
                  <h3 class="video-title">${video.title}</h3>
                  <p class="channel-name">${video.channelName}</p>
                  <p class="video-meta">${video.views} • ${video.uploadedAgo}</p>
                </div>
              </div>
            </div>
          `).join('')}
      </div>
    </div>
  `;
  
  mainContent.innerHTML = subscriptionsHTML;
  
  // Add event listeners to video cards
  document.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('click', () => {
      const videoId = card.dataset.id;
      const video = window.allVideos.find(v => v.id === videoId);
      if (video) {
        playVideo(video);
      }
    });
  });
}

// Show history content
function showHistoryContent() {
  const history = JSON.parse(localStorage.getItem('watchHistory') || '[]');
  
  if (history.length === 0) {
    showEmptyState('Keep track of what you watch', 'Watch history isn\'t viewable when signed out', 'Browse videos');
    return;
  }
  
  const mainContent = document.querySelector('.main-content');
  mainContent.innerHTML = `
    <div class="custom-content">
      <h2>Watch History</h2>
      <div class="video-grid">
        ${history.map(video => `
          <div class="video-card" data-id="${video.id}">
            <div class="video-thumbnail">
              <img src="${video.thumbnail}" alt="${video.title}">
              <div class="video-duration">${video.duration}</div>
            </div>
            <div class="video-info">
              <div class="channel-icon">
                <img src="${video.channelIcon}" alt="${video.channelName}">
              </div>
              <div class="video-details">
                <h3 class="video-title">${video.title}</h3>
                <p class="channel-name">${video.channelName}</p>
                <p class="video-meta">${video.views} • ${video.uploadedAgo}</p>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  // Add event listeners to video cards
  document.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('click', () => {
      const videoId = card.dataset.id;
      const video = history.find(v => v.id === videoId);
      if (video) {
        playVideo(video);
      }
    });
  });
}

// Show playlists content
function showPlaylistsContent() {
  showEmptyState('No playlists yet', 'Create playlists to organize your videos', 'Create Playlist');
}

// Show watch later content
function showLiveContent() {
  showEmptyState('No saved videos', 'Videos that you save will show up here', 'Browse videos');
}

// Show liked videos content
function showLikedVideosContent() {
  const likedVideos = JSON.parse(localStorage.getItem('likedVideos') || '[]');
  
  if (likedVideos.length === 0) {
    showEmptyState('No liked videos', 'Videos that you like will show up here', 'Browse videos');
    return;
  }
  
  const mainContent = document.querySelector('.main-content');
  mainContent.innerHTML = `
    <div class="custom-content">
      <h2>Liked Videos</h2>
      <div class="video-grid">
        ${likedVideos.map(video => `
          <div class="video-card" data-id="${video.id}">
            <div class="video-thumbnail">
              <img src="${video.thumbnail}" alt="${video.title}">
              <div class="video-duration">${video.duration}</div>
            </div>
            <div class="video-info">
              <div class="channel-icon">
                <img src="${video.channelIcon}" alt="${video.channelName}">
              </div>
              <div class="video-details">
                <h3 class="video-title">${video.title}</h3>
                <p class="channel-name">${video.channelName}</p>
                <p class="video-meta">${video.views} • ${video.uploadedAgo}</p>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  // Add event listeners to video cards
  document.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('click', () => {
      const videoId = card.dataset.id;
      const video = likedVideos.find(v => v.id === videoId);
      if (video) {
        playVideo(video);
      }
    });
  });
}

// Show channel content
function showChannelContent(channelName) {
  // Find user ID associated with channel name
  const channelVideos = window.allVideos.filter(video => video.channelName === channelName);
  const channelUserId = channelVideos[0]?.userId;
  
  // Filter videos for this channel's user
  const userChannelVideos = channelUserId ? 
    window.allVideos.filter(video => video.userId === channelUserId) : 
    channelVideos;
  
  if (userChannelVideos.length === 0) {
    showEmptyState('No videos from this channel', 'This channel hasn\'t uploaded any videos yet', 'Browse videos');
    return;
  }
  
  const channelIcon = userChannelVideos[0].channelIcon;
  const isSubscribed = checkIfSubscribed(channelName);
  
  const mainContent = document.querySelector('.main-content');
  mainContent.innerHTML = `
    <div class="custom-content">
      <div class="channel-header">
        <img src="${channelIcon}" class="channel-avatar">
        <div class="channel-info">
          <h2>${channelName}</h2>
          <p>12.5K subscribers</p>
        </div>
        <button class="subscribe-button ${isSubscribed ? 'subscribed' : ''}">${isSubscribed ? 'Subscribed' : 'Subscribe'}</button>
      </div>
      
      <div class="channel-tabs">
        <button class="channel-tab active">Videos</button>
        <button class="channel-tab">Playlists</button>
        <button class="channel-tab">Community</button>
        <button class="channel-tab">Channels</button>
        <button class="channel-tab">About</button>
      </div>
      
      <div class="video-grid">
        ${userChannelVideos.map(video => `
          <div class="video-card" data-id="${video.id}">
            <div class="video-thumbnail">
              <img src="${video.thumbnail}" alt="${video.title}">
              <div class="video-duration">${video.duration}</div>
            </div>
            <div class="video-info">
              <div class="video-details" style="padding-left: 0;">
                <h3 class="video-title">${video.title}</h3>
                <p class="video-meta">${video.views} • ${video.uploadedAgo}</p>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  // Add event listeners to video cards
  document.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('click', () => {
      const videoId = card.dataset.id;
      const video = window.allVideos.find(v => v.id === videoId);
      if (video) {
        playVideo(video);
      }
    });
  });
  
  // Add event listener to subscribe button
  const subscribeButton = document.querySelector('.subscribe-button');
  subscribeButton.addEventListener('click', function() {
    if (this.classList.contains('subscribed')) {
      this.classList.remove('subscribed');
      this.textContent = 'Subscribe';
      removeSubscribedChannel(channelName);
      showToast(`Unsubscribed from ${channelName}`);
    } else {
      this.classList.add('subscribed');
      this.textContent = 'Subscribed';
      addSubscribedChannel(channelName);
      showToast(`Subscribed to ${channelName}`);
    }
  });
}

// Show trending content
function showTrendingContent() {
  const mainContent = document.querySelector('.main-content');
  mainContent.innerHTML = `
    <div class="custom-content">
      <h2>Trending</h2>
      
      <div class="trending-tabs">
        <button class="trending-tab active">Now</button>
        <button class="trending-tab">Music</button>
        <button class="trending-tab">Gaming</button>
        <button class="trending-tab">Movies</button>
      </div>
      
      <div class="video-grid">
        ${window.allVideos
          .sort((a, b) => {
            const viewsA = parseInt(a.views.replace(/[^0-9]/g, ''));
            const viewsB = parseInt(b.views.replace(/[^0-9]/g, ''));
            return viewsB - viewsA;
          })
          .slice(0, 10)
          .map(video => `
            <div class="video-card" data-id="${video.id}">
              <div class="video-thumbnail">
                <img src="${video.thumbnail}" alt="${video.title}">
                <div class="video-duration">${video.duration}</div>
              </div>
              <div class="video-info">
                <div class="channel-icon">
                  <img src="${video.channelIcon}" alt="${video.channelName}">
                </div>
                <div class="video-details">
                  <h3 class="video-title">${video.title}</h3>
                  <p class="channel-name">${video.channelName}</p>
                  <p class="video-meta">${video.views} • ${video.uploadedAgo}</p>
                </div>
              </div>
            </div>
          `).join('')}
      </div>
    </div>
  `;
  
  // Add event listeners to video cards
  document.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('click', () => {
      const videoId = card.dataset.id;
      const video = window.allVideos.find(v => v.id === videoId);
      if (video) {
        playVideo(video);
      }
    });
  });
}

// Show music content
function showMusicContent() {
  const musicVideos = window.allVideos.filter(video => video.category === 'Music');
  
  const mainContent = document.querySelector('.main-content');
  mainContent.innerHTML = `
    <div class="custom-content">
      <h2>Music</h2>
      
      <div class="music-categories">
        <div class="music-category">
          <h3>Top Music Videos</h3>
          <ul>
            ${musicVideos.slice(0, 3).map(video => `
              <li>
                <a href="#" data-id="${video.id}">${video.title} - ${video.channelName}</a>
              </li>
            `).join('')}
          </ul>
        </div>
        <div class="music-category">
          <h3>Recommended Artists</h3>
          <ul>
            <li>Ed Sheeran</li>
            <li>Taylor Swift</li>
            <li>Ariana Grande</li>
          </ul>
        </div>
      </div>
      
      <h3 style="margin: 24px 0 16px;">Top Music Videos</h3>
      <div class="video-grid">
        ${musicVideos.map(video => `
          <div class="video-card" data-id="${video.id}">
            <div class="video-thumbnail">
              <img src="${video.thumbnail}" alt="${video.title}">
              <div class="video-duration">${video.duration}</div>
            </div>
            <div class="video-info">
              <div class="channel-icon">
                <img src="${video.channelIcon}" alt="${video.channelName}">
              </div>
              <div class="video-details">
                <h3 class="video-title">${video.title}</h3>
                <p class="channel-name">${video.channelName}</p>
                <p class="video-meta">${video.views} • ${video.uploadedAgo}</p>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  // Add event listeners to video cards
  document.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('click', () => {
      const videoId = card.dataset.id;
      const video = window.allVideos.find(v => v.id === videoId);
      if (video) {
        playVideo(video);
      }
    });
  });
}

// Show gaming content
function showGamingContent() {
  const gamingVideos = window.allVideos.filter(video => video.category === 'Gaming');
  
  const mainContent = document.querySelector('.main-content');
  mainContent.innerHTML = `
    <div class="custom-content">
      <h2>Gaming</h2>
      
      <div class="gaming-categories">
        <div class="gaming-category">
          <h3>Top Games</h3>
          <ul>
            <li>Minecraft</li>
            <li>Fortnite</li>
            <li>Among Us</li>
          </ul>
        </div>
        <div class="gaming-category">
          <h3>Top Creators</h3>
          <ul>
            <li>PewDiePie</li>
            <li>Markiplier</li>
            <li>Ninja</li>
          </ul>
        </div>
      </div>
      
      <h3 style="margin: 24px 0 16px;">Top Gaming Videos</h3>
      <div class="video-grid">
        ${gamingVideos.map(video => `
          <div class="video-card" data-id="${video.id}">
            <div class="video-thumbnail">
              <img src="${video.thumbnail}" alt="${video.title}">
              <div class="video-duration">${video.duration}</div>
            </div>
            <div class="video-info">
              <div class="channel-icon">
                <img src="${video.channelIcon}" alt="${video.channelName}">
              </div>
              <div class="video-details">
                <h3 class="video-title">${video.title}</h3>
                <p class="channel-name">${video.channelName}</p>
                <p class="video-meta">${video.views} • ${video.uploadedAgo}</p>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  // Add event listeners to video cards
  document.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('click', () => {
      const videoId = card.dataset.id;
      const video = window.allVideos.find(v => v.id === videoId);
      if (video) {
        playVideo(video);
      }
    });
  });
}

// Show empty state
function showEmptyState(title, message, buttonText, callback) {
  const mainContent = document.querySelector('.main-content');
  mainContent.innerHTML = `
    <div class="custom-content">
      <div class="empty-state">
        <i class="material-icons">videocam_off</i>
        <h2>${title}</h2>
        <p>${message}</p>
        <button class="browse-button">${buttonText}</button>
      </div>
    </div>
  `;
  
  // Add event listener to browse button
  document.querySelector('.browse-button').addEventListener('click', () => {
    if (callback && typeof callback === 'function') {
      callback();
    } else {
      showHomeContent();
      updateActiveState(document.querySelector('.sidebar-item.active'));
    }
  });
}

// Setup upload functionality
function setupUploadFunctionality() {
  const modal = document.getElementById('uploadModal');
  const createBtn = document.querySelector('.create-btn');
  const closeBtn = document.querySelector('.close');
  const cancelBtn = document.querySelector('.cancel-btn');
  const form = document.getElementById('videoUploadForm');
  const videoFileInput = document.getElementById('videoFile');
  const thumbnailInput = document.getElementById('videoThumbnail');
  const videoPreview = document.getElementById('videoPreview');
  const thumbnailPreview = document.getElementById('thumbnailPreview');
  const progressContainer = document.querySelector('.progress-container');
  const progressBar = document.getElementById('uploadProgress');
  const progressText = document.querySelector('.progress-text');
  
  // Show modal on create button click
  createBtn.addEventListener('click', () => {
    modal.style.display = 'block';
  });
  
  // Close modal
  function closeModal() {
    modal.style.display = 'none';
    form.reset();
    videoPreview.style.display = 'none';
    thumbnailPreview.style.display = 'none';
    progressContainer.style.display = 'none';
    progressBar.style.width = '0%';
    progressText.textContent = '0%';
  }
  
  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  
  // When clicking outside the modal
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  // Show video preview
  videoFileInput.addEventListener('change', () => {
    if (videoFileInput.files && videoFileInput.files[0]) {
      const file = videoFileInput.files[0];
      
      videoPreview.src = URL.createObjectURL(file);
      videoPreview.style.display = 'block';
    }
  });
  
  // Show thumbnail preview
  thumbnailInput.addEventListener('change', () => {
    if (thumbnailInput.files && thumbnailInput.files[0]) {
      const file = thumbnailInput.files[0];
      
      thumbnailPreview.src = URL.createObjectURL(file);
      thumbnailPreview.style.display = 'block';
    }
  });
  
  // Handle form submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const titleInput = document.getElementById('videoTitle');
    const descInput = document.getElementById('videoDescription');
    const categoryInput = document.getElementById('videoCategory');
    
    // Validate form
    if (!titleInput.value.trim()) {
      alert('Please enter a video title');
      return;
    }
    
    if (!videoFileInput.files[0]) {
      alert('Please select a video file');
      return;
    }
    
    // Show progress bar
    progressContainer.style.display = 'block';
    
    try {
      // Upload to Cloudinary
      await uploadVideo(
        videoFileInput.files[0],
        thumbnailInput.files[0],
        titleInput.value,
        descInput.value,
        categoryInput.value
      );
      
      closeModal();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + error.message);
      progressContainer.style.display = 'none';
    }
  });
}

// Upload video to Cloudinary
async function uploadVideo(videoFile, thumbnailFile, title, description, category) {
  const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  
  // Check if user is logged in
  // if (!userProfile.uid) {
  //   showToast('Please sign in to upload videos');
  //   throw new Error('User not authenticated');
  // }

  const progressContainer = document.querySelector('.progress-container');
  const progressBar = document.getElementById('uploadProgress');
  const progressText = document.querySelector('.progress-text');
  
  try {
    // Show initial progress
    progressContainer.style.display = 'block';
    progressBar.style.width = '10%';
    progressText.textContent = '10%';

    // Upload video to Cloudinary with proper error handling
    const videoFormData = new FormData();
    videoFormData.append('file', videoFile);
    videoFormData.append('upload_preset', 'my_upload_preset');
    videoFormData.append('resource_type', 'video');

    // Upload video
    const videoResponse = await fetch('https://api.cloudinary.com/v1_1/dra4ykviv/video/upload', {
      method: 'POST',
      body: videoFormData
    });

    if (!videoResponse.ok) {
      throw new Error('Video upload failed');
    }

    const videoData = await videoResponse.json();
    progressBar.style.width = '60%';
    progressText.textContent = '60%';

    // Upload thumbnail or create one from video
    let thumbnailUrl;
    if (thumbnailFile) {
      const thumbnailFormData = new FormData();
      thumbnailFormData.append('file', thumbnailFile);
      thumbnailFormData.append('upload_preset', 'my_upload_preset');

      const thumbnailResponse = await fetch('https://api.cloudinary.com/v1_1/dra4ykviv/image/upload', {
        method: 'POST',
        body: thumbnailFormData
      });

      if (!thumbnailResponse.ok) {
        throw new Error('Thumbnail upload failed');
      }

      const thumbnailData = await thumbnailResponse.json();
      thumbnailUrl = thumbnailData.secure_url;
    } else {
      // Use Cloudinary's video thumbnail if no thumbnail provided
      thumbnailUrl = videoData.secure_url.replace('/upload/', '/upload/w_320,h_180,c_fill,g_auto/').replace(/\.[^/.]+$/, ".jpg");
    }

    progressBar.style.width = '90%';
    progressText.textContent = '90%';

    // Create new video object
    const newVideo = {
      id: 'v' + Date.now(),
      title,
      description,
      channelName: userProfile.displayName || 'Anonymous User',
      channelIcon: userProfile.photoURL || 'https://picsum.photos/36/36?random=' + Math.floor(Math.random() * 100),
      views: '0 views',
      uploadedAgo: 'Just now',
      duration: await getVideoDuration(videoFile),
      thumbnail: thumbnailUrl,
      videoUrl: videoData.secure_url,
      category,
      userId: userProfile.uid
    };

    // Update arrays and storage
    window.allVideos.unshift(newVideo);
    window.uploadedVideos.unshift(newVideo);
    saveVideoToLocalStorage(newVideo);

    // Complete progress
    progressBar.style.width = '100%';
    progressText.textContent = '100%';

    showToast('Video uploaded successfully!');
    return newVideo;

  } catch (error) {
    console.error('Upload error:', error);
    showToast('Upload failed: ' + error.message);
    throw error;
  }
}

// Add helper function to get video duration
function getVideoDuration(videoFile) {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      const duration = Math.round(video.duration);
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      resolve(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };
    video.src = URL.createObjectURL(videoFile);
  });
}

// Modify the save to storage function
function saveVideoToLocalStorage(video) {
  const storedVideos = JSON.parse(localStorage.getItem('uploadedVideos') || '[]');
  storedVideos.unshift(video);
  
  try {
    localStorage.setItem('uploadedVideos', JSON.stringify(storedVideos));
    window.uploadedVideos = storedVideos.filter(v => v.userId === video.userId);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    // If localStorage is full, remove oldest videos
    while (storedVideos.length > 0) {
      storedVideos.pop();
      try {
        localStorage.setItem('uploadedVideos', JSON.stringify(storedVideos));
        break;
      } catch (e) {
        continue;
      }
    }
  }
}

// From script.js
fetch('videos.json')
  .then(response => response.json())
  .then(data => {
    window.allVideos = [...window.allVideos, ...data];
    renderVideos(window.allVideos);
  })

// Upload file to Cloudinary
async function uploadToCloudinary(file, uploadPreset) {
  const url = `https://api.cloudinary.com/v1_1/dra4ykviv/upload`;
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
}

// Format video duration
function formatVideoDuration(videoFile) {
  // For now, return a placeholder duration
  // In a real application, you would get the actual duration from the video file
  return '0:30';
}

// Save video to local storage
function saveVideoToLocalStorage(video) {
  const storedVideos = JSON.parse(localStorage.getItem('uploadedVideos') || '[]');
  storedVideos.unshift(video);
  localStorage.setItem('uploadedVideos', JSON.stringify(storedVideos));
  
  // Update uploaded videos array
  window.uploadedVideos = storedVideos;
}

// Setup user profile menu
function setupUserProfileMenu() {
  const userProfileBtn = document.querySelector('.user-profile');
  
  console.log('Setting up user profile menu, button found:', userProfileBtn);
  
  if (!userProfileBtn) {
    console.error('User profile button not found');
    return;
  }
  
  // Direct profile click to user dashboard
  userProfileBtn.addEventListener('click', (e) => {
    console.log('Profile button clicked!');
    e.stopPropagation();
    showUserDashboard();
  });
}

// Show user channel page
function showUserChannelPage() {
  const mainContent = document.querySelector('.main-content');
  const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  
  // Filter videos for this user
  const userVideos = window.allVideos.filter(video => video.userId === userProfile.uid);
  
  const subscribersCount = Math.floor(Math.random() * 100) + 'K';
  const joinedDate = 'Joined ' + new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  mainContent.innerHTML = `
    <div class="custom-content">
      <div class="channel-header">
        <img src="https://picsum.photos/80/80?random=100" class="channel-avatar">
        <div class="channel-info">
          <h2>Your Channel</h2>
          <p>${subscribersCount} subscribers • ${joinedDate}</p>
        </div>
        <button class="browse-button">Customize Channel</button>
      </div>
      
      <div class="channel-tabs">
        <button class="channel-tab active">Home</button>
        <button class="channel-tab">Videos</button>
        <button class="channel-tab">Shorts</button>
        <button class="channel-tab">Live</button>
        <button class="channel-tab">Playlists</button>
        <button class="channel-tab">Community</button>
        <button class="channel-tab">Channels</button>
        <button class="channel-tab">About</button>
      </div>
      
      <div class="video-grid">
        ${userVideos.length === 0 ? 
          `<div class="no-results">
            <i class="material-icons">videocam_off</i>
            <h3>No videos uploaded yet</h3>
            <p>Your uploaded videos will appear here</p>
          </div>` 
          : 
          userVideos.map(video => `
            <div class="video-card" data-id="${video.id}">
              <div class="video-thumbnail">
                <img src="${video.thumbnail}" alt="${video.title}">
                <div class="video-duration">${video.duration}</div>
              </div>
              <div class="video-info">
                <div class="video-details" style="padding-left: 0;">
                  <h3 class="video-title">${video.title}</h3>
                  <p class="video-meta">${video.views} • ${video.uploadedAgo}</p>
                </div>
              </div>
            </div>
          `).join('')
        }
      </div>
    </div>
  `;
  
  // Add event listeners to video cards
  document.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('click', () => {
      const videoId = card.dataset.id;
      const video = window.allVideos.find(v => v.id === videoId);
      if (video) {
        playVideo(video);
      }
    });
  });
}

// Show user dashboard with uploaded videos and statistics
function showUserDashboard() {
  console.log('showUserDashboard function called');
  const mainContent = document.querySelector('.main-content');
  
  // Get user profile from localStorage
  const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  const username = userProfile.username || 'User';
  const displayName = userProfile.displayName || 'Your Channel';
  // Use the stored profile picture or fallback to default
  const profilePic = userProfile.photoURL || '/default-profile.png';
  
  // Update header profile picture
  const headerProfileImg = document.querySelector('.user-profile img');
  if (headerProfileImg) {
    headerProfileImg.src = profilePic;
  }

  // Filter videos for current user
  const userVideos = window.allVideos.filter(video => video.userId === userProfile.uid);

  // Calculate stats for user's videos only
  const totalViews = userVideos.reduce((sum, video) => {
    const viewsText = video.views.replace(/K views|M views|views/g, '').trim();
    let viewCount = parseFloat(viewsText);
    if (viewsText.includes('K')) viewCount *= 1000;
    if (viewsText.includes('M')) viewCount *= 1000000;
    return sum + (isNaN(viewCount) ? 0 : viewCount);
  }, 0);

  mainContent.innerHTML = `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <div class="user-banner">
          <div class="user-info">
            <img src="${profilePic}" class="user-avatar" alt="${displayName}'s profile">
            <div class="user-details">
              <h1>${displayName}</h1>
              <p>@${username}</p>
            </div>
          </div>
          <div class="user-stats">
            <div class="stat">
              <span class="stat-value">${userVideos.length}</span>
              <span class="stat-label">Videos</span>
            </div>
            <div class="stat">
              <span class="stat-value">${totalViews}</span>
              <span class="stat-label">Views</span>
            </div>
            <div class="stat">
              <span class="stat-value">${Math.floor(Math.random() * 1000) + 100}</span>
              <span class="stat-label">Subscribers</span>
            </div>
          </div>
        </div>
        
        <div class="dashboard-tabs">
          <button class="dashboard-tab active">Dashboard</button>
          <button class="dashboard-tab">Content</button>
          <button class="dashboard-tab">Analytics</button>
          <button class="dashboard-tab">Comments</button>
          <button class="dashboard-tab">Customization</button>
        </div>
      </div>
      
      <div class="dashboard-content">
        <div class="dashboard-section">
          <div class="section-header">
            <h2>Your Videos</h2>
            <button class="upload-video-btn browse-button">Upload Video</button>
          </div>
          
          ${userVideos.length === 0 ? 
            `<div class="no-results">
              <i class="material-icons">videocam_off</i>
              <h3>No videos uploaded yet</h3>
              <p>Your uploaded videos will appear here</p>
              <button class="browse-button create-btn">Upload Video</button>
            </div>` 
            : 
            `<div class="video-grid dashboard-videos">
              ${userVideos.map(video => `
                <div class="video-card" data-id="${video.id}">
                  <div class="video-thumbnail">
                    <img src="${video.thumbnail}" alt="${video.title}">
                    <div class="video-duration">${video.duration}</div>
                  </div>
                  <div class="video-info">
                    <div class="video-details" style="padding-left: 0;">
                      <h3 class="video-title">${video.title}</h3>
                      <p class="video-meta">${video.views} • ${video.uploadedAgo}</p>
                      <div class="video-actions">
                        <button class="video-action" title="Edit"><i class="material-icons">edit</i></button>
                        <button class="video-action" title="Analytics"><i class="material-icons">analytics</i></button>
                        <button class="video-action" title="Comments"><i class="material-icons">comment</i></button>
                        <button class="video-action delete-btn" title="Delete" onclick="deleteVideo('${video.id}')">
                          <i class="material-icons">delete</i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>`
          }
        </div>
      </div>
    </div>
  `;
  
  // Add event listeners to video cards
  document.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't play video if clicked on action buttons
      if (e.target.closest('.video-actions')) {
        return;
      }
      
      const videoId = card.dataset.id;
      const video = window.allVideos.find(v => v.id === videoId);
      if (video) {
        playVideo(video);
      }
    });
  });
  
  // Add event listener to create/upload buttons
  const uploadBtns = mainContent.querySelectorAll('.create-btn, .upload-video-btn');
  uploadBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('.create-btn').click();
    });
  });
  
  // Highlight active tab - the dashboard tab is active by default
  const dashboardTabs = mainContent.querySelectorAll('.dashboard-tab');
  dashboardTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      dashboardTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      // We're not implementing other tabs in this version
      showToast('This feature is coming soon!');
    });
  });
}

// Subscription functions
function addSubscribedChannel(channelName) {
  const subscribedChannels = getSubscribedChannels();
  if (!subscribedChannels.includes(channelName)) {
    subscribedChannels.push(channelName);
    localStorage.setItem('subscribedChannels', JSON.stringify(subscribedChannels));
    updateSidebarSubscriptions();
  }
}

function removeSubscribedChannel(channelName) {
  let subscribedChannels = getSubscribedChannels();
  subscribedChannels = subscribedChannels.filter(channel => channel !== channelName);
  localStorage.setItem('subscribedChannels', JSON.stringify(subscribedChannels));
  updateSidebarSubscriptions();
}

// Update the sidebar with current subscriptions
function updateSidebarSubscriptions() {
  const subscriptionsContainer = document.getElementById('sidebar-subscriptions-container');
  const subscribedChannels = getSubscribedChannels();
  
  // Clear current content
  subscriptionsContainer.innerHTML = '';
  
  // If no subscriptions, show a message
  if (subscribedChannels.length === 0) {
    subscriptionsContainer.innerHTML = `
      <div class="no-subscriptions-message">
        <p>No channels yet</p>
      </div>
    `;
    return;
  }
  
  // Add subscribed channels to sidebar
  subscribedChannels.forEach(channelName => {
    // Find video object with this channel to get the icon
    const channelVideo = window.allVideos.find(video => video.channelName === channelName);
    const channelIcon = channelVideo ? channelVideo.channelIcon : 'https://picsum.photos/32/32?random=' + Math.floor(Math.random() * 1000);
    
    const subscriptionItem = document.createElement('div');
    subscriptionItem.className = 'subscription-item';
    subscriptionItem.innerHTML = `
      <img src="${channelIcon}" alt="${channelName}">
      <span>${channelName}</span>
    `;
    
    subscriptionItem.addEventListener('click', () => {
      showChannelContent(channelName);
    });
    
    subscriptionsContainer.appendChild(subscriptionItem);
  });
}

function checkIfSubscribed(channelName) {
  const subscribedChannels = getSubscribedChannels();
  return subscribedChannels.includes(channelName);
}

function getSubscribedChannels() {
  try {
    return JSON.parse(localStorage.getItem('subscribedChannels') || '[]');
  } catch (error) {
    console.error('Error getting subscribed channels:', error);
    return [];
  }
}

// Toast notification
function showToast(message) {
  // Check if toast already exists, remove it if it does
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  // Create new toast
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // Show toast
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// Update profile picture whenever it changes
function updateProfilePicture(newPhotoURL) {
  const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  userProfile.photoURL = newPhotoURL;
  localStorage.setItem('userProfile', JSON.stringify(userProfile));

  // Update all profile pictures in the UI
  document.querySelectorAll('.user-avatar, .user-profile img').forEach(img => {
    img.src = newPhotoURL;
  });
}

// Add these CSS styles at the end of your existing CSS file
const styles = document.createElement('style');
styles.textContent = `
  .search-bar {
    position: relative;
  }
  
  .search-suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #ddd;
    border-top: none;
    border-radius: 0 0 4px 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    display: none;
    z-index: 1000;
  }
  
  .suggestion-item {
    padding: 8px 12px;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  
  .suggestion-item:hover {
    background-color: #f8f8f8;
  }
  
  .suggestion-item i {
    margin-right: 12px;
    color: #666;
    font-size: 20px;
  }
  
  .suggestion-item strong {
    color: #000;
    font-weight: 500;
  }
`;
document.head.appendChild(styles);

// Add this function to handle video likes
function handleVideoLike(video) {
  const likedVideos = JSON.parse(localStorage.getItem('likedVideos') || '[]');
  const isLiked = likedVideos.some(v => v.id === video.id);
  
  if (isLiked) {
    // Unlike video
    const filteredVideos = likedVideos.filter(v => v.id !== video.id);
    localStorage.setItem('likedVideos', JSON.stringify(filteredVideos));
    showToast('Removed from liked videos');
    return false;
  } else {
    // Like video
    likedVideos.unshift(video);
    localStorage.setItem('likedVideos', JSON.stringify(likedVideos));
    showToast('Added to liked videos');
    return true;
  }
}

// Helper function to check if a video is liked
function isVideoLiked(video) {
  const likedVideos = JSON.parse(localStorage.getItem('likedVideos') || '[]');
  return likedVideos.some(v => v.id === video.id);
}

// Add this CSS for the like button
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
  .video-action-button.liked {
    color: #065fd4;
  }
  .video-action-button.liked i {
    color: #065fd4;
  }
`;
document.head.appendChild(additionalStyles);

// Add these new functions for handling watch history
function addToHistory(video) {
  const history = JSON.parse(localStorage.getItem('watchHistory') || '[]');
  // Remove if already exists (to move it to top)
  const filteredHistory = history.filter(v => v.id !== video.id);
  // Add to beginning of array
  filteredHistory.unshift(video);
  // Store in localStorage
  localStorage.setItem('watchHistory', JSON.stringify(filteredHistory));
}

// Add this function to handle video deletion
async function deleteVideo(videoId) {
  const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  const video = window.allVideos.find(v => v.id === videoId);
  
  if (!video || video.userId !== userProfile.uid) {
    showToast('You can only delete your own videos');
    return;
  }

  // Show confirmation dialog
  if (!confirm('Are you sure you want to delete this video?')) {
    return;
  }

  try {
    // Remove from arrays
    window.allVideos = window.allVideos.filter(v => v.id !== videoId);
    window.uploadedVideos = window.uploadedVideos.filter(v => v.id !== videoId);

    // Update localStorage
    const storedVideos = JSON.parse(localStorage.getItem('uploadedVideos') || '[]');
    const updatedVideos = storedVideos.filter(v => v.id !== videoId);
    localStorage.setItem('uploadedVideos', JSON.stringify(updatedVideos));

    // Update UI
    showUserDashboard();
    showToast('Video deleted successfully');
  } catch (error) {
    console.error('Error deleting video:', error);
    showToast('Failed to delete video');
  }
}

// Modify the dashboard video card template to include delete button
function showUserDashboard() {
  console.log('showUserDashboard function called');
  const mainContent = document.querySelector('.main-content');
  
  // Get user profile from localStorage
  const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  const username = userProfile.username || 'User';
  const displayName = userProfile.displayName || 'Your Channel';
  // Use the stored profile picture or fallback to default
  const profilePic = userProfile.photoURL || '/default-profile.png';
  
  // Update header profile picture
  const headerProfileImg = document.querySelector('.user-profile img');
  if (headerProfileImg) {
    headerProfileImg.src = profilePic;
  }

  // Filter videos for current user
  const userVideos = window.allVideos.filter(video => video.userId === userProfile.uid);

  // Calculate stats for user's videos only
  const totalViews = userVideos.reduce((sum, video) => {
    const viewsText = video.views.replace(/K views|M views|views/g, '').trim();
    let viewCount = parseFloat(viewsText);
    if (viewsText.includes('K')) viewCount *= 1000;
    if (viewsText.includes('M')) viewCount *= 1000000;
    return sum + (isNaN(viewCount) ? 0 : viewCount);
  }, 0);

  mainContent.innerHTML = `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <div class="user-banner">
          <div class="user-info">
            <img src="${profilePic}" class="user-avatar" alt="${displayName}'s profile">
            <div class="user-details">
              <h1>${displayName}</h1>
              <p>@${username}</p>
            </div>
          </div>
          <div class="user-stats">
            <div class="stat">
              <span class="stat-value">${userVideos.length}</span>
              <span class="stat-label">Videos</span>
            </div>
            <div class="stat">
              <span class="stat-value">${totalViews}</span>
              <span class="stat-label">Views</span>
            </div>
            <div class="stat">
              <span class="stat-value">${Math.floor(Math.random() * 1000) + 100}</span>
              <span class="stat-label">Subscribers</span>
            </div>
          </div>
        </div>
        
        <div class="dashboard-tabs">
          <button class="dashboard-tab active">Dashboard</button>
          <button class="dashboard-tab">Content</button>
          <button class="dashboard-tab">Analytics</button>
          <button class="dashboard-tab">Comments</button>
          <button class="dashboard-tab">Customization</button>
        </div>
      </div>
      
      <div class="dashboard-content">
        <div class="dashboard-section">
          <div class="section-header">
            <h2>Your Videos</h2>
            <button class="upload-video-btn browse-button">Upload Video</button>
          </div>
          
          ${userVideos.length === 0 ? 
            `<div class="no-results">
              <i class="material-icons">videocam_off</i>
              <h3>No videos uploaded yet</h3>
              <p>Your uploaded videos will appear here</p>
              <button class="browse-button create-btn">Upload Video</button>
            </div>` 
            : 
            `<div class="video-grid dashboard-videos">
              ${userVideos.map(video => `
                <div class="video-card" data-id="${video.id}">
                  <div class="video-thumbnail">
                    <img src="${video.thumbnail}" alt="${video.title}">
                    <div class="video-duration">${video.duration}</div>
                  </div>
                  <div class="video-info">
                    <div class="video-details" style="padding-left: 0;">
                      <h3 class="video-title">${video.title}</h3>
                      <p class="video-meta">${video.views} • ${video.uploadedAgo}</p>
                      <div class="video-actions">
                        <button class="video-action" title="Edit"><i class="material-icons">edit</i></button>
                        <button class="video-action" title="Analytics"><i class="material-icons">analytics</i></button>
                        <button class="video-action" title="Comments"><i class="material-icons">comment</i></button>
                        <button class="video-action delete-btn" title="Delete" onclick="deleteVideo('${video.id}')">
                          <i class="material-icons">delete</i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>`
          }
        </div>
      </div>
    </div>
  `;
  
  // Add event listeners to video cards
  document.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't play video if clicked on action buttons
      if (e.target.closest('.video-actions')) {
        return;
      }
      
      const videoId = card.dataset.id;
      const video = window.allVideos.find(v => v.id === videoId);
      if (video) {
        playVideo(video);
      }
    });
  });
  
  // Add event listener to create/upload buttons
  const uploadBtns = mainContent.querySelectorAll('.create-btn, .upload-video-btn');
  uploadBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('.create-btn').click();
    });
  });
  
  // Highlight active tab - the dashboard tab is active by default
  const dashboardTabs = mainContent.querySelectorAll('.dashboard-tab');
  dashboardTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      dashboardTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      // We're not implementing other tabs in this version
      showToast('This feature is coming soon!');
    });
  });
}

// Add these styles for delete button
const deleteStyles = document.createElement('style');
deleteStyles.textContent = `
  .delete-btn {
    color: #cc0000 !important;
  }
  .delete-btn:hover {
    background-color: rgba(204, 0, 0, 0.1) !important;
  }
`;
document.head.appendChild(deleteStyles);

// ...rest of existing code...