import jwt_decode from "jwt-decode";

const isAdmin = () => {
  const token = localStorage.getItem("token");
  const payload = jwt_decode(token);
  return payload.rol === "1" ? true : false;
};

export default isAdmin 
