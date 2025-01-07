import React, { useContext, useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import ButtonComponents from "../../components/ButtonComponents";
import { ContextPanel } from "../../utils/ContextPanel";
import axios from "axios";
import { Select, Option, Button, Checkbox } from "@material-tailwind/react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Save } from "@mui/icons-material";
const CreateButton = () => {
  const { fetchPermissions } = useContext(ContextPanel);
  const [selectedPage, setSelectedPage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();
  const [userControlData, setUserControlData] = useState([]);
  const [permissions, setPermissions] = useState({});

  const userTypes = [
    { id: "2", label: "Admin" },
    { id: "3", label: "Manager" },
    { id: "4", label: "Super Admin" },
  ];

  // Fetch userControl data from localStorage
  useEffect(() => {
    const userControl = JSON.parse(localStorage.getItem("userControl") || "[]");
    setUserControlData(userControl);
  }, []);

  // Get all buttons from ButtonComponents grouped by page
  const buttonComponentsByPage = Object.entries(ButtonComponents).reduce(
    (acc, [key, value]) => {
      if (!acc[value.page]) {
        acc[value.page] = [];
      }
      acc[value.page].push(key);
      return acc;
    },
    {}
  );

  // Get buttons in localStorage grouped by page
  const userControlButtonsByPage = userControlData.reduce((acc, item) => {
    if (!acc[item.pages]) {
      acc[item.pages] = [];
    }
    acc[item.pages].push(item.button);
    return acc;
  }, {});

  // Get available pages (pages with new buttons)
  const availablePages = Object.keys(buttonComponentsByPage).filter((page) => {
    const buttonsInComponent = buttonComponentsByPage[page] || [];
    const buttonsInUserControl = userControlButtonsByPage[page] || [];
    return buttonsInComponent.some(
      (button) => !buttonsInUserControl.includes(button)
    );
  });

  // Get available buttons for a specific page
  const getAvailableButtons = (page) => {
    const buttonsInComponent = buttonComponentsByPage[page] || [];
    const buttonsInUserControl = userControlButtonsByPage[page] || [];

    return buttonsInComponent
      .filter((button) => !buttonsInUserControl.includes(button))
      .map((button) => ({
        value: button,
        label: button,
      }));
  };

  const handlePermissionChange = (button, userId) => {
    setPermissions((prev) => ({
      ...prev,
      [button]: {
        ...prev[button],
        [userId]: !prev[button]?.[userId],
      },
    }));
    if (validationErrors[button]) {
      setValidationErrors((prev) => ({
        ...prev,
        [button]: false,
      }));
    }
  };
  const validatePermissions = () => {
    const errors = {};
    let hasErrors = false;

    // Check each button has at least one checkbox selected
    getAvailableButtons(selectedPage).forEach((button) => {
      const buttonPermissions = permissions[button.value] || {};
      const hasSelectedPermission = Object.values(buttonPermissions).some(
        (value) => value
      );

      if (!hasSelectedPermission) {
        errors[button.value] = true;
        hasErrors = true;
      }
    });

    setValidationErrors(errors);
    return !hasErrors;
  };
  const handleSubmit = async () => {
    if (!validatePermissions()) {
      toast.error("Please select at least one permission for each button");
      return;
    }
    setIsLoading(true);
    const token = localStorage.getItem("token");

    try {
      // Convert permissions object to API format
      const permissionsToSubmit = Object.entries(permissions)
        .map(([button, userPerms]) => {
          const activeUserTypes = Object.entries(userPerms)
            .filter(([_, isChecked]) => isChecked)
            .map(([userId]) => userId);

          return {
            pages: selectedPage,
            button: button,
            usertype: activeUserTypes.join(","),
            status: "Active",
          };
        })
        .filter((item) => item.usertype.length > 0);

      // Submit each permission
      for (const permission of permissionsToSubmit) {
        await axios.post(
          "https://testags.store/public/api/panel-create-usercontrol",
          permission,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      toast.success("User controls created successfully");
      fetchPermissions();
      navigate("/userManagement");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create user controls"
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Layout>
      <div className="bg-white p-4 mb-4 mt-4 rounded-lg shadow-md">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
          <h1 className="border-b-2 font-[400] border-dashed border-orange-800 text-center md:text-left">
            Create New Role(Button)
          </h1>
        </div>
      </div>

      <div className="container bg-white mx-auto rounded-lg shadow-md p-4">
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium">Select Page</label>
          <Select
            value={selectedPage}
            onChange={(value) => setSelectedPage(value)}
            label="Select Page"
            className="w-full"
          >
            {availablePages.map((page) => (
              <Option key={page} value={page}>
                {page}
              </Option>
            ))}
          </Select>
        </div>

        {selectedPage && (
          <div className="rounded-lg border shadow-sm">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left w-96 text-sm font-medium text-gray-900">
                    Button Name
                  </th>
                  {userTypes.map((user) => (
                    <th
                      key={user.id}
                      className="px-4 py-3 text-left text-sm font-medium text-gray-900"
                    >
                      <div className="flex flex-row items-center gap-2">
                        {user.label}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {getAvailableButtons(selectedPage).map((button) => (
                  <tr
                    key={button.value}
                    className={
                      validationErrors[button.value] ? "bg-red-50" : ""
                    }
                  >
                    <td className="px-4 py-3 text-sm w-96 text-gray-900">
                      {button.label}
                      {validationErrors[button.value] && (
                        <span className="text-red-500 text-xs ml-2">
                          Select at least one permission
                        </span>
                      )}
                    </td>
                    {userTypes.map((user) => (
                      <td key={user.id} className="px-4 py-3 text-sm">
                        <Checkbox
                          checked={
                            permissions[button.value]?.[user.id] || false
                          }
                          onChange={() =>
                            handlePermissionChange(button.value, user.id)
                          }
                          color="blue"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedPage && (
          <div className="mt-6">
            <Button
              onClick={handleSubmit}
              className="flex items-center gap-2"
              color="blue"
              disabled={isLoading}
            >
              <Save className="h-4 w-4" />
              Create Roles
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CreateButton;
