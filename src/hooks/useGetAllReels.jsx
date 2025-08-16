// src/hooks/useGetAllReels.js
import { setReels } from '@/redux/reelSlice';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useGetAllReels = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const res = await axios.get('http://localhost:7777/api/v1/reel/all', {
          withCredentials: true,
        });

        if (res.data.success) {
          dispatch(setReels(res.data.reels));
          
        }
        console.log(res,'all reels')
      } catch (error) {
        console.error('Error fetching reels:', error);
      }
    };

    fetchReels();
  }, []);
};

export default useGetAllReels;
