import React, { useState, useEffect, useContext } from "react";
import { BaseUrl } from "../../base/BaseUrl";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { ContextPanel } from "../../utils/ContextPanel";
const PageControl = () => {
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState({});
  const [columnSelections, setColumnSelections] = useState({});
  const [routeControl, setRouteControl] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
      open: false,
      route: null,
      userId: null
  });
  const { fetchPagePermission,fetchPermissions } = useContext(ContextPanel);
  
  const userTypes = [
      { id: "2", label: "Admin" },
      { id: "3", label: "Manager" },
      { id: "4", label: "Super Admin" },
  ];

  const fetchRouteControl = async () => {
      try {
          const token = localStorage.getItem('token');
          if (!token) {
              throw new Error('No authentication token found');
          }

          const response = await axios.get(
              `${BaseUrl}/panel-fetch-usercontrol-new`,
              {
                  headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json'
                  }
              }
          );
          setRouteControl(response.data.usercontrol);
          setLoading(false);
      } catch (error) {
          setError(error);
          setLoading(false);
          toast.error(error.message || "Failed to fetch route data");
      }
  };

  const updatePermission = async (id, updatedData) => {
      try {
          const token = localStorage.getItem('token');
          if (!token) {
              throw new Error('No authentication token found');
          }

          await axios.put(
              `${BaseUrl}/panel-update-usercontrol-new/${id}`,
              updatedData,
              {
                  headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json'
                  }
              }
          );

          toast.success("Page permissions updated successfully");
          await fetchPagePermission();
          fetchRouteControl();
      } catch (error) {
          toast.error(error.response?.data?.message || "Failed to update permissions");
          throw error;
      }
  };

  const handlePermissionChange = (route, userId) => {
      if (columnSelections[route.url]?.[userId]) return;
      setConfirmDialog({
          open: true,
          route,
          userId
      });
  };

  const handleConfirmPermissionChange = async () => {
      const { route, userId } = confirmDialog;
      try {
          const routeData = routeControl.find(item => `/${item.url}` === route.url);
          if (!routeData) return;

          const currentUIPermissions = userTypes.reduce((acc, user) => {
              if (permissions[route.url]?.permissions[user.id]) {
                  acc.push(user.id);
              }
              return acc;
          }, []);

          let newUserTypes;
          if (currentUIPermissions.includes(userId)) {
              newUserTypes = currentUIPermissions.filter(id => id !== userId);
          } else {
              newUserTypes = [...currentUIPermissions, userId];
          }

          const updatedData = {
              name: routeData.name,
              url: routeData.url,
              usertype: newUserTypes.join(','),
              status: routeData.status || 'Active'
          };

          await updatePermission(routeData.id, updatedData);

          setPermissions(prevPermissions => {
              const routeUrl = route.url;
              const currentPermissions = prevPermissions[routeUrl]?.permissions || {};
              
              return {
                  ...prevPermissions,
                  [routeUrl]: {
                      id: routeData.id,
                      permissions: {
                          ...currentPermissions,
                          [userId]: !currentPermissions[userId]
                      }
                  }
              };
          });
      } catch (error) {
          console.error('Failed to update permission:', error);
          toast.error("Failed to update permission");
      }
      setConfirmDialog({ open: false, route: null, userId: null });
  };

  useEffect(() => {
      fetchRouteControl();
  }, []);

  useEffect(() => {
      if (routeControl) {
          const newPermissions = {};
          const newColumnSelections = {};

          routeControl.forEach((route) => {
              const url = `/${route.url}`;
              newColumnSelections[url] = {};
              userTypes.forEach((user) => {
                  newColumnSelections[url][user.id] = false;
              });

              newPermissions[url] = {
                  id: route.id,
                  permissions: {},
              };

              const usertypeArray = route.usertype ? route.usertype.split(",").filter(Boolean) : [];
              
              userTypes.forEach((user) => {
                  newPermissions[url].permissions[user.id] = usertypeArray.includes(user.id);
              });
          });

          setPermissions(newPermissions);
          setColumnSelections(newColumnSelections);
      }
  }, [routeControl]);

  if (loading) {
      return (
          
              <div className="container mx-auto p-6">
                  <div className="flex items-center justify-center h-64">
                      <div className="text-lg">Loading...</div>
                  </div>
              </div>
        
      );
  }

  if (error) {
      return (
          
              <div className="container mx-auto p-6">
                  <div className="flex items-center justify-center h-64">
                      <div className="text-lg text-red-600">
                          Error loading page controls
                      </div>
                  </div>
              </div>
       
      );
  }

  return (
    <>
     <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        
     <div className="bg-gray-500 p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold ">Page Control Management</h1>
             
          
          </div>
            </div>
            <div className="container mx-auto p-4">
                <div className="rounded-lg border shadow-sm">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left w-96 text-sm font-medium text-gray-900">
                                    Page Name
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
                            {routeControl.map((route) => (
                                <tr key={route.id}>
                                    <td className="px-4 py-3 text-sm w-96 text-gray-900">
                                        {route.name.trim()}
                                    </td>
                                    {userTypes.map((user) => (
                                        <td key={user.id} className="px-4 py-3 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={permissions[`/${route.url}`]?.permissions[user.id] ?? false}
                                                onChange={() => handlePermissionChange({ url: `/${route.url}` }, user.id)}
                                                disabled={columnSelections[`/${route.url}`]?.[user.id] || loading}
                                                className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
                                                    columnSelections[`/${route.url}`]?.[user.id] ? "opacity-50" : ""
                                                }`}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
               
            </div>
            </div>
            
            <Dialog
                open={confirmDialog.open}
                onClose={() => setConfirmDialog({ open: false, route: null, userId: null })}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirm Permission Change"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to update this permission?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setConfirmDialog({ open: false, route: null, userId: null })}
                        color="inherit"
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleConfirmPermissionChange} 
                        color="primary" 
                        variant="contained"
                        autoFocus
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
   </>
  )
}

export default PageControl