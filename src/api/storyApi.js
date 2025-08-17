import axios from "axios";

const API = axios.create({
  baseURL: "https://reel-server.onrender.com/api/v1/story",
  withCredentials: true,
});

export const uploadStory = (formData) =>
  API.post("/add", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getAllStories = () => API.get("/all");

export const getUserStories = (userIdentifier) => API.get(`/user/${userIdentifier}`);

export const deleteStory = (storyId) => API.delete(`/${storyId}`);
