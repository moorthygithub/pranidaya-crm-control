import { Link, NavLink, useLocation } from "react-router-dom";
import {

  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Button, IconButton, Typography } from "@material-tailwind/react";
import { useEffect, useRef } from "react";
import image from "../assets/logo.jpg";
import { MdDashboard, MdOutlineWebhook } from "react-icons/md";
import { MdClass } from "react-icons/md";
import { FaUserGroup } from "react-icons/fa6";
import { FaRegUserCircle } from "react-icons/fa";
import { FaCodePullRequest } from "react-icons/fa6";
import { GrTasks } from "react-icons/gr";
import { PiDownloadSimpleBold } from "react-icons/pi";

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
    <aside
      ref={sidenavRef}
      className={`${sidenavTypes[sidenavType]} ${
        openSideNav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-[272px] rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100 overflow-y-auto`}
    >
      <div className={`relative`}>
        <Link to="/home" className="flex items-center justify-center p-4">
          <div className="flex items-center text-white mt-4">
            <div className="bg-white p-2 rounded-md">
              <img src={image} alt="Logo" className="h-12 w-auto" />
            </div>{" "}
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

      {localStorage.getItem("user_type_id") == 2 ||
      localStorage.getItem("user_type_id") == 3 ? (
        <div className="m-4">
          <ul className="mb-4 flex flex-col gap-">
            <li>
              <NavLink to="/home">
                {({ isActive }) => (
                  <Button
                    variant={isActive ? "gradient" : "text"}
                    color="white"
                    className="flex items-center gap-4 px-4 capitalize"
                    fullWidth
                  >
                    <MdDashboard className="w-5 h-5 text-inherit" />
                    <Typography
                      color="inherit"
                      className="font-medium capitalize"
                    >
                      Dashboard
                    </Typography>
                  </Button>
                )}
              </NavLink>
            </li>

            <li>
              <NavLink to="/master-list">
                {({ isActive }) => (
                  <Button
                    variant={isActive ? "gradient" : "text"}
                    color="white"
                    className="flex items-center gap-4 px-4 capitalize"
                    fullWidth
                  >
                    <FaUserGroup className="w-5 h-5 text-inherit" />
                    <Typography
                      color="inherit"
                      className="font-medium capitalize"
                    >
                      Master
                    </Typography>
                  </Button>
                )}
              </NavLink>
            </li>

            <li>
              <NavLink to="/purchase">
                {({ isActive }) => (
                  <Button
                    variant={isActive ? "gradient" : "text"}
                    color="white"
                    className="flex items-center gap-4 px-4 capitalize"
                    fullWidth
                  >
                    <FaRegUserCircle className="w-5 h-5 text-inherit" />
                    <Typography
                      color="inherit"
                      className="font-medium capitalize"
                    >
                      Stock
                    </Typography>
                  </Button>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink to="/donor-list">
                {({ isActive }) => (
                  <Button
                    variant={isActive ? "gradient" : "text"}
                    color="white"
                    className="flex items-center gap-4 px-4 capitalize"
                    fullWidth
                  >
                    <MdClass className="w-5 h-5 text-inherit" />
                    <Typography
                      color="inherit"
                      className="font-medium capitalize"
                    >
                      Donor{" "}
                    </Typography>
                  </Button>
                )}
              </NavLink>
            </li>

            <li>
              <NavLink to="/cashrecepit">
                {({ isActive }) => (
                  <Button
                    variant={isActive ? "gradient" : "text"}
                    color="white"
                    className="flex items-center gap-4 px-4 capitalize"
                    fullWidth
                  >
                    <FaCodePullRequest className="w-5 h-5 text-inherit" />
                    <Typography
                      color="inherit"
                      className="font-medium capitalize"
                    >
                      Receipts
                    </Typography>
                  </Button>
                )}
              </NavLink>
            </li>

            <li>
              <NavLink to="/webdonation">
                {({ isActive }) => (
                  <Button
                    variant={isActive ? "gradient" : "text"}
                    color="white"
                    className="flex items-center gap-4 px-4 capitalize"
                    fullWidth
                  >
                    <MdOutlineWebhook className="w-5 h-5 text-inherit" />
                    <Typography
                      color="inherit"
                      className="font-medium capitalize"
                    >
                      Website Donation
                    </Typography>
                  </Button>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink to="/stock-summary">
                {({ isActive }) => (
                  <Button
                    variant={isActive ? "gradient" : "text"}
                    color="white"
                    className="flex items-center gap-4 px-4 capitalize"
                    fullWidth
                  >
                    <GrTasks className="w-5 h-5 text-inherit" />
                    <Typography
                      color="inherit"
                      className="font-medium capitalize"
                    >
                      Reports
                    </Typography>
                  </Button>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink to="/donor">
                {({ isActive }) => (
                  <Button
                    variant={isActive ? "gradient" : "text"}
                    color="white"
                    className="flex items-center gap-4 px-4 capitalize"
                    fullWidth
                  >
                    <PiDownloadSimpleBold className="w-5 h-5 text-inherit" />
                    <Typography
                      color="inherit"
                      className="font-medium capitalize"
                    >
                      download
                    </Typography>
                  </Button>
                )}
              </NavLink>
            </li>

            {/* Add more hardcoded routes here as needed */}
          </ul>
        </div>
      ) : (
        ""
      )}
    </aside>
  );
};
export default SideNav;
