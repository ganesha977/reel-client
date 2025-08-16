import React, { useEffect, useRef, useState } from 'react';
import { X, Trash2, Smile } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { setReels } from '../redux/reelSlice';
import moment from 'moment';

const ReelCommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState('');
  const [comments, setComments] = useState([]);
  const videoRef = useRef(null);
  const { selectedReel, reels } = useSelector((state) => state.reel);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedReel) setComments(selectedReel.comments || []);
  }, [selectedReel]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (open) {
      video.muted = false;
      video.play().catch((err) => {
        console.error('Video auto-play failed:', err);
      });
    } else {
      video.pause();
      video.muted = true;
    }
  }, [open]);

  const sendCommentHandler = async () => {
    if (!text.trim()) return;
    try {
      const res = await axios.post(
        `https://social-media-server-3ykc.onrender.com/api/v1/reel/comment/${selectedReel._id}`,
        { text },
        { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
      );

      if (res.data.success) {
        const updatedComments = [...comments, res.data.comment];
        setComments(updatedComments);

        const updatedReels = reels.map((r) =>
          r._id === selectedReel._id ? { ...r, comments: updatedComments } : r
        );

        dispatch(setReels(updatedReels));
        toast.success(res.data.message);
        setText('');
      }
    } catch (err) {
      toast.error('Failed to post comment');
    }
  };

  const handleDeleteReel = async () => {
    try {
      const res = await axios.delete(
        `https://social-media-server-3ykc.onrender.com/api/v1/reel/${selectedReel._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedReels = reels.filter((r) => r._id !== selectedReel._id);
        dispatch(setReels(updatedReels));
        setOpen(false);
        toast.success('Reel deleted');
      }
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  if (!open || !selectedReel) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="bg-white w-full md:w-[95%] lg:w-[90%] xl:w-[85%] max-w-6xl h-full md:h-[92%] rounded-t-2xl md:rounded-xl flex flex-col md:flex-row overflow-hidden shadow-xl">

        {/* Video Section */}
        <div className="w-full md:w-1/2 h-64 sm:h-80 md:h-full bg-black relative flex items-center justify-center">
          <video
            ref={videoRef}
            src={selectedReel.video}
            className="w-full h-full object-cover md:rounded-l-xl"
            loop
            muted
            playsInline
          />
        </div>

        {/* Content Section */}
        <div className="w-full md:w-1/2 flex flex-col bg-white flex-1 min-h-0">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 md:py-3 border-b bg-white sticky top-0">
            <h2 className="text-lg md:text-base font-semibold md:font-medium">Comments</h2>
            <div className="flex items-center gap-3 md:gap-2">
              {user?._id === selectedReel?.postedBy?._id && (
                <button 
                  onClick={handleDeleteReel}
                  className="p-2 md:p-1 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              )}
              <button 
                onClick={() => setOpen(false)}
                className="p-2 md:p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="flex-1 px-4 py-4 overflow-y-auto space-y-4 md:space-y-3 min-h-0 custom-scroll">
            {comments.length === 0 ? (
              <div className="flex items-center justify-center h-full min-h-[120px]">
                <p className="text-gray-500 text-sm text-center">No comments yet.</p>
              </div>
            ) : (
              comments.map((c) => (
                <div key={c._id} className="flex gap-3">
                  <img
                    src={c.author?.profilePicture || '/default-avatar.png'}
                    className="w-10 h-10 md:w-9 md:h-9 rounded-full flex-shrink-0"
                    alt={c.author?.username}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-medium text-sm truncate">{c.author?.username}</span>
                      <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                        {moment(c.createdAt).fromNow()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1 break-words">{c.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Comment Input */}
          <div className="border-t px-4 py-4 md:py-3 bg-white">
            <div className="flex items-center gap-3 md:gap-2">
              <img
                src={user?.profilePicture || '/default-avatar.png'}
                className="w-10 h-10 md:w-9 md:h-9 rounded-full flex-shrink-0"
                alt="User"
              />
              <div className="flex-1 bg-gray-100 rounded-full flex items-center px-4 py-3 md:px-3 md:py-2 min-w-0">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Add a comment..."
                  className="bg-transparent flex-1 text-sm outline-none min-w-0"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && text.trim()) {
                      sendCommentHandler();
                    }
                  }}
                />
                <Smile className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
              </div>
              {text.trim() && (
                <button
                  onClick={sendCommentHandler}
                  className="text-blue-500 font-semibold text-sm px-3 py-2 md:px-2 md:py-1 hover:bg-blue-50 rounded-md transition-colors flex-shrink-0"
                >
                  Post
                </button>
              )}
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
    </div>
  );
};

export default ReelCommentDialog;