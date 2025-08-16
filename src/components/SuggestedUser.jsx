import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

const SuggestedUsers = () => {
  const { suggestedUsers: initialSuggestedUsers, user } = useSelector((store) => store.auth);

  const [suggestedUsers, setSuggestedUsers] = useState(
    initialSuggestedUsers?.map((u) => ({
      ...u,
      isFollowing: u.followers?.includes(user?._id),
    })) || []
  );

  const handleFollowOrUnfollow = async (targetUserId) => {
    try {
      const res = await axios.post(
        `http://localhost:7777/api/v1/user/followorunfollow/${targetUserId}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setSuggestedUsers((prevUsers) =>
          prevUsers.map((u) =>
            u._id === targetUserId
              ? { ...u, isFollowing: !u.isFollowing }
              : u
          )
        );
        toast.success(res.data.message);
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  if (!suggestedUsers || suggestedUsers.length === 0) {
    return (
      <div className="hidden md:block my-10 w-full max-w-xs text-sm text-gray-500">
        No suggested users
      </div>
    );
  }

  return (
    <div className="hidden md:block my-10 w-full max-w-xs">
      <div className="flex items-center justify-between text-sm">
        <h1 className="font-semibold text-gray-600">Suggested for you</h1>
        <span className="font-medium cursor-pointer hover:underline">See All</span>
      </div>
{suggestedUsers.map((u) => (
  <div
    key={u._id}
    className="flex items-center justify-between my-5 hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200"
  >
    <div className="flex items-center gap-3 overflow-hidden">
      <Link to={`/profile/${u._id}`}>
        <Avatar className="w-10 h-10">
          <AvatarImage src={u?.profilePicture} alt="post-image" />
          <AvatarFallback>{u?.username?.[0]}</AvatarFallback>
        </Avatar>
      </Link>

      <div className="overflow-hidden">
        <h1 className="font-semibold text-sm truncate">
          <Link to={`/profile/${u._id}`}>{u?.username}</Link>
        </h1>
        <span className="text-gray-600 text-sm truncate block">
          {u?.bio || 'bio here'}
        </span>
      </div>
    </div>

    <button
      onClick={() => handleFollowOrUnfollow(u._id)}
      className={`ml-3 px-3 py-1 text-xs font-bold rounded-lg whitespace-nowrap ${
        u.isFollowing
          ? 'bg-red-500 text-white'
          : 'bg-green-500 text-white'
      }`}
    >
      {u.isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  </div>
))}

    </div>
  );
};

export default SuggestedUsers;
