import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: "",
  isAuth: false,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setAuth: (state, action) => {
      state.isAuth = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setMode, setAuth, setUser } = globalSlice.actions;

export default globalSlice.reducer;
