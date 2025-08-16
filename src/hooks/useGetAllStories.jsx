import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUserStories } from '@/redux/storySlice'; 
import { toast } from 'sonner';

const useGetAllStories = (userId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserStories = async () => {
      try {
        const res = await axios.get(`http://localhost:7777/api/v1/story/user/${userId}`, {
          withCredentials: true,
        });
        dispatch(setUserStories(res.data.stories));
        toast.success(res.data.message);
      } catch (error) {
        console.error("Error fetching user stories:", error);
      }
    };

    if (userId) fetchUserStories();
  }, [userId, dispatch]);
};

export default useGetAllStories;
