import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,               // will include reels, bookmarkedReels, etc.
    suggestedUsers: [],
    userProfile: null,
    selectedUser: null,
    error: null,
    isLoading: false,
  },
  reducers: {
    setAuthUser: (state, action) => {
      // Must contain reels, bookmarkedReels from backend
      state.user = action.payload;
    },
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload;
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    updateUserReels: (state, action) => {
      // optional if you want to update only reels later
      if (state.user) {
        state.user.reels = action.payload;
      }
    },
    updateBookmarkedReels: (state, action) => {
      // optional: update bookmarks without full user update
      if (state.user) {
        state.user.bookmarkedReels = action.payload;
      }
    },
  },
});

export const {
  setAuthUser,
  setSuggestedUsers,
  setUserProfile,
  setSelectedUser,
  updateUserReels,
  updateBookmarkedReels,
} = authSlice.actions;

export default authSlice.reducer;
