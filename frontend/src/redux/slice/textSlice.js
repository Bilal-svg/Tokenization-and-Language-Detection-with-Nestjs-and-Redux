// src/redux/slice/textSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  text: "",
  isProcessing: false,
  isDownloading: false,
  pdfFileName: "",
  count: null,
  error: null,
};

const textSlice = createSlice({
  name: "text",
  initialState,
  reducers: {
    setText: (state, action) => {
      state.text = action.payload;
    },
    setIsProcessing: (state, action) => {
      state.isProcessing = action.payload;
    },
    setIsDownloading: (state, action) => {
      state.isDownloading = action.payload;
    },
    setPdfFileName: (state, action) => {
      state.pdfFileName = action.payload;
    },
    setCount: (state, action) => {
      state.count = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

// Selectors
export const selectText = (state) => state.text.text;
export const selectIsProcessing = (state) => state.text.isProcessing;
export const selectIsDownloading = (state) => state.text.isDownloading;
export const selectPdfFileName = (state) => state.text.pdfFileName;
export const selectCount = (state) => state.text.count; // Ensure this exists
export const selectError = (state) => state.text.error;

// Actions
export const {
  setText,
  setIsProcessing,
  setIsDownloading,
  setPdfFileName,
  setCount,
  setError,
} = textSlice.actions;

// Reducer
export default textSlice.reducer;
