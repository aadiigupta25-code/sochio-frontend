import React from "react";

//redux
import { Outlet } from "react-router-dom";
import Login from "../Component/Pages/Login";

const AuthRoute = () => {
  const isAuth = sessionStorage.getItem("isAuth");
  const token = sessionStorage.getItem("token");

  return token && isAuth ? <Outlet /> : <Login />;
};

export default AuthRoute;
