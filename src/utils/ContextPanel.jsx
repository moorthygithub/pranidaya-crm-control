import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BaseUrl } from "../base/BaseUrl";
import axios from "axios";

export const ContextPanel = createContext();

const AppProvider = ({ children }) => {
  const userTypeId = localStorage.getItem("user_type_id");
  const [isPanelUp, setIsPanelUp] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const checkPanelStatus = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/check-status`);
      const datas = await response.data;
      setIsPanelUp(datas);
      if (datas?.success) {
        setError(false);
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const currentPath = location.pathname;

    if (error) {
      localStorage.clear();
      navigate("/maintenance");
    } else if (isPanelUp?.success) {
      if (token) {
        const allowedPaths = [
          "/home",
          "/create-createMTest",
          "/profile",
          "/webdonation",
          "/add-country",
          "/edit-country",
          "/donor-add",
          "/add-donor",
          "/edit-courses",
          "/master-list",
          "/add-enquiry",
          "/edit-enquiry",
          "/edit-exam",
          "/view-exam",
          "/view-enquiry",
          "/edit-personal",
          "/VendorList",
          "/closeList-enquiry",
          "/student",
          "/view-result",
          "/view-student",
          "/edit-result",
          "/add-student-course",
          "/view-student-enquiry",
          "/add-student-delivery",
          "/edit-student-delivery",
          "/view-course",
          "/view-delivery",
          "/add-exam",
          "/edit-student",
          "/edit-student-course",
          "/purchase",
          "/add-delivery",
          "/edit-delivery",
          "/consumption",
          "/view-student-delivery",
          "/class",
          "/add-class",
          "/add-request",
          "/cashrecepit",
          "/request-completed",
          "/recepit-material",
          "/stock-summary",
          "/course-due",
          "/task-inspection",
          "/task-completed",
          "/material-recepit-pending-list",
          "/pending-onboard",
          "/pending-offboard",
          "/pending-interview",
          "/view-class",
          "/add-task",
          "/edit-task",
          "/over-due-task-list",
          "/notification",
          "/add-notification",
          "/download-enquiry",
          "/change-password",
          "/donor",
          "/cashpurchase",
          "/cash",
          "/material-recepit",
          "/D-consumption",
          "/enquiryreport",
          "/studentreport",
          "/deliveryreport",
          "/material-recepitreport",
          "/consumptionreport",
          "/notattend",
          "/addVendor",
          "/EditVendors",
          "/add-purchase",
          "/edit-purchase",
          "/add-consumption",
          "/edit-consumption",
          "/stock",
          "/recepit-edit",
          "/recepit-view",
          "/material-edit",
          "/material-view",
          "/view-stock",
          "/web-donation",
          "/donor-list",
          "/edit-donor",
          "/create-donor",
          "/createrecepit-donor",
          "/cashrecepit-list",
          "/viewdonor-list",
          "/recepitdonor-list",
          "/create-family/",
          "/add-family",
          "/d-summary",
          "/d-summary-view",
          "/duplicate",
          "/edit-duplicate",
          "/zero-duplicate",
          "/no-duplicate",
          "/occasion",
          "/add-occasion",
          "/edit-occasion",
          "/M-recepit",
          "/cashrecepitall",
          "/test",
          "/materialrecepitall",
          "/userManagement",
          "/animalStock",
          "/add-animal",
          "/edit-animal",
          "/animal-meet",
          "/add-animal-meet",
          "/edit-animal-meet",
          "/animal-born-arrival",
          "/add-born-arrival",
          "/animal-dead",
          "/animal-stock",
          "/animal-stock-view",
        ];
        const isAllowedPath = allowedPaths.some((path) =>
          currentPath.startsWith(path)
        );
        console.log("currentpath", currentPath);
        if (isAllowedPath) {
          navigate(currentPath);
        } else {
          navigate("/home");
        }
      } else {
        if (
          currentPath === "/" ||
          currentPath === "/register" ||
          currentPath === "/forget-password" ||
          currentPath === "/enquiry-now"
        ) {
          navigate(currentPath);
        } else {
          navigate("/");
        }
      }
    }
  }, [error, navigate, isPanelUp, location.pathname]);

  useEffect(() => {
    checkPanelStatus();
    const intervalId = setInterval(checkPanelStatus, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchPagePermission = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BaseUrl}/panel-fetch-usercontrol-new`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // array in local storage
      localStorage.setItem(
        "pageControl",
        JSON.stringify(response.data?.usercontrol)
      );
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPermissions = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BaseUrl}/panel-fetch-usercontrol`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Store the entire `usercontrol` array in localStorage
      localStorage.setItem(
        "userControl",
        JSON.stringify(response.data?.usercontrol)
      );
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPermissions();
      fetchPagePermission();
    }
  }, []);

  return (
    <ContextPanel.Provider
      value={{ isPanelUp, setIsPanelUp, fetchPermissions, fetchPagePermission }}
    >
      {children}
    </ContextPanel.Provider>
  );
};

export default AppProvider;
