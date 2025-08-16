    import { useEffect, useState } from 'react';
import axios from 'axios';

const useGetUserReels = (userId) => {
  const [userReels, setUserReels] = useState([]);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const res = await axios.get(`http://localhost:7777/api/v1/reels/user/${userId}`, {
          withCredentials: true,
        });
        setUserReels(res.data.reels || []);
      } catch (err) {
        console.error('Error fetching user reels', err);
      }
    };

    if (userId) fetchReels();
  }, [userId]);

  return { userReels };
};

export default useGetUserReels;
