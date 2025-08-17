import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "./ui/button";
import { readFileAsDataURL } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  //imagepreview state
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const {user} = useSelector(store=>store.auth);
  const {posts} = useSelector(store=>store.post);
  const dispatch = useDispatch();

  const filechangehandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
      // setCaption(""); 
    }
  };

  const CreatePostHandler = async (e) => {
    setLoading(true);
    const formdata = new FormData();
    formdata.append("caption", caption);
    if (imagePreview) {
      formdata.append("image", file);
    }

    // formdata.append('image',file);
    try {
      console.log(file, caption);
      const res = await axios.post(
        "https://reel-server.onrender.com/api/v1/post/addpost",
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: "true",
        }
      );
      if (res.data.success) {
         dispatch(setPosts([res.data.post, ...posts]));// [1] -> [1,2] -> total element = 2

        toast.success(res.data.message);
        setOpen(false)
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={open}>
   <DialogContent
  onInteractOutside={() => setOpen(false)}
  className="max-h-[90vh] overflow-y-auto sm:max-w-md rounded-lg"
>


        <DialogHeader className="text-center font-semibold">
          Create a new post
        </DialogHeader>
        <div className="flex gap-3 items-center">
          <Avatar>
            <AvatarImage   src={user?.profilePicture}   alt='img'/>
            <AvatarFallback>YN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-xs"> {user?.username}  </h1>
            <span className="text-gray-600 text-xs">bio here ....</span>
          </div>
        </div>
        <Textarea
          className="focus-visible:ring-transparent border-none"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write  a caption..."
        />
        {imagePreview && (
          <div className="flex justify-center items-center w-full">
            <img
              className="object-cover w-full h-64 rounded-md"
              src={imagePreview}
              alt="post-image"
            />
          </div>
        )}
        <input
          type="file"
          ref={imageRef}
          className="hidden"
          onChange={filechangehandler}
        />

        <Button
          className="w-fit mx-auto   bg-[#258bcf]   hover:bg-[#0095F6]"
          onClick={() => imageRef.current.click()}
        >
          select from your computer{" "}
        </Button>
        {imagePreview &&
          (loading ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button className="w-full" onClick={CreatePostHandler}>
              post{" "}
            </Button>
          ))}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;