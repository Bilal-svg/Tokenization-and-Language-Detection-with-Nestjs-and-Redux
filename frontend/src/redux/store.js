import { configureStore } from "@reduxjs/toolkit";
import textReducer from "./reducers/appReducer";

const store = configureStore({
  reducer: {
    text: textReducer,
  },
});

export default store;
