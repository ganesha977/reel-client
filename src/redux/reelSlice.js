import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reels: [],
  selectedReel: null
};

const reelSlice = createSlice({
  name: "reel",
  initialState,
  reducers: {
    setReels: (state, action) => {
      state.reels = action.payload;
    },
    setSelectedReel: (state, action) => {
      state.selectedReel = action.payload;
    },
  }
});

export const { setReels, setSelectedReel } = reelSlice.actions;
export default reelSlice.reducer;
