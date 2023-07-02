import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: {},
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserRedux: (state, action) => {
            state.user = action.payload;
        }
    },
});

export const { setUserRedux } =
    userSlice.actions;

export default userSlice.reducer;