import { Navigate } from "react-router-dom";
import { useCryptoLocalStorage } from "../utils/hooks/useCryptoLocalStorage";
import Cookies from "js-cookie";

const isAuthenticated = () => {
  const token = useCryptoLocalStorage("user_Data", "get");
  const isLogin = useCryptoLocalStorage("user_Data", "get", "IsLogin");
  // const token = Cookies.get(".AspNetCore.Cookies");
  
  // if (!isLogin) {
  //   localStorage.clear();
  // }

  return token && isLogin;
};

const Authenticated = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/dashboard" replace />;
};

export default Authenticated;
