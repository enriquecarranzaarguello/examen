import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  couponCode: {
    code: '',
    budget: 0,
    percent: 0,
  },
  helpCenter: {
    categories: [],
    selectedCategory: {
      category: '',
      videos: [],
    },
    selectedVideo: {
      player_embed_url: '',
      description: '',
      name: '',
    },
    marketingTotal: 0,
    couponTotal: 0,
  },
  academy: {
    courses: [],
    categories: [],
    selectedVideo: {
      player_embed_url: '',
      description: '',
      name: '',
    },
  },
};

export const marketingSlice = createSlice({
  name: 'marketing',
  initialState,
  reducers: {
    setCouponCode: (state, action) => {
      state.couponCode = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.helpCenter.selectedCategory = action.payload;
    },
    setSelectedVideo: (state, action) => {
      state.helpCenter.selectedVideo = action.payload;
    },
    setMarketingTotalRedo: (state, action) => {
      state.helpCenter.marketingTotal = action.payload;
    },
    setCouponTotal: (state, action) => {
      state.helpCenter.couponTotal = action.payload;
    },
    setAvailableCourses: (state, action) => {
      state.academy.courses = action.payload;
    },
    setSelectedAcademyVideo: (state, action) => {
      state.academy.selectedVideo = action.payload;
    },
  },
});

export const {
  setCouponCode,
  setSelectedCategory,
  setSelectedVideo,
  setMarketingTotalRedo,
  setCouponTotal,
  setAvailableCourses,
  setSelectedAcademyVideo,
} = marketingSlice.actions;

export default marketingSlice.reducer;
