import { createSlice } from "@reduxjs/toolkit";
import { getAllAsync, getByCategoryAsync, getByName } from "./async-redux";

const initialState = {
    products: [],
};

const sortArray = (array, type) => {
    let toSort = [...array];
    if (type === "Alfabeticamente [A-Z]") {
        toSort.sort((a, b) => {
            let fa = a.nombre.toLowerCase(),
                fb = b.nombre.toLowerCase();

            if (fa < fb) {
                return -1;
            }
            if (fa > fb) {
                return 1;
            }
            return 0;
        });
    } else if (type === "Alfabeticamente [Z-A]") {
        toSort.sort((a, b) => {
            let fa = a.nombre.toLowerCase(),
                fb = b.nombre.toLowerCase();
            if (fa > fb) {
                return -1;
            }
            if (fa < fb) {
                return 1;
            }
            return 0;
        });
    } else if (type === "Precio mayor a menor") {
        toSort.sort((a, b) => {
            return b.precio - a.precio;
        });
    } else if (type === "Precio menor a mayor") {
        toSort.sort((a, b) => {
            return a.precio - b.precio;
        });
    }
    return toSort;
};

export const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        sortProducts: (state, action) => {
            const { type, array } = action.payload;
            state.products = sortArray(array, type);
        },
        setProducts: (state, action) => {
            const { data } = action.payload;
            state.products = data;
        }
    },
    extraReducers: {
        [getAllAsync.fulfilled]: (state, action) => {
            state.products = action.payload.response;
        },
        [getAllAsync.rejected]: (state) => {
            state.products = [];
        },
        [getByCategoryAsync.fulfilled]: (state, action) => {
            state.products = action.payload.response;
        },
        [getByCategoryAsync.rejected]: (state) => {
            state.products = [];
        },
        [getByName.rejected]: (state, action) => {
            state.products = [];
        },
    },
});

export const { getAll, sortProducts, setProducts } = productSlice.actions;

export default productSlice.reducer;
