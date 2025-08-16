import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback } from './ui/avatar'
import { AvatarImage } from '@radix-ui/react-avatar'
import { Button } from './ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select'; 
import { Textarea } from './ui/textarea'
import { Loader, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { setAuthUser } from '@/redux/authSlice';

const EditProfile = () => {
    const imageref=useRef();
    const {user}=useSelector(store=>store.auth);
const [loading,setLoading]=useState(false);
const [input ,setInput]=useState({
    profilePhoto:user?.profilePicture,
    bio:user?.bio,
    gender:user?.gender
})
const navigate=useNavigate();
const dispatch=useDispatch();






const selectchangehandler=(value)=>{
  setInput({...input ,gender:value})
}

const filechngehandler=(e)=>{
    
    try {
const file = e.target.files[0];

        if(file){
            setInput({
                ...input,profilePhoto:file
            })
        }

    

        
    } catch (error) {
        console.log(error)
        
    }
}


 const editprofilehandler=async()=>{
    const formdata=new FormData();
    formdata.append('bio',input.bio);
    formdata.append('gender',input.gender);
    
if(input.profilePhoto){
    formdata.append('profilePhoto',input.profilePhoto);

}


try {
    setLoading(true);
const res = await axios.post(`https://social-media-server-3ykc.onrender.com/api/v1/user/profile/edit`, formdata, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  withCredentials: true
});

if (res.data.success) {
  const updateduserdata = {
    ...user,
    bio: res?.data?.user?.bio,
    profilePicture: res?.data?.user?.profilePicture,
    gender: res?.data?.user?.gender
  };

  dispatch(setAuthUser(updateduserdata));
  navigate(`/profile/${user._id}`);
  toast.success(res.data.message);
}



} catch (error) {
    console.log(error);
    toast.error(error.response.data.message)
    
}    
 }
  return (
    <div className='flex w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-10'>

        <section className='flex flex-col gap-4 sm:gap-6 w-full my-4 sm:my-8'>
            <h1 className='font-bold text-lg sm:text-xl'>Edit Profile</h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-100 rounded-xl p-3 sm:p-4 gap-3 sm:gap-0">
                <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
                        <AvatarImage src={user?.profilePicture} alt="post-iamge" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>    

                    <div className="flex-1 min-w-0">
                        <h1 className='font-bold text-sm sm:text-base truncate'>{user?.username}</h1>
                        <span className='text-gray-600 text-xs sm:text-sm line-clamp-2'>{user?.bio ||'bio here'}</span>
                    </div>
                </div>

                <input type="file" ref={imageref} className='hidden' onChange={filechngehandler} />
                <Button 
                    onClick={()=>imageref?.current.click()} 
                    className='bg-[#0095F6] h-8 sm:h-9 text-xs sm:text-sm px-3 sm:px-4 hover:bg-[#318bc7] w-full sm:w-auto'
                >
                    change photo
                </Button>
            </div>

            <div className="space-y-2">
                <h1 className='font-bold text-base sm:text-lg'>Bio</h1>
                <Textarea 
                    value={input.bio} 
                    onChange={(e)=>setInput({...input,bio:e.target.value})} 
                    className='focus-visible:ring-transparent min-h-[80px] sm:min-h-[100px] text-sm sm:text-base resize-none'
                    placeholder="Write your bio here..."
                />
            </div>

            <div className="space-y-2">
                <h1 className='font-bold text-base sm:text-lg'>Gender</h1>
                <Select defaultValue={input.gender} onValueChange={selectchangehandler}>
                    <SelectTrigger className="w-full h-10 sm:h-11 text-sm sm:text-base">
                        <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="male" className="text-sm sm:text-base">Male</SelectItem>
                            <SelectItem value="female" className="text-sm sm:text-base">Female</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div className='flex justify-center sm:justify-end pt-2 sm:pt-4'>
                {
                    loading ? (
                        <Button className='w-full sm:w-fit bg-[#0095F6] h-10 sm:h-9 hover:bg-[#318bc7] text-sm sm:text-base px-6 sm:px-4'>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                            Please wait...      
                        </Button>
                    ) : (
                        <Button 
                            onClick={editprofilehandler} 
                            className='w-full sm:w-fit bg-[#0095F6] h-10 sm:h-9 hover:bg-[#318bc7] text-sm sm:text-base px-6 sm:px-4'
                        >
                            Submit      
                        </Button>
                    )
                }
            </div>
        </section>
    </div>
  )
}

export default EditProfile