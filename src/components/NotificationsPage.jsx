import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearLikeNotifications } from "@/redux/rtnSlice";
import {
  clearMessageNotifications,
  removeMessageNotification,
} from "@/redux/messageNotificationSlice";
import {
  clearCommentNotifications,
  removeCommentNotification,
} from "@/redux/commentSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

const NotificationsPage = () => {
  const dispatch = useDispatch();

  // ✅ Correct selectors
  const { likeNotification } = useSelector((state) => state.realTimeNotification);
  const { messageNotification } = useSelector((state) => state.messageNotification);
  const { commentNotification } = useSelector((state) => state.commentNotification);

  // Local state for notifications
  const [localLikes, setLocalLikes] = useState([]);
  const [localMessages, setLocalMessages] = useState([]);
  const [localComments, setLocalComments] = useState([]);

  // Sync Redux state with local state
  useEffect(() => {
    setLocalLikes(likeNotification || []);
    setLocalMessages(messageNotification || []);
    setLocalComments(commentNotification || []); // ✅ fixed here
  }, [likeNotification, messageNotification, commentNotification]);

  // Clear message notifications on mount
  useEffect(() => {
    dispatch(clearMessageNotifications());
  }, [dispatch]);

  // Handlers for different notification types
  const handleLikeClick = (userId) => {
    const updated = localLikes.filter((n) => n.userId !== userId);
    setLocalLikes(updated);
    dispatch(clearLikeNotifications());
  };

  const handleMessageClick = (userId) => {
    const updated = localMessages.filter((n) => n.userId !== userId);
    setLocalMessages(updated);
    dispatch(removeMessageNotification(userId));
  };

  const handleCommentClick = (notificationId) => {
    const updated = localComments.filter((n) => n.notificationId !== notificationId);
    setLocalComments(updated);
    dispatch(removeCommentNotification(notificationId));
  };

  const handleClearAllComments = () => {
    setLocalComments([]);
    dispatch(clearCommentNotifications());
  };

  // Helper function to render notification items
  const renderNotificationItem = (notification, type) => {
    const isComment = type === "comment";
    const isMessage = type === "message";
    const isLike = type === "like";

    const handleClick = () => {
      if (isComment) return handleCommentClick(notification.notificationId);
      if (isMessage) return handleMessageClick(notification.userId);
      if (isLike) return handleLikeClick(notification.userId);
    };

    return (
      <div
        key={`${type}-${notification.notificationId || notification.userId}`}
        className="bg-white border rounded-xl shadow-sm p-4 flex items-center gap-4 mb-4 hover:shadow-md transition cursor-pointer"
        onClick={handleClick}
      >
        <Avatar className="w-12 h-12">
          <AvatarImage src={notification?.userDetails?.profilePicture} />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm text-gray-900">
            <span className="font-semibold">
              {notification.userDetails?.username}
            </span>{" "}
            {isComment && `commented: "${notification.message}"`}
            {isMessage && "sent you a message"}
            {isLike && "liked your post"}
          </p>
          <p className="text-xs text-gray-500">
            {formatDistanceToNow(
              new Date(notification.createdAt || new Date()),
              { addSuffix: true }
            )}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4 ml-7 sm:px-6 md:px-8 lg:pl-72 lg:pr-16">
      <h2 className="text-3xl font-bold mb-2 text-gray-900">Notifications</h2>
      <p className="text-gray-600 mb-6 text-sm">Stay updated with your activity</p>

      {/* Likes Section */}
      {localLikes.length > 0 && (
        <div className="mb-10">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
            Likes
          </h3>
          {localLikes.map((notification) => renderNotificationItem(notification, "like"))}
        </div>
      )}

      {/* Comments Section */}
      {localComments.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Comments
            </h3>
            <button
              className="text-sm text-red-500 hover:underline"
              onClick={handleClearAllComments}
            >
              Clear All
            </button>
          </div>
          {localComments.map((notification) => renderNotificationItem(notification, "comment"))}
        </div>
      )}

      {/* Messages Section */}
      {localMessages.length > 0 && (
        <div className="mb-10">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
            Messages
          </h3>
          {localMessages.map((notification) => renderNotificationItem(notification, "message"))}
        </div>
      )}

      {/* Empty State */}
      {localLikes.length === 0 &&
        localMessages.length === 0 &&
        localComments.length === 0 && (
          <p className="text-sm text-gray-500 mt-10">No new notifications.</p>
        )}
    </div>
  );
};

export default NotificationsPage;
