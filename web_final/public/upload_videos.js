// Import necessary libraries from Cloudinary
import { v2 as cloudinary } from 'cloudinary';

document.getElementById("videoUploadForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const videoTitle = document.getElementById("videoTitle").value;
    const videoFile = document.getElementById("videoFile").files[0];
    const statusMessage = document.getElementById("statusMessage");

    if (!videoFile) {
        statusMessage.textContent = "Please select a video file.";
        return;
    }

    // Display upload progress
    statusMessage.textContent = "Uploading video...";

    try {
        // Configure Cloudinary
        cloudinary.config({
            cloud_name: 'dra4ykviv', 
            api_key: '495282156511798', 
            api_secret: 'vuvcVgbiqiBl7YUZbnRB8URj6s4' // Replace <your_api_secret> with your actual API secret
        });

        // Create a FormData object to upload the video
        const formData = new FormData();
        formData.append('file', videoFile);
        formData.append('upload_preset', 'my_upload_preset'); // Replace with your Cloudinary upload preset

        // Upload video using fetch API
        const response = await fetch('https://api.cloudinary.com/v1_1/dra4ykviv/video/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Failed to upload video.");
        }

        const data = await response.json();
        console.log("Upload result:", data);

        // Display success message
        statusMessage.textContent = `Video uploaded successfully! Public URL: ${data.secure_url}`;

        // Optimize delivery by resizing and applying auto-format and auto-quality
        const optimizeUrl = cloudinary.url(data.public_id, {
            resource_type: 'video',
            fetch_format: 'auto',
            quality: 'auto',
        });

        console.log("Optimized URL:", optimizeUrl);

    } catch (error) {
        console.error("Error uploading video:", error);
        statusMessage.textContent = "An error occurred while uploading the video.";
    }
});