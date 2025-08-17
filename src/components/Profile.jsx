import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AtSign, Heart, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import useGetUserProfile from '@/hooks/UseGetUserProfile';

const Profile = () => {
  const { id: userId } = useParams();
  useGetUserProfile(userId);

  const { userProfile, user } = useSelector(store => store.auth);
  const isLoggedInUserProfile = user?._id === userProfile?._id;

  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    if (user && userProfile?.followers?.includes(user._id)) {
      setIsFollowing(true);
    }
  }, [userProfile, user]);

  const handleFollowOrUnfollow = async () => {
    try {
      const res = await axios.post(
        `https://reel-server.onrender.com/api/v1/user/followorunfollow/${userProfile?._id}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        setIsFollowing(prev => !prev);
        toast.success(res.data.message);
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const displayedPost =
    activeTab === 'posts'
      ? userProfile?.posts
      : activeTab === 'saved'
      ? userProfile?.bookmarks
      : activeTab === 'reels'
      ? userProfile?.reels
      : [];

  const tabs = ['posts', ...(isLoggedInUserProfile ? ['saved'] : []), 'reels', 'tags'];

  return (
    <div className="lg:ml-64 px-4 max-w-5xl mx-auto pb-20 lg:pb-8">
      <div className="flex flex-col gap-8 lg:gap-20 pt-16 lg:pt-8">
        {/* Top Profile Info */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-0">
          <section className="flex items-center justify-center pt-4">
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24 lg:h-32 lg:w-32">
              <AvatarImage src={userProfile?.profilePicture} alt="profilephoto" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>

          <section className="flex flex-col items-center lg:items-start">
            <div className="flex flex-col gap-5 w-full">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <span className="text-xl lg:text-base font-medium">{userProfile?.username}</span>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {isLoggedInUserProfile ? (
                    <>
                      <Link to="/account/edit">
                        <Button variant="secondary" className="h-8 text-xs px-3">Edit profile</Button>
                      </Link>
                      <Button variant="secondary" className="h-8 text-xs px-3 hidden sm:inline-flex">View archive</Button>
                      <Button variant="secondary" className="h-8 text-xs px-3 hidden sm:inline-flex">Ad tools</Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={handleFollowOrUnfollow}
                        className={`h-8 text-xs px-3 ${
                          isFollowing
                            ? 'bg-white border border-gray-300 text-black hover:bg-gray-100'
                            : 'bg-[#0095F6] text-white hover:bg-[#3192d2]'
                        }`}
                      >
                        {isFollowing ? 'Unfollow' : 'Follow'}
                      </Button>
                      <Button variant="secondary" className="h-8 text-xs px-3">Message</Button>
                    </>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex justify-center lg:justify-start gap-6 lg:gap-4">
                {['posts', 'followers', 'following'].map(stat => (
                  <p key={stat}>
                    <span className="font-semibold block lg:inline">
                      {userProfile?.[stat]?.length || 0}
                    </span>
                    <span className="text-gray-600 lg:text-black"> {stat}</span>
                  </p>
                ))}
              </div>

              {/* Bio */}
              <div className="flex flex-col gap-1 items-center lg:items-start text-center lg:text-left">
                <span className="font-semibold">{userProfile?.bio || 'bio here...'}</span>
                <Badge className="w-fit" variant="secondary">
                  <AtSign className="w-3 h-3" />
                  <span className="pl-1 text-xs">{userProfile?.username}</span>
                </Badge>
                <div className="space-y-1 text-sm">
                  <div> Learn code with Rahul mernstack </div>
                  <div>Turing code into Ui</div>
                  <div> DM for collaboration</div>  
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Tabs */}
        <div className="border-t border-t-gray-200">
          <div className="flex items-center justify-center gap-6 text-sm overflow-x-auto">
            {tabs.map(tab => (
              <span
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 cursor-pointer border-b-2 whitespace-nowrap px-1 ${
                  activeTab === tab ? 'border-black font-bold' : 'border-transparent'
                }`}
              >
                {tab.toUpperCase()}
              </span>
            ))}
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-3 gap-0.5 sm:gap-1 mt-4">
            {displayedPost?.length > 0 ? (
              displayedPost.map(item => (
                <div key={item._id} className="relative group cursor-pointer">
                  {activeTab === 'reels' ? (
                    <>
                      <video
                        src={item.video}
                        muted
                        loop
                        className="rounded-sm w-full aspect-square object-cover group-hover:brightness-50 transition"
                      />
                      <p className="text-xs text-center text-gray-600 mt-1 px-1 hidden sm:block">{item.caption}</p>
                    </>
                  ) : (
                    <img
                      src={item.image}
                      alt="postimage"
                      className="rounded-sm w-full aspect-square object-cover"
                    />
                  )}

                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition">
                    <div className="flex items-center text-white space-x-2 lg:space-x-4">
                      <button className="flex items-center gap-1 hover:text-gray-300">
                        <Heart className="w-4 h-4" />
                        <span className="text-xs">{item?.likes?.length || 0}</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-gray-300">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-xs">{item?.comments?.length || 0}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center col-span-3 py-10 text-sm text-gray-500">No content to show</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
  