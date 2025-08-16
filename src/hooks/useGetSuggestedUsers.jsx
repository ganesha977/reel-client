import { setSuggestedUsers } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetSuggestedUsers = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            try {
                const res = await axios.get(
                    'https://social-media-server-3ykc.onrender.com/api/v1/user/suggested',
                    { withCredentials: true }
                );

                if (res.data.success) {
                    const users = Array.isArray(res.data.users) ? res.data.users : [];
                    
                    dispatch(setSuggestedUsers(users));
                } else {
                    dispatch(setSuggestedUsers([]));
                }
            } catch (error) {
                console.log(error);
                dispatch(setSuggestedUsers([])); 
            }
        };

        fetchSuggestedUsers();
    }, [dispatch]);
};

export default useGetSuggestedUsers;
