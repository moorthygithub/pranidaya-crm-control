import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { inputClass, inputClassBack } from "./common/Buttoncss";

const Logout = ({ open, handleOpen }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    toast.success("User Logged Out Successfully");
    navigate("/");
  };

  return (
    <Dialog open={open} handler={handleOpen}>
      <DialogHeader>Confirm Logout</DialogHeader>
      <DialogBody>Are you sure you want to log out?</DialogBody>
      <DialogFooter>
        <button onClick={handleOpen} className={inputClassBack}>
          <span>Cancel</span>
        </button>
        <button className={inputClass} onClick={handleLogout}>
          <span>Confirm</span>
        </button>
      </DialogFooter>
    </Dialog>
  );
};

export default Logout;
