import { configureStore } from "@reduxjs/toolkit";
import textReducer from "./slice/textSlice";
import drawerReducer from "./slice/drawerSlice";

const store = configureStore({
  reducer: {
    text: textReducer,
    drawer: drawerReducer,
  },
});

export default store;
