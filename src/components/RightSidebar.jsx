import React from 'react'
import { Avatar, AvatarImage } from './ui/avatar'
import { AvatarFallback } from '@radix-ui/react-avatar';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import SuggestedUsers from './SuggestedUser';

const RightSidebar = () => {
  const { user } = useSelector(store => store.auth);

  return (
    <div className='hidden md:block w-full lg:w-fit lg:my-10 lg:pr-32 px-4 lg:px-0 mb-20 lg:mb-0'>
      <div className="flex items-center gap-3 mb-6">
        <Link to={`/profile/${user?._id}`}>
          <Avatar className="w-12 h-12">
            <AvatarImage src={user?.profilePicture} alt="profile" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex-1">
          <h1 className="font-semibold">
            <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
          </h1>
          <span className="text-sm text-gray-500">{user?.bio || 'Bio here'}</span>
        </div>
      </div>
      <SuggestedUsers />
    </div>
  )  
}

export default RightSidebar
