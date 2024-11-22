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
  //NAME THAT WILL BE USED IN ACTION.TYPE (AUTOMATICALLY B.T.S)
  name: "text",
  //INITIAL STATE
  initialState,
  //REDUCER FUNCTIONS THE ONE USED IN SWITCH CASE
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
//SELECTORS
export const selectText = (state) => state.text.text;
export const selectIsProcessing = (state) => state.text.isProcessing;
export const selectIsDownloading = (state) => state.text.isDownloading;
export const selectPdfFileName = (state) => state.text.pdfFileName;
export const selectCount = (state) => state.text.count;
export const selectError = (state) => state.text.error;
//ACTIONS
export const {
  setText,
  setIsProcessing,
  setIsDownloading,
  setPdfFileName,

  setCount,
  setError,
} = textSlice.actions;
//REDUCER
export default textSlice.reducer;
