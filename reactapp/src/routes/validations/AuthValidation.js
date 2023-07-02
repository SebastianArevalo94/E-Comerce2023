import { Navigate } from "react-router-dom";

const AuthRoutes = ({ children }) => {
  let hasToken = localStorage.getItem("token") ? true : false;
  return hasToken ? children : <Navigate to="/login" />;
};

export default AuthRoutes
