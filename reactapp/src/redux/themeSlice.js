import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isDark: false,
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    changeTheme: (state, action) => {
      state.isDark = !state.isDark;
      state.isDark
        ? localStorage.setItem("theme", "dark")
        : localStorage.setItem("theme", "light");
    },
    setTheme: (state, action) => {
      action.payload === "dark"
        ? (state.isDark = true)
        : (state.isDark = false);
    },
  },
});

export const { changeTheme, setTheme } = themeSlice.actions;

export default themeSlice.reducer;
