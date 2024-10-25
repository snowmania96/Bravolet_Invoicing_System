import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
  const auth = useSelector((state) => state.global.isAuth);
  return auth ? <Outlet /> : <Navigate to="/signin" />;
}
