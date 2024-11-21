import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  text: "",
  isProcessing: false,
};
const textSlice = createSlice({
  name: "text",
});
