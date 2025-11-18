import "./App.css";
import Login from "./Component/Pages/Login.js";

import Admin from "./Component/Pages/Admin";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { LOGIN_ADMIN } from "./Component/store/admin/admin.type";
import { setToken } from "./util/setAuth";
import AuthRoute from "./util/AuthRoute";
import Registration from "./Component/Pages/Registration.js";
import UpdateCode from "./Component/Pages/UpdateCode.js";
import axios from "axios";
import ForgotPassword from "./Component/Pages/ForgetPassword.js";
import ChangePassword from "./Component/Pages/ChangePassword.js";

function App() {
  const dispatch = useDispatch();
  const key = sessionStorage.getItem("key");
  const token = sessionStorage.getItem("token");
  const [login, setLogin] = useState(false);

  const sessionTimeout = 20 * 60 * 1000; // 5 minutes in milliseconds
  let activityTimeout;

  const resetTimeout = useCallback(() => {
    if (activityTimeout) clearTimeout(activityTimeout);
    activityTimeout = setTimeout(() => {
      window.sessionStorage.clear();
      window.sessionStorage.clear();
      window.location.href = "/";
    }, sessionTimeout);
  }, [activityTimeout, sessionTimeout]);

  const handleActivity = () => {
    resetTimeout();
  };

  useEffect(() => {
    axios
      .get("/login")
      .then((res) => {
        setLogin(res.data.login);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (!token && !key) return;
    dispatch({ type: LOGIN_ADMIN, payload: token });
  }, [setToken, key]);

  useEffect(() => {
    // Set initial timeout
    resetTimeout();

    // Add event listeners to track user activity
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      if (activityTimeout) clearTimeout(activityTimeout);
    };
  }, [resetTimeout]);

  axios.interceptors.response.use(
    (response) => {
      return response; // If the request succeeds, just return the response
    },
    (error) => {
      return Promise.reject(error); // For other errors, reject the promise
    }
  );

  return (
    <div className="App">
      <Routes>
        {login === true && <Route path="/" element={<Login />} />}
        {login === false && <Route path="/" element={<Registration />} />}
        {login && <Route path="/adminLogin" element={<Login />} />}
        {login && <Route path="/code" element={<UpdateCode />} />}
        <Route path="/adminLogin" element={<Login />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/changePassword" element={<ChangePassword />} />
        <Route element={<AuthRoute />}>
          <Route path="/admin/*" element={<Admin />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
