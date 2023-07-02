import { createSlice } from "@reduxjs/toolkit";
import { addCuantityLS, addItemLS, cleanLS, editItemsLS, substractCuantityLS } from "../components/helpers/localStorage";

const initialState = {
    shopCart: [],
};

export const shopCartSlice = createSlice({
    name: "shopCart",
    initialState,
    reducers: {
        addItem: (state, action) => {
            const itemFind = state.shopCart.find(
                (item) => item.id === action.payload.id
            );
            if (!itemFind) {
                state.shopCart.push(action.payload);
                addItemLS(action.payload);
            };
        },
        addCuantity: (state, action) => {
            const productInCart = state.shopCart.find(
                (item) => item.id === action.payload
            );
            productInCart.unidades += 1
            addCuantityLS(action.payload)
        },
        substractCuantity: (state, action) => {
            const productInCart = state.shopCart.find(
                (item) => item.id === action.payload
            );
            if (productInCart.unidades >= 2) {
                productInCart.unidades -= 1
            }
            substractCuantityLS(action.payload)
        },
        setItems: (state, action) => {
            state.shopCart = action.payload;
        },
        deleteOne: (state, action) => {
            const itemFind = state.shopCart.find((item) => item.id === action.payload);
            const toLS = state.shopCart.filter(item => item.id !== action.payload);
            if (itemFind) {
                state.shopCart.splice(state.shopCart.indexOf(itemFind), 1);
                editItemsLS(toLS);
            };
        },
        deleteAll: (state, action) => {
            state.shopCart = [];
            cleanLS();
        },
    },
});

export const { addItem, setItems, deleteAll, deleteOne, addCuantity, substractCuantity } =
    shopCartSlice.actions;

export default shopCartSlice.reducer;