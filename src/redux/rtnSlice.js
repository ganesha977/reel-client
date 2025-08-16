import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
  name: "realTimeNotification",
  initialState: {
    likeNotification: [], // initialize as array
  },
  reducers: {
    setLikeNotification: (state, action) => {
      const { type, userId } = action.payload;

      if (!Array.isArray(state.likeNotification)) {
        state.likeNotification = [];
      }

      if (type === "like") {
        state.likeNotification = [...state.likeNotification, action.payload];
      } else if (type === "dislike") {
        state.likeNotification = state.likeNotification.filter(
          (item) => item.userId !== userId
        );
      }
    },

    clearLikeNotifications: (state) => {
      state.likeNotification = [];
    },
  },
});

export const { setLikeNotification, clearLikeNotifications } = rtnSlice.actions;
export default rtnSlice.reducer;
