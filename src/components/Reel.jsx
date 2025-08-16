import React, { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { MessageCircle, MoreHorizontal, Send, Bookmark, Volume2, VolumeX } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setReels, setSelectedReel } from "@/redux/reelSlice";
import { Link } from "react-router-dom";
import moment from "moment";
import ReelCommentDialog from "./ReelCommentDialog";

const Reel = ({ reel }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef(null);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const { reels } = useSelector((store) => store.reel);
  const [liked, setLiked] = useState(reel?.likes?.includes(user?._id) || false);
  const [reelLike, setReelLike] = useState(reel?.likes?.length || 0);
  const [comments, setComments] = useState(reel.comments);

  // --- Pause and mute when out of view ---
useEffect(() => {
  const video = videoRef.current;
  if (!video) return;

  const observer = new IntersectionObserver(
    async ([entry]) => {
      if (entry.isIntersecting) {
        video.muted = false;
        setIsMuted(false);

        try {
          await video.play();
          setIsPlaying(true);
        } catch (err) {
          console.warn("Autoplay failed:", err);
        }
      } else {
        video.pause();
        video.muted = true;
        setIsMuted(true);
        setIsPlaying(false);
      }
    },
    { threshold: 0.6 }
  );

  observer.observe(video);

  return () => {
    if (video) observer.unobserve(video);
  };
}, []);


  useEffect(() => {
    const video = videoRef.current;
    if (open && video) {
      video.pause();
      setIsPlaying(false);
    }
  }, [open]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      if (video.paused) {
        video.play().catch((error) => {
          console.log("Auto-play prevented:", error);
          setIsPlaying(false);
        });
      }
    };

    const handleError = () => {
      setIsLoading(false);
      setIsPlaying(false);
      console.error("Video error occurred");
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, []);

  const changeHandler = (e) => {
    const input = e.target.value;
    setText(input.trim() ? input : "");
  };

  const handlePlayPause = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const video = videoRef.current;
    if (!video) return;

    try {
      if (video.paused) {
        await video.play();
      } else {
        video.pause();
      }
    } catch (error) {
      console.error("Error in handlePlayPause:", error);
      if (error.name === 'NotAllowedError') {
        toast.error("Video play was prevented by browser policy");
      } else if (error.name === 'NotSupportedError') {
        toast.error("Video format not supported");
      } else {
        toast.error("Error playing video");
      }
      setIsPlaying(!video.paused);
    }
  };

  const handleMuteToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const video = videoRef.current;
    if (video) {
      const newMutedState = !isMuted;
      video.muted = newMutedState;
      setIsMuted(newMutedState);
      if (!newMutedState && video.paused) {
        video.play().catch((error) => {
          console.log("Play after unmute failed:", error);
        });
      }
    }
  };

  const likeOrDislikeHandler = async () => {
    const action = liked ? "dislike" : "like";
    try {
      const res = await axios.post(
        `http://localhost:7777/api/v1/reel/${action}/${reel._id}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        setLiked((prev) => !prev);
        setReelLike((prev) => (liked ? prev - 1 : prev + 1));
        toast.success(res.data.message);

        const updatedData = reels.map((r) =>
          r._id === reel._id
            ? {
                ...r,
                likes: liked
                  ? r.likes.filter((id) => id !== user._id)
                  : [...r.likes, user._id],
              }
            : r
        );
        dispatch(setReels(updatedData));
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:7777/api/v1/reel/comment/${reel._id}`,
        { text },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedComments = [...comments, res.data.comment];
        setComments(updatedComments);

        const updatedReels = reels.map((r) =>
          r._id === reel._id ? { ...r, comments: updatedComments } : r
        );
        dispatch(setReels(updatedReels));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.error(error);
      toast.error("Comment failed");
    }
  };

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(
        `http://localhost:7777/api/v1/reel/${reel._id}/bookmark`,
        { withCredentials: true }
      );
      if (res.data.success) toast.success(res.data.message);
    } catch (error) {
      toast.error("Bookmark failed");
    }
  };

  const formatTimestamp = (timestamp) => {
    return moment(timestamp).fromNow();
  };

  return (
    <div className="max-w-md mx-auto  rounded-none mb-6">
      <div className="flex items-center justify-between p-3">
        <Link to={`/profile/${reel?.author?._id}`}>
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={reel?.author?.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-sm text-black">{reel?.author?.username}</span>
              {reel?.author?.verified && (
                <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              <span className="text-gray-500 text-sm">• {formatTimestamp(reel?.createdAt)}</span>
            </div>
          </div>
        </Link>
        <Dialog>
          <DialogTrigger asChild>
            <button className="p-1">
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </button>
          </DialogTrigger>
          <DialogContent>
            <Button variant="ghost">Add to Favorites</Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Video */}
      <div className="relative bg-black aspect-[4/5] overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full object-cover cursor-pointer"
          onClick={handlePlayPause}
          loop
          playsInline
          muted={isMuted}
          preload="metadata"
        >
          <source src={reel?.video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <button
          onClick={handleMuteToggle}
          className="absolute bottom-4 right-4 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-white" />
          ) : (
            <Volume2 className="w-5 h-5 text-white" />
          )}
        </button>

        {!isPlaying && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <div className="w-0 h-0 border-l-[12px] border-l-white border-y-[8px] border-y-transparent ml-1"></div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between p-3">
        <div className="flex items-center space-x-4">
          {liked ? (
            <FaHeart size={24} className="text-red-500 cursor-pointer hover:scale-110 transition-transform" onClick={likeOrDislikeHandler} />
          ) : (
            <FaRegHeart size={24} className="text-black cursor-pointer hover:scale-110 transition-transform" onClick={likeOrDislikeHandler} />
          )}
          <MessageCircle
            size={24}
            className="text-black cursor-pointer hover:scale-110 transition-transform"
            onClick={() => {
              dispatch(setSelectedReel(reel));
              setOpen(true);
            }}
          />
          <Send size={24} className="text-black cursor-pointer hover:scale-110 transition-transform" />
        </div>
        <Bookmark size={24} onClick={bookmarkHandler} className="text-black cursor-pointer hover:scale-110 transition-transform" />
      </div>

      <div className="px-3 pb-2">
        <span className="font-semibold text-sm text-black">
          {reelLike.toLocaleString()} likes
        </span>
      </div>

      <div className="px-3 pb-2">
        <span className="font-semibold text-sm text-black">{reel?.author?.username}</span>
        <span className="text-sm text-black ml-2">{reel?.caption}</span>
        <button className="text-gray-500 text-sm ml-2">... more</button>
      </div>

      {comments.length > 0 && (
        <div className="px-3 pb-2">
          <button 
            className="text-gray-500 text-sm"
            onClick={() => {
              dispatch(setSelectedReel(reel));
              setOpen(true);
            }}
          >
            View all {comments.length} comments
          </button>
          {comments.slice(0, 2).map((comment) => (
            <div key={comment._id} className="mt-1">
              <span className="font-semibold text-sm text-black">{comment.author?.username}</span>
              <span className="text-sm text-black ml-2">{comment.text}</span>
            </div>
          ))}
        </div>
      )}

      <ReelCommentDialog open={open} setOpen={setOpen} />

      <div className="px-3 pb-3 border-t border-gray-100 pt-3">
        <div className="flex items-center space-x-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <input
            type="text"
            placeholder="Add a comment..."
            value={text}
            onChange={changeHandler}
            className="flex-1 text-sm border-none outline-none bg-transparent placeholder-gray-500"
          />
          {text && (
            <button className="text-blue-500 text-sm font-semibold" onClick={commentHandler}>
              Post
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reel;
