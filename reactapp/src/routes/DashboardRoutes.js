import Main from "../components/dashboard/Main";
import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import ShopCart from "../components/dashboard/ShopCart";
import Profile from "../components/dashboard/Profile";
import AdminCreditCards from "../components/dashboard/AdminCreditCards";
import NavBar from "../components/utils/NavBar";
import Payment from "../components/dashboard/Payment";
import LogActivity from "../components/dashboard/RegistroActividad";
import "../css.css";
import HistorialComras from "../components/dashboard/HistorialCompras";

const DashboardRoutes = () => {
    return (
        <>
            <NavBar />
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/shopcart" element={<ShopCart />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/adminCC" element={<AdminCreditCards />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/log-activity" element={<LogActivity />} />
                <Route path="/historial-compras" element={<HistorialComras />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
};

export default DashboardRoutes;
