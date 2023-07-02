import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./productSlice";
import shopCartSlice from "./shopCartSlice";
import userSlice from "./userSlice";
import categorySlice from "./categorySlice";
import themeSlice from "./themeSlice";

export default configureStore({
    reducer: {
        products: productSlice,
        categories: categorySlice,
        shopCart: shopCartSlice,
        user: userSlice,
        theme: themeSlice
    },
});
