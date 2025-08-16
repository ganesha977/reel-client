import { createSlice } from "@reduxjs/toolkit";

const commentSlice = createSlice({
  name: "commentNotification",
  initialState: {
    commentNotification: [],
  },
  reducers: {
    setCommentNotification: (state, action) => {
      const { notificationId } = action.payload;

      if (!Array.isArray(state.commentNotification)) {
        state.commentNotification = [];
      }

      // Always push new comment notifications
      state.commentNotification = [
        ...state.commentNotification,
        action.payload,
      ];
    },

    clearCommentNotifications: (state) => {
      state.commentNotification = [];
    },

    removeCommentNotification: (state, action) => {
      state.commentNotification = state.commentNotification.filter(
        (n) => n.notificationId !== action.payload
      );
    },
  },
});

// ✅ Export actions
export const {
  setCommentNotification,
  clearCommentNotifications,
  removeCommentNotification,
} = commentSlice.actions;

// ✅ Export reducer
export default commentSlice.reducer;
