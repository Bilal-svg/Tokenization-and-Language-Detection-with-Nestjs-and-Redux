import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  selectedText: "",
  selectedCount: 0,
  refresh: false,
};
const drawerSlice = createSlice({
  name: "drawer",
  initialState,
  reducers: {
    onSelect: (state, action) => {
      state.selectedText = action.payload.text;
      state.selectedCount = action.payload.count;
    },
    triggerRefresh: (state) => {
      state.refresh = !state.refresh; // Toggle refresh state
    },
  },
});
//SELECTORS
export const getSelectedText = (state) => state.drawer.selectedText;
export const getSelectedCount = (state) => state.drawer.selectedCount;
export const getRefreshState = (state) => state.drawer.refresh;

//ACTION
export const { onSelect, triggerRefresh } = drawerSlice.actions;
//REDUCER
export default drawerSlice.reducer;
