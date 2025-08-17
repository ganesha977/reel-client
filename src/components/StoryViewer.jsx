import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { X, Play, Pause, Trash2 } from "lucide-react";
import { getUserStories, deleteStory } from "../api/storyApi";
import { useSelector } from "react-redux";

const StoryViewer = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [stories, setStories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const { data } = await getUserStories(username);
        setStories(data.stories || []);
      } catch (err) {
        console.error("Error fetching user stories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, [username]);

  const story = stories[currentIndex];

  // Progress bar auto-play
  useEffect(() => {
    if (!story || isPaused) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          handleNext();
          return 0;
        }
        return p + 2;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [story, isPaused]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((i) => i + 1);
      setProgress(0);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setProgress(0);
    }
  };

  const handleClose = () => navigate("/");

  const handleDelete = async (id) => {
    try {
      await deleteStory(id);
      setStories((prev) => prev.filter((s) => s._id !== id));
      if (stories.length <= 1) {
        handleClose();
      } else {
        setCurrentIndex(0);
        setProgress(0);
      }
    } catch (err) {
      console.error("Error deleting story:", err);
    }
  };

  // ⏳ Loading skeleton (Instagram style)
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-16 h-16 rounded-full bg-gray-600"></div>
          <div className="w-40 h-4 bg-gray-600 rounded"></div>
          <div className="w-64 h-96 bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    );
  }

  // 🟣 If no stories exist after loading
  if (!story) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white text-lg">
        No stories available
      </div>
    );
  }

  const isVideo = story.image?.match(/\.(mp4|webm|ogg)$/i);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md h-full max-h-[90vh] bg-black rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress Bar */}
        <div className="absolute top-2 left-2 right-2 z-20">
          <div className="h-0.5 bg-white bg-opacity-30 rounded-full">
            <div
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Header */}
        <div className="absolute top-6 left-4 right-4 z-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-white p-0.5">
              <img
                src={story.author.profilePicture}
                alt={story.author.username}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <p className="text-white text-sm font-medium">{story.author.username}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsPaused(!isPaused)} className="text-white">
              {isPaused ? <Play size={20} /> : <Pause size={20} />}
            </button>
            <button onClick={handleClose} className="text-white">
              <X size={24} />
            </button>
            {user?._id === story.author._id && (
              <button
                onClick={() => handleDelete(story._id)}
                className="text-red-400"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Story Media */}
        {isVideo ? (
          <video
            src={story.image}
            controls
            autoPlay
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={story.image}
            alt="story"
            className="w-full h-full object-cover"
          />
        )}

        {/* Navigation zones */}
        <div
          className="absolute left-0 top-0 w-1/3 h-full cursor-pointer"
          onClick={handlePrev}
        />
        <div
          className="absolute right-0 top-0 w-1/3 h-full cursor-pointer"
          onClick={handleNext}
        />
      </div>
    </div>
  );
};

export default StoryViewer;
