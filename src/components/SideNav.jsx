import { Link, NavLink, useLocation } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button, IconButton, Typography } from "@material-tailwind/react";
import { useEffect, useRef } from "react";
import image from "../assets/logo.jpg";
import { MdDashboard, MdOutlineWebhook } from "react-icons/md";
import { MdClass } from "react-icons/md";
import { FaUserGroup } from "react-icons/fa6";
import { FaRegUserCircle } from "react-icons/fa";
import { FaCodePullRequest } from "react-icons/fa6";
import { GrStorage, GrTasks } from "react-icons/gr";
import { PiDownloadSimpleBold } from "react-icons/pi";
import { GrUserSettings } from "react-icons/gr";
import { Upgrade } from "./common/Upgrade";

const SideNav = ({ openSideNav, setOpenSideNav }) => {
  const sidenavRef = useRef(null);
  const { pathname } = useLocation();

  // Hardcoded sidenavType to "dark"
  const sidenavType = "dark";

  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg shadow-blue-900",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };
  const isMenuItemAllowed = (url) => {
    const pageControl = JSON.parse(localStorage.getItem("pageControl") || "[]");
    const userTypeId = localStorage.getItem("user_type_id");

    const routeData = pageControl.find((route) => route.url === url);
    if (!routeData) return false;

    const allowedUsers = routeData.usertype.split(",").map((id) => id.trim());
    return allowedUsers.includes(userTypeId) && routeData.status === "Active";
  };

  // Menu items configuration
  const menuItems = [
    { path: "/home", icon: MdDashboard, label: "Dashboard" },
    { path: "/master-list", icon: FaUserGroup, label: "Master" },
    { path: "/purchase", icon: FaRegUserCircle, label: "Stock" },
    { path: "/donor-list", icon: MdClass, label: "Donor" },
    { path: "/cashrecepit", icon: FaCodePullRequest, label: "Receipts" },
    { path: "/webdonation", icon: MdOutlineWebhook, label: "Website Donation" },
    { path: "/stock-summary", icon: GrTasks, label: "Reports" },
    { path: "/donor", icon: PiDownloadSimpleBold, label: "Download" },
    {
      path: "/animalStock",
      icon: GrStorage,
      label: "Animal Stock",
    },
    { path: "/userManagement", icon: GrUserSettings, label: "User Management" },
  ];
  // close sidebar when clicking outside

  useEffect(() => {
    function handClickOutside(e) {
      if (sidenavRef.current && !sidenavRef.current.contains(e.target)) {
        setOpenSideNav(false);
      }
    }

    document.addEventListener("mousedown", handClickOutside);
    return () => {
      document.removeEventListener("mousedown", handClickOutside);
    };
  }, [setOpenSideNav]);

  // Close sidebar on route change
  useEffect(() => {
    setOpenSideNav(false);
  }, [pathname, setOpenSideNav]);

  return (
    // <aside
    //   ref={sidenavRef}
    //   className={`${sidenavTypes[sidenavType]} ${
    //     openSideNav ? "translate-x-0" : "-translate-x-80"
    //   } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-[272px] rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100 overflow-y-auto`}
    // >
    //   <div className={`relative`}>
    //     <Link to="/home" className="flex items-center justify-center p-4">
    //       <div className="flex items-center text-white mt-4">
    //         <div className="bg-white p-2 rounded-md">
    //           <img src={image} alt="Logo" className="h-12 w-auto" />
    //         </div>{" "}
    //       </div>
    //     </Link>
    //     <IconButton
    //       variant="text"
    //       color="white"
    //       size="sm"
    //       ripple={false}
    //       className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
    //       onClick={() => setOpenSideNav(false)}
    //     >
    //       <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
    //     </IconButton>
    //   </div>

    //   <div className="m-4">
    //     <ul className="mb-4 flex flex-col ">
    //       {menuItems.map(
    //         (item, index) =>
    //           isMenuItemAllowed(item.path) && (
    //             <li key={index}>
    //               <NavLink to={item.path}>
    //                 {({ isActive }) => (
    //                   <Button
    //                     variant={isActive ? "gradient" : "text"}
    //                     color="white"
    //                     className="flex items-center gap-4 px-4 capitalize"
    //                     fullWidth
    //                   >
    //                     <item.icon className="w-5 h-5 text-inherit" />
    //                     <Typography
    //                       color="inherit"
    //                       className="font-medium capitalize"
    //                     >
    //                       {item.label}
    //                     </Typography>
    //                   </Button>
    //                 )}
    //               </NavLink>
    //             </li>
    //           )
    //       )}
    //     </ul>
    //     <Upgrade />
    //   </div>
    // </aside>
    <aside
      ref={sidenavRef}
      className={`${sidenavTypes[sidenavType]} ${
        openSideNav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-[272px] rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100 flex flex-col`}
    >
      {/* Logo + Close Button */}
      <div className="relative">
        <Link to="/home" className="flex items-center justify-center p-4">
          <div className="flex items-center text-white mt-4">
            <div className="bg-white p-2 rounded-md">
              <img src={image} alt="Logo" className="h-12 w-auto" />
            </div>
          </div>
        </Link>
        <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setOpenSideNav(false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
        </IconButton>
      </div>

      {/* Scrollable Menu */}
      <div className="flex-1 overflow-y-auto m-4 custom-scrollbar">
        <ul className="mb-4 flex flex-col">
          {menuItems.map(
            (item, index) =>
              isMenuItemAllowed(item.path) && (
                <li key={index}>
                  <NavLink to={item.path}>
                    {({ isActive }) => (
                      <Button
                        variant={isActive ? "gradient" : "text"}
                        color="white"
                        className="flex items-center gap-4 px-4 capitalize"
                        fullWidth
                      >
                        <item.icon className="w-5 h-5 text-inherit" />
                        <Typography
                          color="inherit"
                          className="font-medium capitalize"
                        >
                          {item.label}
                        </Typography>
                      </Button>
                    )}
                  </NavLink>
                </li>
              )
          )}
        </ul>
      </div>

      {/* Fixed Upgrade at Bottom */}
      <div className="m-2">
        <Upgrade />
      </div>
    </aside>
  );
};
export default SideNav;
