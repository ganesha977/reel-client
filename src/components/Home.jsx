import React from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import RightSidebar from './RightSidebar'
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers'
import useGetAllReels from '@/hooks/useGetAllReels'
import UseGetAllPosts from '@/hooks/UseGetAllposts'

const Home = () => {
    UseGetAllPosts();
    useGetSuggestedUsers();
    useGetAllReels();
    return (
        <div className='flex flex-col lg:flex-row min-h-screen'>
            <div className='flex-grow'>
                <Feed />
                <Outlet />
            </div>
            <div className='lg:w-80 lg:flex-shrink-0 bg-gray-50'>
                <RightSidebar />
            </div>
        </div>
    )
}

export default Home