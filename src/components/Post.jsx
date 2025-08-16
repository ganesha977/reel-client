import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { MessageCircle, MoreHorizontal, Send, Bookmark } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDailogue from "./CommentDailogue";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Link } from "react-router-dom";
import moment from "moment";

const Post = ({ post }) => {  
  if (!post || !post.author) return null;

  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const { posts } = useSelector((store) => store.post);
  const [liked, setLiked] = useState(post?.likes?.includes(user?._id) || false);
  const [postlike, setPostlike] = useState(post?.likes?.length || 0);
  const [comment, setComment] = useState(post.comments);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    setIsFollowing(post?.author?.followers?.includes(user?._id));
  }, [post, user]);

  const changechangehandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : "");
  };

  const handleFollowOrUnfollow = async () => {
    try {
      const res = await axios.post(
        `https://social-media-server-3ykc.onrender.com/api/v1/user/followorunfollow/${post?.author?._id}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        setIsFollowing((prev) => !prev);
        toast.success(res.data.message);
        console.log("Post created at:", post?.createdAt);
      }
    } catch (error) {
      console.error("Follow/Unfollow Error:", error);
    }
  };

  const deletePostHandeler = async () => {
    try {
      const res = await axios.delete(
        `https://social-media-server-3ykc.onrender.com/api/v1/post/delete/${post?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedPostData = posts.filter((p) => p._id !== post._id);
        dispatch(setPosts(updatedPostData));
        dispatch(setSelectedPost(null));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log("error deleting post", error);
      toast.error(error.response?.data?.message || "Failed to delete post");
    }
  };

  const likeordislikeHandler = async () => {
    if (!post || !post._id) {
      toast.error("Post not found or already deleted");
      return;
    }

    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.post(
        `https://social-media-server-3ykc.onrender.com/api/v1/post/${post._id}/${action}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setPostlike((prev) => (liked ? prev - 1 : prev + 1));
        setLiked((prev) => !prev);
        toast.success(res.data.message);

        const updatedPostData = posts.map((p) => {
          if (p._id === post._id) {
            return {
              ...p,
              likes: liked
                ? p.likes.filter((id) => id !== user._id)
                : [...p.likes, user._id],
            };
          }
          return p;
        });

        dispatch(setPosts(updatedPostData));
      }
    } catch (error) {
      console.log("error liking post", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `https://social-media-server-3ykc.onrender.com/api/v1/post/${post._id}/comment`,
        { text },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );

        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const bookmarkhandler = async () => {
    try {
      const res = await axios.get(
        `https://social-media-server-3ykc.onrender.com/api/v1/post/${post?._id}/bookmark`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
    }
  };

  const formatTimestamp = (timestamp) => {
    return moment(timestamp).fromNow();
  };

  return (
    <div className="max-w-md mx-auto rounded-none mb-6">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <Link to={`/profile/${post?.author?._id}`}>
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={post?.author?.profilePicture} alt="post-image" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-sm text-black">{post?.author?.username}</span>
              {user?._id === post?.author?._id && (
                <Badge variant='secondary' className="text-xs">Author</Badge>
              )}
              <span className="text-gray-500 text-sm">• {formatTimestamp(post?.createdAt)}</span>
            </div>
          </div>
        </Link>
        
        <Dialog>
          <DialogTrigger asChild>
            <button className="p-1">
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </button>
          </DialogTrigger>
          <DialogContent className="bg-white text-black flex flex-col items-center text-sm text-center">
            {user && user._id !== post?.author?._id && (
              <Button
                onClick={handleFollowOrUnfollow}
                variant="ghost"
                className={`cursor-pointer w-fit font-bold border ${
                  isFollowing
                    ? "text-[#ED4956] hover:bg-[#fce6e9]"
                    : "text-blue-600 hover:bg-blue-50"
                }`}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            )}

            <Button
              variant="ghost"
              className="cursor-pointer w-fit text-black font-medium hover:bg-gray-100"
            >
              Add to favorites
            </Button>

            {user && user._id === post?.author?._id && (
              <Button
                variant="ghost"
                className="cursor-pointer w-fit text-black font-semibold bg-gray-100 hover:bg-gray-200"
                onClick={deletePostHandeler}
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Image Container */}
      <div className="relative bg-black aspect-square overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={post.image}
          alt="post_img"
        />
      </div>

      <div className="flex items-center justify-between p-3">
        <div className="flex items-center space-x-4">
          {liked ? (
            <FaHeart
              size={24}
              className="text-red-500 cursor-pointer hover:scale-110 transition-transform"
              onClick={likeordislikeHandler}
            />
          ) : (
            <FaRegHeart
              size={24}
              className="text-black cursor-pointer hover:scale-110 transition-transform"
              onClick={likeordislikeHandler}
            />
          )}

          <MessageCircle
            size={24}
            className="text-black cursor-pointer hover:scale-110 transition-transform"
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
          />

          <Send
            size={24}
            className="text-black cursor-pointer hover:scale-110 transition-transform"
          />
        </div>
        <Bookmark
          size={24}
          onClick={bookmarkhandler}
          className="text-black cursor-pointer hover:scale-110 transition-transform"
        />
      </div>

      <div className="px-3 pb-2">
        <span className="font-semibold text-sm text-black">
          {postlike.toLocaleString()} likes
        </span>
      </div>

      <div className="px-3 pb-2">
        <span className="font-semibold text-sm text-black">{post?.author?.username}</span>
        <span className="text-sm text-black ml-2">{post?.caption}</span>
        <button className="text-gray-500 text-sm ml-2">... more</button>
      </div>

      {comment.length > 0 && (
        <div className="px-3 pb-2">
          <button 
            className="text-gray-500 text-sm"
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
          >
            View all {comment.length} comments
          </button>
          {comment.slice(0, 2).map((commentItem) => (
            <div key={commentItem._id} className="mt-1">
              <span className="font-semibold text-sm text-black">{commentItem.author?.username}</span>
              <span className="text-sm text-black ml-2">{commentItem.text}</span>
            </div>
          ))}
        </div>
      )}

      <CommentDailogue open={open} setOpen={setOpen} />

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
            onChange={changechangehandler}
            className="flex-1 text-sm border-none outline-none bg-transparent placeholder-gray-500"
          />
          {text && (
            <button
              className="text-blue-500 text-sm font-semibold"
              onClick={commentHandler}
            >
              Post
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
