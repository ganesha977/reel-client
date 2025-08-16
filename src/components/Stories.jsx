import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllStories, uploadStory } from "../api/storyApi";

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewedStories, setViewedStories] = useState(
    JSON.parse(localStorage.getItem("viewedStories")) || []
  );

  // Fetch Stories
  const fetchStories = async () => {
    try {
      const { data } = await getAllStories();
      let fetched = data.stories || [];

      // Reorder: unviewed first, viewed last
      fetched.sort((a, b) => {
        const aViewed = viewedStories.includes(a._id);
        const bViewed = viewedStories.includes(b._id);
        return aViewed === bViewed ? 0 : aViewed ? 1 : -1;
      });

      setStories(fetched);
    } catch (err) {
      console.error("Error fetching stories:", err);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [viewedStories]);

  // Upload
  const handleUpload = async () => {
    if (!file) return alert("Please select an image or video");
    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      await uploadStory(formData);
      setFile(null);

      fetchStories();
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload story");
    } finally {
      setLoading(false);
    }
  };

  // Mark story as viewed
  const handleStoryClick = (storyId) => {
    if (!viewedStories.includes(storyId)) {
      const updated = [...viewedStories, storyId];
      setViewedStories(updated);
      localStorage.setItem("viewedStories", JSON.stringify(updated));
    }
  };

  return (
    <div className="w-full ">
      <div className="max-w-[935px] mx-auto px-5">
        <div
          className="flex gap-4 overflow-x-auto scroll-smooth py-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* Upload (Your Story) */}
          <div className="flex flex-col items-center shrink-0">
            <label className="relative cursor-pointer group">
              <div className="w-[66px] h-[66px] rounded-full p-[2.5px] bg-gradient-to-br from-gray-300 via-gray-200 to-gray-300 group-hover:scale-105 transition-all duration-300 ease-out">
                <div className="relative w-full h-full rounded-full p-[2.5px] bg-white overflow-hidden">
                  {file ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-100" />
                  )}

                  {!loading && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-base leading-none shadow-md">
                      +
                    </span>
                  )}

                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                      <div className="w-6 h-6 rounded-full border-4 border-gray-300 border-t-transparent animate-spin" />
                    </div>
                  )}
                </div>
              </div>

              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>

            <p className="text-xs text-gray-900 mt-2 text-center w-[70px] truncate font-normal leading-tight">
              Your Story
            </p>

            {file && !loading && (
              <button
                onClick={handleUpload}
                className="mt-1 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600"
              >
                Upload
              </button>
            )}
          </div>

          {/* Stories */}
          {stories.map((story) => {
            const isViewed = viewedStories.includes(story._id);

            return (
              <Link
                key={story._id}
                to={`/stories/${story.author.username}`}
                onClick={() => handleStoryClick(story._id)}
                className="flex flex-col items-center shrink-0 group cursor-pointer"
              >
                <div className="relative">
                  <div
                    className={`w-[66px] h-[66px] rounded-full p-[2.5px] ${
                      isViewed
                        ? "bg-gray-300" 
                        : "bg-gradient-to-br from-purple-600 via-pink-500 via-red-500 to-yellow-400" // unviewed → colorful ring
                    } group-hover:scale-105 transition-all duration-300 ease-out`}
                  >
                    <div className="w-full h-full rounded-full p-[2.5px] bg-white">
                      <img
                        src={story.author.profilePicture}
                        alt={story.author.username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-900 mt-2 text-center w-[70px] truncate font-normal leading-tight">
                  {story.author.username}
                </p>
              </Link>
            );
          })}
        </div>

        <style>{`div::-webkit-scrollbar { display: none; }`}</style>
      </div>
    </div>
  );
};

export default Stories;
