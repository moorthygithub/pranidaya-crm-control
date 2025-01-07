import React, { useState, useEffect, useContext } from "react";
import { BaseUrl } from '../../base/BaseUrl';
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { ContextPanel } from "../../utils/ContextPanel";
import { CreateUserButton } from "../../components/ButtonComponents";
const ButtonControl = () => {
    const [permissions, setPermissions] = useState({});
    const [pageSelections, setPageSelections] = useState({});
    const [columnSelections, setColumnSelections] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [usercontrol, setUsercontrol] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({
      open: false,
      buttonId: null,
      userId: null,
      page: null,
    });
    const { fetchPermissions } = useContext(ContextPanel);
    const navigate = useNavigate();
  
    const userTypes = [
      { id: "2", label: "Admin" },
      { id: "3", label: "Manager" },
      { id: "4", label: "Super Admin" },
  ];
  
    // Keeping all the existing fetch and update functions the same
    const fetchUserControl = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BaseUrl}/panel-fetch-usercontrol`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUsercontrol(response.data.usercontrol);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
        toast.error("Failed to fetch user controls");
      }
    };
  
    useEffect(() => {
      fetchUserControl();
    }, []);
  
    const pageOptions = usercontrol
      ? [...new Set(usercontrol.map((item) => item.pages))]
      : [];
  
    const updatePermissions = async (id, updatedData) => {
      try {
        const token = localStorage.getItem("token");
        const payload = {
          ...updatedData,
          usertype: updatedData.usertype.join(","),
        };
  
        await axios.put(
          `${BaseUrl}/panel-update-usercontrol/${id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        toast.success("User control updated successfully");
        fetchPermissions();
        fetchUserControl();
      } catch (error) {
        console.log("bjjasdcas",error)
        toast.error(
          error.response?.data?.message || "Failed to update user control"
        );
      }
    };
  
    useEffect(() => {
      if (!usercontrol) return;
      const newPermissions = {};
      const newPageSelections = {};
      const newColumnSelections = {};
  
      pageOptions.forEach((page) => {
        newPageSelections[page] = false;
        newColumnSelections[page] = {};
  
        userTypes.forEach((user) => {
          newColumnSelections[page][user.id] = false;
        });
  
        const pageButtons = usercontrol
          .filter((item) => item.pages === page)
          .map((item) => item.button);
  
        pageButtons.forEach((button) => {
          const buttonControl = usercontrol.find(
            (item) => item.button === button
          );
          newPermissions[button] = {
            id: buttonControl.id,
            permissions: {},
          };
          userTypes.forEach((user) => {
            const userTypeArray = buttonControl?.usertype ? buttonControl.usertype.split(",") : [];
            newPermissions[button].permissions[user.id] = userTypeArray.includes(user.id) || false;
          });
        });
      });
  
      setPermissions(newPermissions);
      setPageSelections(newPageSelections);
      setColumnSelections(newColumnSelections);
    }, [usercontrol]);
  
    const handlePermissionChange = async (buttonId, userId, page) => {
      if (columnSelections[page]?.[userId]) return;
      setConfirmDialog({
        open: true,
        buttonId,
        userId,
        page,
      });
    };
  
    const handleConfirmPermissionChange = async () => {
      const { buttonId, userId, page } = confirmDialog;
      const buttonData = permissions[buttonId];
      const newPermissions = {
        ...buttonData.permissions,
        [userId]: !buttonData.permissions[userId],
      };
  
      const updatedUserTypes = Object.entries(newPermissions)
        .filter(([_, hasPermission]) => hasPermission)
        .map(([id]) => id);
  
      const updatedData = {
        pages: page,
        button: buttonId,
        usertype: updatedUserTypes,
        status: "Active",
      };
  
      try {
        await updatePermissions(buttonData.id, updatedData);
        setPermissions((prev) => ({
          ...prev,
          [buttonId]: {
            ...prev[buttonId],
            permissions: newPermissions,
          },
        }));
      } catch (error) {
        console.error("Failed to update permission:", error);
      }
      setConfirmDialog({ open: false, buttonId: null, userId: null, page: null });
    };
  
    if (loading) {
      return (
      
          <div className="flex bg-white items-center justify-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
       
      );
    }
  
    if (error) {
      return (
       
          <div className="flex items-center justify-center h-64">
            <p className="text-red-500 text-lg">Error loading user controls</p>
          </div>
      
      );
    }
  return (
    <>
    <div className="min-h-screen bg-gray-100 ">
       <div className="bg-white rounded-lg shadow-lg overflow-hidden">
         {/* Header Section */}
         <div className="bg-gray-500 p-6">
           <div className="flex justify-between items-center">
             <h1 className="text-2xl font-bold ">Button Control Management</h1>
             {/* <Button 
               variant="contained" 
               color="inherit"
               onClick={() => navigate(`/create-createMTest`)}
               className="bg-white text-blue-800 hover:bg-blue-50"
             >
               Create Roles
             </Button> */}
             <CreateUserButton
             onClick={() => navigate(`/create-createMTest`)}
               className="bg-white text-blue-800 hover:bg-blue-50"
             />
           </div>
         </div>

         {/* Content Section */}
         <div className="p-6">
           {loading ? (
             <div className="flex justify-center items-center h-64">
               <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
             </div>
           ) : error ? (
             <div className="text-center text-red-500 p-4">
               Error loading user controls
             </div>
           ) : (
             <div className="space-y-8">
               {pageOptions.map((page) => {
                 const pageButtons = usercontrol
                   .filter((item) => item.pages === page)
                   .map((item) => ({
                     value: item.button,
                     label: item.button,
                   }));

                 return (
                   <div key={page} className="bg-white rounded-lg border border-gray-200">
                     {/* Section Header */}
                     <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                       <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                         <span className="w-2 h-2 bg-black rounded-full"></span>
                         {page}
                       </h2>
                     </div>

                     {/* Table Section */}
                     <div className="overflow-x-auto">
                       <table className="w-full">
                         <thead>
                           <tr className="bg-gray-50">
                             <th className="text-left w-48 px-6 py-4 text-sm font-semibold text-gray-600 border-b">
                               Button Name
                             </th>
                             {userTypes.map((user) => (
                               <th
                                 key={user.id}
                                 className="text-center px-6 py-4 text-sm font-semibold text-gray-600 border-b"
                               >
                                 {user.label}
                               </th>
                             ))}
                           </tr>
                         </thead>
                         <tbody>
                           {pageButtons.map((button, index) => (
                             <tr 
                               key={button.value}
                               className={`hover:bg-gray-50 transition-colors ${
                                 index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                               }`}
                             >
                               <td className="px-6 w-48 py-4 text-sm text-gray-800 border-b">
                                 {button.label}
                               </td>
                               {userTypes.map((user) => (
                                 <td
                                   key={user.id}
                                   className="px-6 py-4 text-center border-b"
                                 >
                                   <input
                                     type="checkbox"
                                     checked={permissions[button.value]?.permissions[user.id] ?? false}
                                     onChange={() => handlePermissionChange(button.value, user.id, page)}
                                     disabled={columnSelections[page]?.[user.id]}
                                     className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
                                       columnSelections[page]?.[user.id] ? 'opacity-50' : ''
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
                 );
               })}
             </div>
           )}
         </div>
       </div>

       {/* Material UI Dialog */}
       <Dialog
         open={confirmDialog.open}
         onClose={() => setConfirmDialog({ open: false, buttonId: null, userId: null, page: null })}
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
             onClick={() => setConfirmDialog({ open: false, buttonId: null, userId: null, page: null })}
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
     </div>
   </>
  )
}

export default ButtonControl