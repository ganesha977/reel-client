import { createSlice } from "@reduxjs/toolkit";

const messageNotificationSlice = createSlice({
  name: "messageNotification",
  initialState: {
    messageNotification: [],
  },
  reducers: {
    setMessageNotification: (state, action) => {
      const { userId } = action.payload;

      const exists = state.messageNotification.some(
        (item) => item.userId === userId
      );

      if (!exists) {
        state.messageNotification.push(action.payload);
      }
    },

    removeMessageNotification: (state, action) => {
      const userId = action.payload;
      state.messageNotification = state.messageNotification.filter(
        (item) => item.userId !== userId
      );
    },

    clearMessageNotifications: (state) => {
      state.messageNotification = [];
    },
  },
});

export const {
  setMessageNotification,
  removeMessageNotification,
  clearMessageNotifications,
} = messageNotificationSlice.actions;

export default messageNotificationSlice.reducer;
