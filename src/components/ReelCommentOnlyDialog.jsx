import React, { useEffect, useState } from 'react';
import { X, Trash2, Smile } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { setReels } from '@/redux/reelSlice';
import moment from 'moment';

const ReelCommentOnlyDialog = ({ open, setOpen }) => {
  const [text, setText] = useState('');
  const [comments, setComments] = useState([]);
  const { selectedReel, reels } = useSelector((state) => state.reel);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedReel) setComments(selectedReel.comments || []);
  }, [selectedReel]);

  const sendCommentHandler = async () => {
    if (!text.trim()) return;
    try {
      const res = await axios.post(
        `http://localhost:7777/api/v1/reel/comment/${selectedReel._id}`,
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
        `http://localhost:7777/api/v1/reel/${selectedReel._id}`,
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
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end md:items-center justify-center md:justify-center">
      <div className="bg-white w-full md:w-[400px] max-h-[80%] rounded-t-xl md:rounded-xl overflow-hidden shadow-2xl flex flex-col">
        
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-base font-semibold">Comments</h2>
          <div className="flex items-center gap-2">
            {user?._id === selectedReel?.postedBy?._id && (
              <button onClick={handleDeleteReel}>
                <Trash2 className="w-5 h-5 text-red-500" />
              </button>
            )}
            <button onClick={() => setOpen(false)}>
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="flex-1 px-4 py-4 overflow-y-auto space-y-4 custom-scroll">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-sm text-center mt-8">No comments yet.</p>
          ) : (
            comments.map((c) => (
              <div key={c._id} className="flex gap-3">
                <img
                  src={c.author?.profilePicture || '/default-avatar.png'}
                  className="w-9 h-9 rounded-full"
                  alt={c.author?.username}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{c.author?.username}</span>
                    <span className="text-xs text-gray-400">{moment(c.createdAt).fromNow()}</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{c.text}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t px-4 py-3">
          <div className="flex items-center gap-3">
            <img
              src={user?.profilePicture || '/default-avatar.png'}
              className="w-9 h-9 rounded-full"
              alt="User"
            />
            <div className="flex-1 bg-gray-100 rounded-full flex items-center px-3 py-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Add a comment..."
                className="bg-transparent flex-1 text-sm outline-none"
              />
              <Smile className="w-5 h-5 text-gray-400" />
            </div>
            {text.trim() && (
              <button
                onClick={sendCommentHandler}
                className="text-blue-500 font-semibold text-sm"
              >
                Post
              </button>
            )}
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

export default ReelCommentOnlyDialog;
