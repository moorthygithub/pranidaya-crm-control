import { useLocation, Link, useNavigate } from "react-router-dom";
import { Navbar, Typography, IconButton } from "@material-tailwind/react";
import { UserCircleIcon, Bars3Icon } from "@heroicons/react/24/solid";
import Logout from "./Logout";
import { useState } from "react";
import { HiArrowRightStartOnRectangle } from "react-icons/hi2";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Dialog, Tooltip } from "@mui/material";
import { X } from "lucide-react";
import axios from "axios";
import { BaseUrl } from "../base/BaseUrl";
import { FaLock } from "react-icons/fa6";
import { toast } from "react-toastify";

import { inputClass } from "../components/common/Buttoncss";
import { AddCashReceipt } from "./ButtonComponents";

const DashboardNavbar = ({ openSideNav, setOpenSideNav }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialog1, setOpenDialog1] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleOpenLogout = () => setOpenModal(!openModal);

  const pathSegments = pathname.split("/").filter((el) => el !== "");

  const breadcrumbs = [
    { name: "Home", link: "/home" },
    ...pathSegments.slice(0, 1).map((segment, index) => ({
      name: segment.charAt(0).toUpperCase() + segment.slice(1),
    })),
  ];

  const pageTitle =
    pathSegments.length === 0
      ? "Home"
      : pathSegments[pathSegments.length - 1]?.charAt(0).toUpperCase() +
        pathSegments[pathSegments.length - 1]?.slice(1);

  const fixedNavbar = true;

  // /for profile
  const getData = async () => {
    try {
      const res = await axios.get(`${BaseUrl}/fetch-profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setFirstName(res.data.user.full_name || "");
      setPhone(res.data.user.phone || "");
      setEmail(res.data.user.email || "");
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Failed to load profile data");
    }
  };
  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleopen = () => {
    setOpenDialog(true);
    getData();
  };
  const validateOnlyText = (inputtxt) =>
    /^[A-Za-z ]+$/.test(inputtxt) || inputtxt === "";

  const validateOnlyDigits = (inputtxt) =>
    /^\d+$/.test(inputtxt) || inputtxt.length === 0;

  const onUpdateProfile = async (e) => {
    e.preventDefault();
    if (!firstName) {
      toast.error("Enter Full Name");
      return;
    }
    if (!phone || phone.length !== 10) {
      toast.error("Enter a valid 10-digit Mobile Number");
      return;
    }
    if (!email) {
      toast.error("Enter Email Id");
      return;
    }

    const data = { full_name: firstName, phone };

    try {
      const res = await axios.post(`${BaseUrl}/update-profile`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.code === 401) {
        toast.error("Duplicate Entry of Name");
      } else if (res.data.code === 402) {
        toast.error("Duplicate Entry of Mobile");
      } else if (res.data.code === 403) {
        toast.error("Duplicate Entry of Email");
      } else {
        toast.success("Profile Updated Successfully!");

        setOpenDialog(false);
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Profile not Updated");
    }
  };

  const inputClassText =
    "w-full p-2 mt-2 text-sm border rounded-lg focus:outline-none focus:ring-2  focus:border-blue-300 disabled:bg-gray-200";
  const FormLabel = ({ children, required }) => (
    <label className="block text-sm font-semibold text-black mb-1 ">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
  const onChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    if (oldPassword === newPassword) {
      toast.error("Same Old Password is not allowed");
      return;
    }

    const data = {
      old_password: oldPassword,
      password: newPassword,
      confirm_password: confirmPassword,
      username: localStorage.getItem("username"),
    };

    try {
      await axios.post(`${BaseUrl}/change-password`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Password Updated Successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setOpenDialog1(false);
    } catch (error) {
      console.error("Password change failed:", error);
      toast.error("Please enter valid old password");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <>
      <Navbar
        color={fixedNavbar ? "white" : "transparent"}
        className={`rounded-xl transition-all ${
          fixedNavbar
            ? "sticky top-4 z-40 py-3 bg-gradient-to-br from-gray-800 text-white to-gray-700  shadow-lg  shadow-blue-900"
            : "px-0 py-1"
        }`}
        fullWidth
        blurred={fixedNavbar}
      >
        <div className="flex  justify-between  flex-row md:items-center">
          <div className="capitalize flex items-center justify-between">
            <Typography
              onClick={() => navigate(-1)}
              variant="small"
              color="white"
              className="flex items-center gap-1 font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100 cursor-pointer"
            >
              <IoIosArrowRoundBack size={20} /> Back
            </Typography>

            <IconButton
              variant="text"
              color="white"
              className="xl:hidden"
              onClick={() => setOpenSideNav(!openSideNav)}
            >
              <Bars3Icon strokeWidth={3} className="h-6 w-6 text-white" />
            </IconButton>
          </div>

          <div className="flex items-center">
            <AddCashReceipt
              onClick={() => navigate("/cashrecepitall")}
              className={inputClass}
            />

            <IconButton variant="text" color="orange" onClick={handleopen}>
              <UserCircleIcon className="h-5 w-5 text-red" />
            </IconButton>

            <IconButton variant="text" color="red" onClick={handleOpenLogout}>
              <HiArrowRightStartOnRectangle className="h-5 w-5 text-red" />
            </IconButton>
          </div>
        </div>
        <Logout open={openModal} handleOpen={handleOpenLogout} />
      </Navbar>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        sx={{
          backdropFilter: "blur(5px) sepia(5%)",
          "& .MuiDialog-paper": {
            borderRadius: "18px",
          },
        }}
      >
        <form autoComplete="off" onSubmit={onUpdateProfile}>
          <div className="p-6 space-y-1 sm:w-[280px] md:w-[500px] bg-white rounded-2xl shadow-md">
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center justify-between">
                  <h1 className="text-slate-800 text-xl font-semibold mr-1">
                    Personal Details
                  </h1>

                  <div
                    className="p-2 flex items-center space-x-3 border rounded-md hover:bg-gray-300 transition-all duration-300 ease-in-out cursor-pointer"
                    onClick={() => {
                      setOpenDialog(false);
                      setOpenDialog1(true);
                    }}
                  >
                    <FaLock className="text-gray-600 text-lg" />
                    <span className="font-semibold text-gray-800">
                      Change password
                    </span>
                  </div>
                </div>

                <div className="flex " onClick={handleClose}>
                  <Tooltip title="Close" arrow>
                    <button type="button" className="ml-3 pl-2">
                      <X />
                    </button>
                  </Tooltip>
                </div>
              </div>

              <div className="mt-2 p-4 ">
                <div className="grid grid-cols-1  gap-6 mb-4">
                  <div>
                    <FormLabel required>Full Name</FormLabel>
                    <input
                      required
                      disabled
                      value={firstName}
                      onChange={(e) => {
                        if (validateOnlyText(e.target.value)) {
                          setFirstName(e.target.value);
                        }
                      }}
                      className={inputClassText}
                    />
                  </div>
                  <div>
                    <FormLabel required>Phone</FormLabel>
                    <input
                      required
                      maxLength={10}
                      value={phone}
                      onChange={(e) => {
                        if (validateOnlyDigits(e.target.value)) {
                          setPhone(e.target.value);
                        }
                      }}
                      className={inputClassText}
                    />
                  </div>
                  <div>
                    <FormLabel required>Email</FormLabel>
                    <input
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClassText}
                    />
                  </div>
                </div>
                <div className="mt-5 flex justify-center">
                  <button type="submit" className={inputClass}>
                    Update Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Dialog>

      <Dialog
        open={openDialog1}
        onClose={() => setOpenDialog1(false)}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        sx={{
          backdropFilter: "blur(5px) sepia(5%)",
          "& .MuiDialog-paper": {
            borderRadius: "18px",
          },
        }}
      >
        <form autoComplete="off" onSubmit={onChangePassword}>
          <div className="p-6 space-y-1 sm:w-[280px] md:w-[500px]">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center justify-between">
                <h1 className="text-slate-800 text-xl font-semibold mr-1">
                  Change Password
                </h1>
              </div>

              <div className="flex " onClick={() => setOpenDialog1(false)}>
                <Tooltip title="Close" arrow>
                  <button type="button" className="ml-3 pl-2">
                    <X />
                  </button>
                </Tooltip>
              </div>
            </div>
            <div>
              <div className="bg-white rounded-lg p-5">
                <div>
                  <FormLabel required> Old Password</FormLabel>
                  <input
                    required
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className={inputClassText}
                  />
                </div>

                <div>
                  <FormLabel required> New Password</FormLabel>
                  <input
                    required
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={inputClassText}
                  />
                </div>
                <div>
                  <FormLabel required> Confirm Password</FormLabel>
                  <input
                    required
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={inputClassText}
                  />
                </div>

                <div className="flex justify-center mt-8">
                  <button
                    type="button"
                    onClick={onChangePassword}
                    className={inputClass}
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Dialog>
    </>
  );
};

export default DashboardNavbar;
