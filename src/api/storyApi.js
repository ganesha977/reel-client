import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:7777/api/v1/story",
  withCredentials: true,
});

// Upload story
export const uploadStory = (formData) =>
  API.post("/add", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Get all stories (self + following)
export const getAllStories = () => API.get("/all");

// Get stories of a specific user (can pass username or _id)
export const getUserStories = (userIdentifier) => API.get(`/user/${userIdentifier}`);

// Delete a story
export const deleteStory = (storyId) => API.delete(`/${storyId}`);
