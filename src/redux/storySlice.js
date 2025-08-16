import { createSlice } from "@reduxjs/toolkit";

const storySlice = createSlice({
  name: "story",
  initialState: {
    stories: [],            // All fetched stories (user + following)
    userStories: [],        // Stories specific to one profile
    isLoading: false,
    error: null
  },
  reducers: {
    setStories: (state, action) => {
      state.stories = action.payload;
    },
    setUserStories: (state, action) => {
      state.userStories = action.payload;
    },
    setStoryLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setStoryError: (state, action) => {
      state.error = action.payload;
    },
    clearStories: (state) => {
      state.stories = [];
      state.userStories = [];
    }
  }
});

export const {
  setStories,
  setUserStories,
  setStoryLoading,
  setStoryError,
  clearStories
} = storySlice.actions;

export default storySlice.reducer;
