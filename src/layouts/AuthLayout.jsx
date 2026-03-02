import React from "react";
import Navbar from "../components/navbar/Navbar";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div>
<div className="bg-sky-50 min-h-screen">


      <Outlet />
</div>

    </div>
  );
}
