import { configureStore } from "@reduxjs/toolkit";
import textReducer from "./slice/textSlice";
import drawerReducer from "./slice/drawerSlice";
import authReducer from "./slice/authSlice";

export const store = configureStore({
  reducer: {
    text: textReducer,
    auth: authReducer,
    drawer: drawerReducer,
  },
});
export default store;
