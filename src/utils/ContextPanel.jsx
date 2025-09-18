import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BaseUrl } from "../base/BaseUrl";
import axios from "axios";

export const ContextPanel = createContext();

const AppProvider = ({ children }) => {
  const [isPanelUp, setIsPanelUp] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [dates, setDates] = useState({
    c_receipts: [],
    m_receipt: [],
    website_donation: [],
  });
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("user_type_id");
  const checkPanelStatus = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/check-status`);
      const datas = response.data;
      setIsPanelUp(datas);
      setError(!datas?.success);
    } catch (error) {
      setError(true);
    }
  };

  useEffect(() => {
    if (error) {
      localStorage.clear();
      navigate("/maintenance");
    } else if (
      !token &&
      !["/", "/forget-password"].includes(location.pathname)
    ) {
      navigate("/");
    }
  }, [error, navigate, isPanelUp, location.pathname]);

  useEffect(() => {
    checkPanelStatus();
    const intervalId = setInterval(checkPanelStatus, 300000);
    return () => clearInterval(intervalId);
  }, []);
  useEffect(() => {
    console.log("Current Route:", location.pathname);
  }, [location.pathname]);

  const fetchDates = async () => {
    try {
      const response = await fetch(BaseUrl + "/fetch-last-two-days-date", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();
      console.log(data, "datadata");

      setDates(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPagePermission = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BaseUrl}/panel-fetch-usercontrol-new`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      localStorage.setItem(
        "pageControl",
        JSON.stringify(response.data?.usercontrol)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPermissions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BaseUrl}/panel-fetch-usercontrol`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.setItem(
        "userControl",
        JSON.stringify(response.data?.usercontrol)
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPermissions();
      fetchPagePermission();
    }
  }, [token]);

  useEffect(() => {
    if (token && Number(userType) == 5) {
      fetchDates();
    }
  }, [token, userType]);

  return (
    <ContextPanel.Provider
      value={{
        isPanelUp,
        setIsPanelUp,
        fetchPermissions,
        fetchPagePermission,
        dates,
      }}
    >
      {children}
    </ContextPanel.Provider>
  );
};

export default AppProvider;
