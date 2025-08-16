import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import Comment from './Comment'
import axios from 'axios'
import { toast } from 'sonner'
import { setPosts } from '@/redux/postSlice'

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");
  const { selectedPost, posts } = useSelector(store => store.post);
  const [comment, setComment] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedPost) { 
      setComment(selectedPost.comments);
    }
  }, [selectedPost]);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  }

  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(`http://localhost:7777/api/v1/post/${selectedPost?._id}/comment`, { text }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map(p =>
          p._id === selectedPost._id ? { ...p, comments: updatedCommentData } : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent 
        onInteractOutside={() => setOpen(false)} 
        className="max-w-5xl w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-full p-0 flex flex-col max-h-[95vh] sm:max-h-[90vh]"
      >
        <div className='flex flex-col lg:flex-row flex-1 min-h-0'>
          {/* Image Section */}
          <div className='w-full lg:w-1/2 h-64 sm:h-80 md:h-96 lg:h-auto'>
            <img
              src={selectedPost?.image}
              alt="post_img"
              className='w-full h-full object-cover lg:rounded-l-lg'
            />
          </div>
          
          {/* Content Section */}
          <div className='w-full lg:w-1/2 flex flex-col justify-between min-h-0'>
            {/* Header */}
            <div className='flex items-center justify-between p-3 sm:p-4 border-b'>
              <div className='flex gap-2 sm:gap-3 items-center min-w-0'>
                <Link>
                  <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                    <AvatarImage src={selectedPost?.author?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="min-w-0 flex-1">
                  <Link className='font-semibold text-xs sm:text-sm truncate block'>
                    {selectedPost?.author?.username}
                  </Link>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                    <MoreHorizontal className='w-5 h-5 cursor-pointer' />
                  </button>
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center w-[90vw] max-w-sm">
                  <div className='cursor-pointer w-full text-[#ED4956] font-bold py-3 hover:bg-gray-50 transition-colors'>
                    Unfollow
                  </div>
                  <div className='cursor-pointer w-full py-3 hover:bg-gray-50 transition-colors'>
                    Add to favorites
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Comments Section */}
            <div className='flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 min-h-0' style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#ccc transparent'
            }}>
              {comment.length === 0 ? (
                <div className="flex items-center justify-center h-full min-h-[120px]">
                  <p className="text-gray-500 text-sm text-center">No comments yet.</p>
                </div>
              ) : (
                comment.map((comment) => (
                  <div key={comment._id}>
                    <Comment comment={comment} />
                  </div>
                ))
              )}
            </div>

            {/* Input Section */}
            <div className='p-3 sm:p-4 border-t bg-white'>
              <div className='flex items-center gap-2 sm:gap-3'>
                <Avatar className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0">
                  <AvatarImage src={selectedPost?.author?.profilePicture} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex items-center gap-2">
                  <input 
                    type="text" 
                    value={text} 
                    onChange={changeEventHandler} 
                    placeholder='Add a comment...' 
                    className='flex-1 outline-none border text-sm border-gray-300 p-2 sm:p-2.5 rounded-lg focus:border-blue-500 transition-colors min-w-0' 
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && text.trim()) {
                        sendMessageHandler();
                      }
                    }}
                  />
                  <Button 
                    disabled={!text.trim()} 
                    onClick={sendMessageHandler} 
                    variant="outline"
                    size="sm"
                    className="flex-shrink-0 px-3 sm:px-4"
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .custom-scroll::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scroll::-webkit-scrollbar-thumb {
            background: #ccc;
            border-radius: 10px;
          }
          .custom-scroll {
            scrollbar-width: thin;
            scrollbar-color: #ccc transparent;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  )
}

export default CommentDialog