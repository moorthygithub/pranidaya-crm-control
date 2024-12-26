import React, { useEffect, useState } from "react";
import axios from "axios";
import { BaseUrl } from "../../base/BaseUrl";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Layout from "../../layout/Layout";
import { FaLock, FaUser } from "react-icons/fa";

const Profile = () => {
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

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
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Profile not Updated");
    }
  };

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
      setOpenDialog(false);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Password change failed:", error);
      toast.error("Please enter valid old password");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const validateOnlyText = (inputtxt) =>
    /^[A-Za-z ]+$/.test(inputtxt) || inputtxt === "";

  const validateOnlyDigits = (inputtxt) =>
    /^\d+$/.test(inputtxt) || inputtxt.length === 0;

  return (
    <Layout>
      <>
        <div className="flex justify-center items-center p-2 mt-2">
          <h2 className="text-2xl font-bold">Member Profile</h2>
        </div>

        <div className="bg-gradient-to-r from-green-200 to-pink-300 flex justify-evenly items-center h-16 rounded-full mb-6">
          <div className="h-20 w-20 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 flex justify-center items-center border-4 border-transparent bg-clip-padding shadow-lg">
            <FaUser className="h-8 w-8 text-white" />
          </div>
          <span className="text-lg font-bold">Admins</span>
        </div>

        <div className="p-5 bg-white shadow-lg rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Basic Info</h2>
          <hr />
          <div className="mt-4">
            <h3 className="text-md font-semibold">Admins</h3>
            <div
              className="p-3 max-w-[200px] mt-2 cursor-pointer flex items-center border rounded-md hover:bg-gray-200"
              onClick={() => setOpenDialog(true)}
            >
              <FaLock className="mr-2" />
              <span className="font-semibold">Change password</span>
            </div>
          </div>
          <div className="mt-10">
            <form onSubmit={onUpdateProfile}>
              <div className="mb-4">
                <label className="block text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                  required
                  value={firstName}
                  disabled
                  onChange={(e) => {
                    if (validateOnlyText(e.target.value)) {
                      setFirstName(e.target.value);
                    }
                  }}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Phone</label>
                <input
                  type="text"
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => {
                    if (validateOnlyDigits(e.target.value)) {
                      setPhone(e.target.value);
                    }
                  }}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                  Update Profile
                </button>
              </div>
            </form>
            <ToastContainer />
          </div>

          {openDialog && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg p-5 w-96">
                <h2 className="text-lg font-semibold mb-2">Change Password</h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Old Password
                  </label>
                  <input
                    type="password"
                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={() => setOpenDialog(false)}
                    className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onChangePassword}
                    className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    </Layout>
  );
};

export default Profile;
