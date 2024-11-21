import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedText: "",
  selectedCount: 0,
};

const drawerSlice = createSlice({
  name: "drawer",
  initialState,
  reducers: {
    onSelect: (state, action) => {
      state.selectedText = action.payload.text;
      state.selectedCount = action.payload.count;
    },
  },
});

//SELECTORS
export const getSelectedText = (state) => state.drawer.selectedText;
export const getSelectedCount = (state) => state.drawer.selectedCount;

//ACTION
export const { onSelect } = drawerSlice.actions;

//REDUCER
export default drawerSlice.reducer;
