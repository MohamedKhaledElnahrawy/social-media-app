import React from "react";
import Navbar from "./../components/navbar/Navbar";
import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop"; 

export default function MainLayout() {
  return (
    <div className="bg-blue-200">
      <ScrollToTop /> 
      <Navbar />
      <div className="   min-h-screen pb-10">
        <Outlet />
      </div>
    </div>
  );
}
