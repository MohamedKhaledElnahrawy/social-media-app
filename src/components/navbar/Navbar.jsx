import React, { useContext } from "react";
import {
  Navbar as NavbarHero,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@heroui/react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { LayoutGrid, User, Settings, LogOut, Users } from "lucide-react";

// *****************************************************************************

export default function Navbar() {
  const { isLogedIn, setIsLogedIn, setUserData, userData } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // *****************************************************************************

  function logOut() {
    localStorage.removeItem("token");
    setIsLogedIn(false);
    setUserData(null);
    navigate("/login");
  }

  // *****************************************************************************

  return (
    <NavbarHero
      maxWidth="full"
      className="border-b border-gray-100 shadow-sm h-20 bg-white/70 backdrop-blur-md"
      position="sticky"
    >
      {/* Logo */}
      <NavbarBrand>
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-[#003580] w-10 h-10 flex items-center justify-center rounded-xl shadow-lg shadow-blue-900/20 group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-xl tracking-tighter">
              A
            </span>
          </div>

          <div className="flex flex-col ml-1  sm:flex">
            <p className="font-black text-[#003580] text-xl tracking-tighter leading-none">
              AURA
            </p>
            <span className="text-[10px] font-bold text-blue-600 tracking-[0.2em] leading-none mt-1">
              SOCIAL
            </span>
          </div>
        </Link>
      </NavbarBrand>

      <NavbarContent className="hidden lg:flex" justify="center">
        <div className="flex gap-2 bg-[#F8F9FA] p-1.5 rounded-full border border-gray-100">
          <NavbarItem>
            <Link
              to="/"
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all ${
                location.pathname === "/"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-blue-500"
              }`}
            >
              <LayoutGrid size={18} /> Feed
            </Link>
          </NavbarItem>

          <NavbarItem>
            <Link
              to="/profilepage"
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all ${
                location.pathname === "/profilepage"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-blue-500"
              }`}
            >
              <User size={18} /> Profile
            </Link>
          </NavbarItem>
        </div>
      </NavbarContent>

      {/* User Actions & Dropdown */}
      <NavbarContent justify="end">
        {isLogedIn ? (
          <Dropdown
            placement="bottom-end"
            className="rounded-2xl border border-gray-100 shadow-xl overflow-hidden"
          >
            <DropdownTrigger>
              <div className="flex items-center gap-3 bg-[#F8F9FA] p-1.5 pr-4 rounded-full cursor-pointer hover:bg-gray-100 transition-all border border-gray-100">
                <Avatar
                  src={userData?.photo}
                  className="w-9 h-9 border-2 border-white shadow-sm"
                  radius="full"
                />
                <div className=" flex max-w-20 md:max-w-none">
                  <span className="text-sm font-bold text-[#1B2733] leading-none truncate">
                    {userData?.name}
                  </span>
                </div>
                {/* profile trigger */}
                <div className="flex flex-col gap-0.5 ml-1">
                  <div className="w-3.5 h-0.5 bg-slate-400 rounded-full"></div>
                  <div className="w-3.5 h-0.5 bg-slate-400 rounded-full"></div>
                  <div className="w-3.5 h-0.5 bg-slate-400 rounded-full"></div>
                </div>
              </div>
            </DropdownTrigger>

            {/* *************************************************************************************/}

            <DropdownMenu
              aria-label="Profile Actions"
              variant="flat"
              className="p-2"
            >
              <DropdownItem
                key="feed"
                startContent={
                  <LayoutGrid size={18} className="text-blue-500" />
                }
                onPress={() => navigate("/")}
                className="rounded-xl h-11 lg:hidden"
              >
                Feed
              </DropdownItem>

              <DropdownItem
                key="profile"
                startContent={<User size={18} className="text-blue-500" />}
                onPress={() => navigate("/profilepage")}
                className="rounded-xl h-11"
              >
                My Profile
              </DropdownItem>

              <DropdownItem
                key="followers"
                startContent={<Users size={18} className="text-orange-500" />}
                onPress={() => navigate("/followers")}
                className="rounded-xl h-11 lg:hidden"
              >
                Suggested Friends
              </DropdownItem>

              <DropdownItem
                key="settings"
                startContent={<Settings size={18} className="text-slate-500" />}
                onPress={() => navigate("/settingpage")}
                className="rounded-xl h-11 border-t border-gray-50 mt-1 pt-2"
              >
                Settings
              </DropdownItem>

              <DropdownItem
                key="logout"
                className="text-danger rounded-xl h-11"
                color="danger"
                startContent={<LogOut size={18} />}
                onPress={logOut}
              >
                Logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <Button
            as={Link}
            to="/login"
            className="bg-[#003580] text-white rounded-full font-bold px-8 shadow-md"
          >
            Login
          </Button>
        )}
      </NavbarContent>
    </NavbarHero>
  );
}
