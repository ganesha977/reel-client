import React, { useState } from "react";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth); 

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error("Please enter a search term");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(
        `https://reel-server.onrender.com/api/v1/user/search?query=${query}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedUsers = res.data.users.map((u) => ({
          ...u,
          isFollowing: u.followers?.includes(user?._id),
        }));
        setResults(updatedUsers);
      } else {
        toast.error(res.data.message || "No users found");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleFollowOrUnfollow = async (targetUserId) => {
    try {
      const res = await axios.post(
        `https://reel-server.onrender.com/api/v1/user/followorunfollow/${targetUserId}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setResults((prevResults) =>
          prevResults.map((u) =>
            u._id === targetUserId
              ? { ...u, isFollowing: !u.isFollowing }
              : u
          )
        );
        toast.success(res.data.message);
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="max-w-[470px] mx-auto p-4">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border p-2 rounded-lg"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 rounded-lg"
        >
          Search
        </button>
      </div>

      {loading && <p className="mt-4 text-gray-500">Searching...</p>}

      <div className="mt-4 space-y-4">
        {results.map((u) => (
          <div key={u._id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={u.profilePic} />
                <AvatarFallback>{u.username?.[0]}</AvatarFallback>
              </Avatar>
              <div className="overflow-hidden">
                <h1 className="font-semibold text-sm truncate">
                  <Link to={`/profile/${u._id}`}>{u.username}</Link>
                </h1>
                <span className="text-gray-600 text-sm truncate block">
                  {u.bio || "bio here"}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleFollowOrUnfollow(u._id)}
              className={`px-3 py-1 rounded-lg ${
                u.isFollowing
                  ? "bg-red-500 text-white"
                  : "bg-green-500 text-white"
              }`}
            >
              {u.isFollowing ? "Unfollow" : "Follow"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
