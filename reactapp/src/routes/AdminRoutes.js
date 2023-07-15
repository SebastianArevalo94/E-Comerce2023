import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Admin from "../components/admin/Admin";
import ProductList from "../components/admin/Products/ProductList";
import ProductForm from "../components/admin/Products/ProductForm";
import UsersList from "../components/admin/Users/UsersList";
import UserForm from "../components/admin/Users/UserForm";
import NavBar from "../components/utils/NavBar";
import Category from "../components/admin/Categorias/Category";
import CategoryForm from "../components/admin/Categorias/CategoryForm";
import UsersActivity from "../components/admin/UsersActivity";

const AdminRoutes = () => {
    return (
        <>
            <NavBar />
            <Routes>
                <Route index element={<Admin />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/products/add" element={<ProductForm />} />
                <Route path="/users" element={<UsersList />} />
                <Route path="/users/add" element={<UserForm />} />
                <Route path="/category" element={<Category />} />
                <Route path="/category/add" element={<CategoryForm />} />
                <Route path="/users-activity" element={<UsersActivity />} />
                <Route path="*" element={<Navigate to="/admin" />} />
            </Routes>
        </>
    );
};

export default AdminRoutes;
