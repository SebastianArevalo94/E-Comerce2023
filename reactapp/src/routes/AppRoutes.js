import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import AdminValidation from "./validations/AdminValidation";
import DashboardRoutes from "./DashboardRoutes";
import AdminRoutes from "./AdminRoutes";
import AuthValidation from "./validations/AuthValidation";

const AppRoutes = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/*"
          element={
            <AuthValidation>
              <DashboardRoutes />
            </AuthValidation>
          }
        />
        <Route
          path="/admin/*"
          element={
            <AdminValidation>
              <AdminRoutes />
            </AdminValidation>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
