import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"; // ensure this path is correct

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;
