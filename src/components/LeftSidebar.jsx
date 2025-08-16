import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search
} from 'lucide-react';
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { toast } from 'sonner';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';
import CreatePost from './CreatePost';
import { setPosts, setSelectedPost } from '@/redux/postSlice';
import { Button } from './ui/button';
import { clearMessageNotifications } from '@/redux/messageNotificationSlice';

const LeftSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const { user } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector((store) => store.realTimeNotification);
  const { messageNotification } = useSelector((store) => store.messageNotification);

  const logoutHandler = async () => {
    try {
      const res = await axios.get('https://social-media-server-3ykc.onrender.com/api/v1/user/logout', {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        navigate('/login');
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Logout failed');
    }
  };

  const sidebarHandler = (textType) => {
    if (textType === 'Logout') {
      logoutHandler();
    } else if (textType === 'Create') {
      setOpen(true);
    } else if (textType === 'Profile') {
      navigate(`/profile/${user?._id}`);
    } else if (textType === 'Home') {
      navigate('/');
    } else if (textType === 'Messages') {
      if (messageNotification.length > 0) {
        dispatch(clearMessageNotifications());
      }
      navigate('/chat');
    } else if (textType === 'Notifications') {
      navigate('/notifications');
    } else if (textType === 'Reels') {
      navigate('/reelspage');
    } else if (textType === 'Search') {
      navigate('/ureel');
    }
  };

  const sidebarItems = [
    { icon: <Home />, text: 'Home' },
    { icon: <Search />, text: 'Search' },
    {
      icon: (
        <img
          src={location.pathname === '/reelspage' ? '/ReelOpen.png' : '/reel.png'}
          alt="reels"
          className="w-5 h-5"
        />
      ),
      text: 'Reels',
    },
    { icon: <MessageCircle />, text: 'Messages' },
    { icon: <Heart />, text: 'Notifications' },
    { icon: <PlusSquare />, text: 'Create' },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilePicture} alt="profile" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: 'Profile',
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[20%] h-screen">
        
        <div className="flex flex-col w-full justify-between">
          <div>
            <h1 className="my-8 pl-3 font-bold text-xl">PINGME</h1>
            {sidebarItems.map((item, index) => {
              const isLikeNotification = item.text === 'Notifications';
              const isMessageNotification = item.text === 'Messages';

              const showLikeBadge = isLikeNotification && likeNotification?.length > 0;
              const showMessageBadge = isMessageNotification && messageNotification?.length > 0;

              return (
                <div
                  onClick={() => sidebarHandler(item.text)}
                  key={index}
                  className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3"
                >
                  {item.icon}
                  <span>{item.text}</span>

                  {showLikeBadge && (
                    <Button
                      size="icon"
                      className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6"
                    >
                      {likeNotification.length}
                    </Button>
                  )}

                  {showMessageBadge && (
                    <Button
                      size="icon"
                      className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6"
                    >
                      {messageNotification.length}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Logout at the bottom */}
          <div className="mb-6">
            <div
              onClick={() => sidebarHandler('Logout')}
              className="flex items-center gap-3 hover:bg-gray-100 cursor-pointer rounded-lg p-3"
            >
              <LogOut />
              <span>Logout</span>
            </div>
          </div>
        </div>
      </div>

    {/* Mobile Bottom Navigation */}
<div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-300">
  <div className="flex items-center justify-around py-2 px-4">
    {sidebarItems
      .filter((item) =>
        ['Home', 'Search', 'Reels', 'Messages'].includes(item.text)
      )
      .map((item, index) => {
        const isMessageNotification = item.text === 'Messages';
        const showMessageBadge = isMessageNotification && messageNotification?.length > 0;

        return (
          <div
            onClick={() => sidebarHandler(item.text)}
            key={index}
            className="flex flex-col items-center gap-1 relative cursor-pointer p-2"
          >
            <div className="relative">
              {item.icon}
              {showMessageBadge && (
                <div className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">
                  {messageNotification.length}
                </div>
              )}
            </div>
            <span className="text-xs">{item.text}</span>
          </div>
        );
      })}

    {/* Profile icon for mobile */}
    <div
      onClick={() => sidebarHandler('Profile')}
      className="flex flex-col items-center gap-1 cursor-pointer p-2"
    >
      <Avatar className="w-6 h-6">
        <AvatarImage src={user?.profilePicture} alt="profile" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <span className="text-xs">Profile</span>
    </div>
  </div>
</div>
    

      {/* Mobile Top Header */}
<div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-300 px-4 py-3">
  <div className="flex items-center justify-between">
    <h1 className="font-bold text-xl">Instagram</h1>
    <div className="flex items-center gap-4">
      <PlusSquare className="cursor-pointer" onClick={() => setOpen(true)} />
      <div className="relative cursor-pointer" onClick={() => sidebarHandler('Notifications')}>
        <Heart />
        {likeNotification.length > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">
            {likeNotification.length}
          </div>
        )}
      </div>

       <LogOut
        className="cursor-pointer"
        onClick={() => sidebarHandler('Logout')}
      />
    </div>
  </div>
</div>




      <CreatePost open={open} setOpen={setOpen} />
    </>
  );
};

export default LeftSidebar;