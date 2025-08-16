import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setSelectedUser } from "@/redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { MessageCircleCode, ArrowLeft } from "lucide-react";
import Messages from "./Messages";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";

const ChatPage = () => {
const { onlineUsers,messages } = useSelector((store) => store.chat);


const { user, suggestedUsers, selectedUser } = useSelector(
  (store) => store.auth
);
const dispatch = useDispatch();
const [textMessage,settextMessage]=useState('');

const sendmsg = async (receiverId) => {
try {
if (!textMessage.trim()) return; 


  const res = await axios.post(
    `http://localhost:7777/api/v1/message/send/${receiverId}`,
    { textMessage },
    {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    }
  );

  if (res.data.success) {
    dispatch(setMessages([...messages, res.data.newMessage]));
    settextMessage(''); 
  }
} catch (error) {
  console.error("Send Message Error:", error);
}
};


useEffect(() => {

  return () => {
    dispatch(setSelectedUser(null));
  };
}, []);

return (
  <div className="flex ml-[20%] h-screen mt-10">
    <section className={`${selectedUser ? 'hidden md:block' : 'block'} w-full md:w-1/4 my-8`}>
      <h1 className="font-bold px-3 mb-4 text-xl text-gray-900">{user?.username}</h1>
      <hr className="mb-4 border-gray-200" />
      <div className="overflow-y-auto h-[calc(100vh-160px)] scrollbar-hide md:scrollbar-thin">
        {suggestedUsers?.map((suggestedUser) => {
          const isOnline = onlineUsers.includes(suggestedUser?._id);

          return (
            <div
              key={suggestedUser._id}
              onClick={() => dispatch(setSelectedUser(suggestedUser))}
              className="flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer transition-all duration-200 rounded-lg mx-2 mb-1"
            >
              <div className="relative">
                <Avatar className="w-14 h-14 ring-2 ring-white shadow-sm">
                  <AvatarImage src={suggestedUser?.profilePicture} className="object-cover" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                    {suggestedUser?.username?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                  isOnline ? "bg-green-500" : "bg-gray-400"
                }`} />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="font-semibold text-gray-900 truncate">
                  {suggestedUser?.username}
                </span>
                <span
                  className={`text-xs font-medium ${
                    isOnline ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {isOnline ? "Active now" : "Offline"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>

    {selectedUser ? (
      <section className="flex-1 md:border-l border-gray-200 flex flex-col h-full bg-white">
        <div className="flex gap-3 items-center px-4 py-4 md:py-3 border-b border-gray-200/50 bg-white/95 backdrop-blur-xl sticky top-0 z-20 shadow-sm">
        <div className="fixed top-0 left-0 right-0 flex gap-3 items-center px-4 py-4 md:py-3 border-b border-gray-200/50 bg-white/95 backdrop-blur-xl z-50 shadow-lg md:relative md:shadow-sm">
          <button 
            onClick={() => dispatch(setSelectedUser(null))}
            className="md:hidden p-2.5 hover:bg-gray-100 rounded-full transition-all duration-200 active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="relative">
            <Avatar className="w-11 h-11 md:w-10 md:h-10 ring-2 ring-white shadow-lg">
              <AvatarImage src={selectedUser?.profilePicture} className="object-cover" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                {selectedUser?.username?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 md:w-3 md:h-3 rounded-full border-2 border-white shadow-sm ${
              onlineUsers.includes(selectedUser?._id) ? "bg-green-500" : "bg-gray-400"
            }`} />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="font-semibold text-gray-900 truncate text-base md:text-sm">{selectedUser?.username}</span>
            <span className={`text-xs font-medium mt-0.5 ${
              onlineUsers.includes(selectedUser?._id) ? "text-green-600" : "text-gray-500"
            }`}>
              {onlineUsers.includes(selectedUser?._id) ? "Active now" : "Offline"}
            </span>
          </div>
        </div>
        </div>
        <div className="flex-1 flex flex-col min-h-0 bg-gray-50/30 pt-16 md:pt-0">
          <Messages selectedUser={selectedUser} />
        </div>
        <div className="flex items-center gap-3 p-4 border-t border-gray-200/50 bg-white/95 backdrop-blur-xl pb-20 md:pb-4 shadow-lg">
          <Input
            type="text"
            value={textMessage}
            onChange={(e) => settextMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendmsg(selectedUser?._id)}
            className="flex-1 border-gray-300 focus-visible:ring-blue-600 focus-visible:ring-2 focus-visible:border-blue-600 transition-all duration-200 rounded-full px-4 py-3 md:py-2 md:rounded-md"
            placeholder="Type a message..."
          />
          <Button 
            onClick={() => sendmsg(selectedUser?._id)}
            disabled={!textMessage.trim()}
            className="px-6 py-3 md:py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200 rounded-full md:rounded-md active:scale-95"
          >
            Send
          </Button>
        </div>
      </section>
    ) : (
      <div className="hidden md:flex flex-col items-center justify-center mx-auto text-center">
        <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 shadow-sm">
          <MessageCircleCode className="w-24 h-24 my-4 mx-auto text-blue-500" />
          <h1 className="font-bold text-2xl text-gray-900 mb-2">Your messages</h1>
          <span className="text-gray-600">Select a conversation to start messaging</span>
        </div>
      </div>
    )}
  </div>
);
};

export default ChatPage;