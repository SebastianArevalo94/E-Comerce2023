import { createSlice } from "@reduxjs/toolkit";
import { GetAllCategories } from "./async-redux";

const initialState = {
    categories: [],
};

export const categorySlice = createSlice({
    name: "categories",
    initialState,
    reducers: {
        setCategories: (state, action) => {
            const { data } = action.payload;
            state.categories = data;
        }
    },
    extraReducers: {
        [GetAllCategories.fulfilled]: (state, action) => {
            state.categories = action.payload.response;
        },
        [GetAllCategories.rejected]: (state) => {
            state.products = [];
        },
    },
});

export const { GetAll, setCategories } = categorySlice.actions;

export default categorySlice.reducer;
