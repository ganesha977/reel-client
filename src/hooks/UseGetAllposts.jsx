import { setPosts } from '@/redux/postSlice';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const UseGetAllPosts = () => {
    const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const res = await axios.get('http://localhost:7777/api/v1/post/all', {
            withCredentials: true,
          
        });
         if(res.data.success) {
            console.log(res.data)

            dispatch(setPosts(res.data.posts));
         }

         
       

      } catch (error) {
        
        console.error("Error fetching posts:", error);
      }
    };

    fetchAllPosts();
  }, []);

};

export default UseGetAllPosts;
