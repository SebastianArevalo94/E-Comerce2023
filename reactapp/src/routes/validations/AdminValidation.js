import { Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

const AdminValidation = ({ children }) => {
  const hasAccess = () => {
    const token = localStorage.getItem("token");
    const payload = jwt_decode(token);
    return payload.rol === "1"
  };
  return hasAccess() ? children : <Navigate to="/" />;
};

export default AdminValidation;
