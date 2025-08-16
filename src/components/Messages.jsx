import React, { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import useGetAllMessage from "@/hooks/useGetAllMessage";
import useGetRTM from "@/hooks/useGetRTM";
import moment from "moment";

const Messages = ({ selectedUser, isTyping }) => {
  useGetRTM();
  useGetAllMessage();

  const { messages } = useSelector((s) => s.chat);
  const { user } = useSelector((s) => s.auth);
  const messagesEndRef = useRef();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  let lastDate = null;

  return (
   <div className="flex flex-col flex-grow min-h-0 overflow-hidden">
  <div className="overflow-y-auto p-3 space-y-4 flex-grow">

        <div className="flex justify-center">
          <div className="flex flex-col items-center">
            <Avatar className="h-14 w-14 md:h-16 md:w-16">
              <AvatarImage src={selectedUser?.profilePicture} />
              <AvatarFallback>Fn</AvatarFallback>
            </Avatar>
            <span className="mt-2 text-sm">{selectedUser?.username}</span>
            <Link to={`/profile/${selectedUser?._id}`}>
              <Button className="h-7 my-2 text-xs px-3" variant="secondary">
                view profile
              </Button>
            </Link>
          </div>
        </div>

        {isTyping && (
          <div className="text-center text-sm text-gray-400 italic">
            Typing...
          </div>
        )}

        <div className="flex flex-col gap-2">
          {messages.map((m) => {
            const date = moment(m.createdAt).format("YYYY-MM-DD");
            const showDate =
              !lastDate || lastDate !== date
                ? moment(m.createdAt).calendar(null, {
                    sameDay: "[Today]",
                    lastDay: "[Yesterday]",
                    lastWeek: "dddd",
                    sameElse: "DD MMM YYYY",
                  })
                : null;
            lastDate = date;

            const isSender = m.senderId === user._id;

            return (
              <React.Fragment key={m._id}>
                {showDate && (
                  <div className="text-center text-xs text-gray-500 my-2">
                    {showDate}
                  </div>
                )}
                <div className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
                  <div className="flex flex-col max-w-[280px]">
                    <div
                      className={`p-2 rounded-lg break-words text-sm ${
                        isSender ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                      }`}
                    >
                      {m.message}
                    </div>
                    <div
                      className={`text-[10px] mt-1 ${
                        isSender ? "text-right text-gray-300" : "text-left text-gray-500"
                      }`}
                    >
                      {moment(m.createdAt).format("hh:mm A")}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default Messages;