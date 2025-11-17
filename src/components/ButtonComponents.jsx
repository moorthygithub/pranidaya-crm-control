import React from "react";
import {
  MdDelete,
  MdEdit,
  MdGroups,
  MdOutlineRemoveRedEye,
  MdOutlineStickyNote2,
} from "react-icons/md";
import { IoEye } from "react-icons/io5";
import { PiNotebook } from "react-icons/pi";
import { FaUsers, FaWhatsapp } from "react-icons/fa6";
import Button from "@mui/material/Button";
import { GrGroup } from "react-icons/gr";
import { LuDownload } from "react-icons/lu";
import { inputClass } from "./common/Buttoncss";
import { IoIosPrint } from "react-icons/io";

const getUserControlData = () => {
  const userControl = localStorage.getItem("userControl");
  try {
    return userControl ? JSON.parse(userControl) : [];
  } catch (error) {
    console.error("Error parsing usercontrol data from localStorage", error);
    return [];
  }
};

const shouldRenderButton = (buttonName, userType, status) => {
  if (!userType) {
    console.warn(`User type is ${userType} for button ${buttonName}`);
    return false;
  }
  const data = getUserControlData();
  if (!Array.isArray(data)) {
    console.warn("Invalid userControl data ");
    return false;
  }
  return data.some((item) => {
    if (!item?.usertype) return false;
    const userTypes = item.usertype.split(",");
    return (
      item.button == buttonName &&
      userTypes.includes(userType) &&
      item.status.toLowerCase() == status.toLowerCase()
    );
  });
};
//   master -list item

export const AddListItem = ({ onClick, className }) => {
  const userType = localStorage.getItem("user_type_id");

  if (!shouldRenderButton("AddListItem", userType, "active")) return null;

  return (
    <button onClick={onClick} className={` ${className}`}>
      + Add Item
    </button>
  );
};
AddListItem.page = "Master";

export const EditListItem = ({ onClick, className }) => {
  const userType = localStorage.getItem("user_type_id");

  if (!shouldRenderButton("EditListItem", userType, "active")) return null;

  return (
    <button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={className}
      title="Edit List item"
    >
      <MdEdit className="h-4 w-4" />
    </button>
  );
};
EditListItem.page = "Master";

//   master-vendor list

export const AddVendorItem = ({ onClick, className }) => {
  const userType = localStorage.getItem("user_type_id");

  if (!shouldRenderButton("AddVendorItem", userType, "active")) return null;

  return (
    <button onClick={onClick} className={` ${className}`}>
      + Add Vendors
    </button>
  );
};
AddVendorItem.page = "Master";

export const EditVendorItem = ({ onClick, className }) => {
  const userType = localStorage.getItem("user_type_id");

  if (!shouldRenderButton("EditVendorItem", userType, "active")) return null;

  return (
    <button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={className}
      title="Edit Vendor"
    >
      <MdEdit className="h-4 w-4" />
    </button>
  );
};
EditVendorItem.page = "Master";

// master -occasion list

export const AddOccassionItem = ({ onClick, className }) => {
  const userType = localStorage.getItem("user_type_id");

  if (!shouldRenderButton("AddOccassionItem", userType, "active")) return null;

  return (
    <button onClick={onClick} className={` ${className}`}>
      + Add Occassion
    </button>
  );
};
AddOccassionItem.page = "Master";

export const EditOccassionItem = ({ onClick, className }) => {
  const userType = localStorage.getItem("user_type_id");

  if (!shouldRenderButton("EditOccassionItem", userType, "active")) return null;

  return (
    <button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={className}
      title="Edit Occassion"
    >
      <MdEdit className="h-4 w-4" />
    </button>
  );
};
EditOccassionItem.page = "Master";

// stock- purchase list

export const AddPurchase = ({ onClick, className }) => {
  const userType = localStorage.getItem("user_type_id");

  if (!shouldRenderButton("AddPurchase", userType, "active")) return null;

  return (
    <button onClick={onClick} className={` ${className}`}>
      + Add Purchase
    </button>
  );
};
AddPurchase.page = "Stock";

export const EditPurchase = ({ onClick, className }) => {
  const userType = localStorage.getItem("user_type_id");

  if (!shouldRenderButton("EditPurchase", userType, "active")) return null;

  return (
    <button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={className}
      title="Edit Purchase"
    >
      <MdEdit className="h-4 w-4" />
    </button>
  );
};
EditPurchase.page = "Stock";
//   stock- consumption list

export const AddConsumption = ({ onClick, className }) => {
  const userType = localStorage.getItem("user_type_id");

  if (!shouldRenderButton("AddConsumption", userType, "active")) return null;

  return (
    <button onClick={onClick} className={` ${className}`}>
      + Add Consumption
    </button>
  );
};
AddConsumption.page = "Stock";

export const EditConsumption = ({ onClick, className }) => {
  const userType = localStorage.getItem("user_type_id");

  if (!shouldRenderButton("EditConsumption", userType, "active")) return null;

  return (
    <button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={className}
      title="Edit Consumption"
    >
      <MdEdit className="h-4 w-4" />
    </button>
  );
};
EditConsumption.page = "Stock";

//   donor -donor
export const AddCashReceipt = ({ onClick, className }) => {
  const userType = localStorage.getItem("user_type_id");

  if (!shouldRenderButton("AddCashReceipt", userType, "active")) return null;

  return (
    <button onClick={onClick} className={` ${className}`}>
      + CashRecepit
    </button>
  );
};
AddCashReceipt.page = "Donor";
export const AddMaterialReceipt = ({ onClick, className }) => {
  const userType = localStorage.getItem("user_type_id");

  if (!shouldRenderButton("AddMaterialReceipt", userType, "active"))
    return null;

  return (
    <button onClick={onClick} className={` ${className}`}>
      + MaterialRecepit
    </button>
  );
};
AddMaterialReceipt.page = "Donor";
export const AddDonor = ({ onClick, className }) => {
  const userType = localStorage.getItem("user_type_id");

  if (!shouldRenderButton("AddDonor", userType, "active")) return null;

  return (
    <button onClick={onClick} className={` ${className}`}>
      + Add Donor
    </button>
  );
};
AddDonor.page = "Donor";

export const ViewDonor = ({ onClick, className }) => {
  const userType = localStorage.getItem("user_type_id");

  if (!shouldRenderButton("ViewDonor", userType, "active")) return null;

  return (
    <button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={className}
      title="View Donor"
    >
      <IoEye className="h-4 w-4" />
    </button>
  );
};
ViewDonor.page = "Donor";
export const EditDonor = ({ onClick, className }) => {
  const userType = localStorage.getItem("user_type_id");

  if (!shouldRenderButton("EditDonor", userType, "active")) return null;

  return (
    <button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={className}
      title="Edit Donor"
    >
      <MdEdit className="h-4 w-4" />
    </button>
  );
};
EditDonor.page = "Donor";
export const CashReceiptDonor = ({ onClick, className }) => {
  const userType = localStorage.getItem("user_type_id");

  if (!shouldRenderButton("CashReceiptDonor", userType, "active")) return null;

  return (
    <button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={className}
      title="Cash Receipt"
    >
      <PiNotebook className="h-4 w-4" />
    </button>
  );
};
CashReceiptDonor.page = "Donor";
export const MaterialReceiptDonor = ({ onClick, className }) => {
  const userType = localStorage.getItem("user_type_id");

  if (!shouldRenderButton("MaterialReceiptDonor", userType, "active"))
    return null;

  return (
    <button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={className}
      title="Material Receipt"
    >
      <MdOutlineStickyNote2 className="h-4 w-4" />
    </button>
  );
};
MaterialReceiptDonor.page = "Donor";
export const FamilyMemberDonor = ({ onClick, className }) => {
  const userType = localStorage.getItem("user_type_id");

  if (!shouldRenderButton("FamilyMemberDonor", userType, "active")) return null;

  return (
    <button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={className}
      title="Family Member"
    >
      <FaUsers className="h-4 w-4" />
    </button>
  );
};
FamilyMemberDonor.page = "Donor";
export const EditDuplicateDonor = ({ onClick, className }) => {
  const userType = localStorage.getItem("user_type_id");

  if (!shouldRenderButton("EditDuplicateDonor", userType, "active"))
    return null;

  return (
    <button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={className}
      title="Edit Duplicate"
    >
      <MdEdit className="h-4 w-4" />
    </button>
  );
};
EditDuplicateDonor.page = "Donor";
export const DeleteDuplicateDonor = ({ onClick, className }) => {
  const userType = localStorage.getItem("user_type_id");

  if (!shouldRenderButton("DeleteDuplicateDonor", userType, "active"))
    return null;

  return (
    <button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={className}
      title="Delete Duplicate"
    >
      <MdDelete className="h-4 w-4" />
    </button>
  );
};
DeleteDuplicateDonor.page = "Donor";
export const ZeroDuplicateDonor = ({ onClick, className }) => {
  const userType = localStorage.getItem("user_type_id");

  if (!shouldRenderButton("ZeroDuplicateDonor", userType, "active"))
    return null;

  return (
    <button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={className}
      title="Family Donor Duplicate"
    >
      <GrGroup className="h-4 w-4" />
    </button>
  );
};
ZeroDuplicateDonor.page = "Donor";
export const NoDuplicateDonor = ({ onClick, className }) => {
  const userType = localStorage.getItem("user_type_id");

  if (!shouldRenderButton("NoDuplicateDonor", userType, "active")) return null;

  return (
    <button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={className}
      title="Convert Duplicate"
    >
      <MdGroups className="h-4 w-4" />
    </button>
  );
};
NoDuplicateDonor.page = "Donor";

export const AddFamilyMember = ({ onClick, className }) => {
  const userType = localStorage.getItem("user_type_id");

  if (!shouldRenderButton("AddFamilyMember", userType, "active")) return null;

  return (
    <button onClick={onClick} className={` ${className}`}>
      + Add Family
    </button>
  );
};
AddFamilyMember.page = "Donor";
export const EditDonationReceipt = ({ onClick, className }) => {
  const userType = localStorage.getItem("user_type_id");

  if (!shouldRenderButton("EditDonationReceipt", userType, "active"))
    return null;

  return (
    <button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={className}
      title="Edit"
    >
      <MdEdit className="h-4 w-4" />
    </button>
  );
};
EditDonationReceipt.page = "Receipts";
export const ViewDonationReceipt = ({ onClick, className }) => {
  const userType = localStorage.getItem("user_type_id");

  if (!shouldRenderButton("ViewDonationReceipt", userType, "active"))
    return null;

  return (
    <button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={className}
      title="View"
    >
      <MdOutlineRemoveRedEye className="h-4 w-4" />
    </button>
  );
};
ViewDonationReceipt.page = "Receipts";
export const ViewMaterialReceipt = ({ onClick, className }) => {
  const userType = localStorage.getItem("user_type_id");

  if (!shouldRenderButton("ViewMaterialReceipt", userType, "active"))
    return null;

  return (
    <button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={className}
      title="View"
    >
      <MdOutlineRemoveRedEye className="h-4 w-4" />
    </button>
  );
};
ViewMaterialReceipt.page = "Receipts";
export const EditMaterialReceipt = ({ onClick, className }) => {
  const userType = localStorage.getItem("user_type_id");

  if (!shouldRenderButton("EditMaterialReceipt", userType, "active"))
    return null;

  return (
    <button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={className}
      title="Edit"
    >
      <MdEdit className="h-4 w-4" />
    </button>
  );
};
EditMaterialReceipt.page = "Receipts";

export const WhatsappIncashRecepit = ({ onClick, className }) => {
  const userType = localStorage.getItem("user_type_id");

  if (!shouldRenderButton("WhatsappIncashRecepit", userType, "active"))
    return null;

  return (
    <button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={`flex items-center space-x-2 ${className}`}
      title="Whatsapp"
    >
      <FaWhatsapp className="h-4 w-4" />
      <span>WhatsApp</span>
    </button>
  );
};
WhatsappIncashRecepit.page = "Receipts";
export const CashRecepitPrintOld = ({ onClick, className }) => {
  const userType = localStorage.getItem("user_type_id");

  if (!shouldRenderButton("CashRecepitPrintOld", userType, "active"))
    return null;

  return (
    <button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={`flex items-center space-x-2 ${className}`}
      title="Print Old"
    >
      <IoIosPrint className="h-4 w-4" />
      <span>Print Old</span>
    </button>
  );
};
CashRecepitPrintOld.page = "Receipts";
export const CashRecepitPrint = ({ onClick, className }) => {
  const userType = localStorage.getItem("user_type_id");

  if (!shouldRenderButton("CashRecepitPrint", userType, "active")) return null;

  return (
    <button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={`flex items-center space-x-2 ${className}`}
      title="Print"
    >
      <IoIosPrint className="h-4 w-4" />
      <span>Print</span>
    </button>
  );
};
CashRecepitPrint.page = "Receipts";
export const PdfDownloadIncashRecepit = ({ onClick, className }) => {
  const userType = localStorage.getItem("user_type_id");

  if (!shouldRenderButton("PdfDownloadIncashRecepit", userType, "active"))
    return null;

  return (
    <button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={`flex items-center space-x-2 ${className}`}
      title="Pdf"
    >
      <LuDownload className="h-4 w-4" />
      <span>Pdf</span>
    </button>
  );
};
PdfDownloadIncashRecepit.page = "Receipts";
export const WhatsappInMaterialRecepit = ({ onClick, className }) => {
  const userType = localStorage.getItem("user_type_id");

  if (!shouldRenderButton("WhatsappInMaterialRecepit", userType, "active"))
    return null;

  return (
    <button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={`flex items-center space-x-2 ${className}`}
      title="Whatsapp"
    >
      <FaWhatsapp className="h-4 w-4" />
      <span>WhatsApp</span>
    </button>
  );
};
WhatsappInMaterialRecepit.page = "Receipts";
export const PdfDownloadInMaterialRecepit = ({ onClick, className }) => {
  const userType = localStorage.getItem("user_type_id");

  if (!shouldRenderButton("PdfDownloadInMaterialRecepit", userType, "active"))
    return null;

  return (
    <button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={`flex items-center space-x-2 ${className}`}
      title="Pdf"
    >
      <LuDownload className="h-4 w-4" />
      <span>Pdf</span>
    </button>
  );
};
PdfDownloadInMaterialRecepit.page = "Receipts";
//create animal stock button
export const AddAnimal = ({ onClick, className }) => {
  const userType = localStorage.getItem("user_type_id");

  if (!shouldRenderButton("AddAnimal", userType, "active")) return null;

  return (
    <button onClick={onClick} className={` ${className}`}>
      + Add Animal
    </button>
  );
};
AddAnimal.page = "Animal Stock";

export const EditAnimal = ({ onClick, className }) => {
  const userType = localStorage.getItem("user_type_id");

  if (!shouldRenderButton("EditAnimal", userType, "active")) return null;

  return (
    <button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={className}
      title="Edit"
    >
      <MdEdit className="h-4 w-4" />
    </button>
  );
};
EditAnimal.page = "Animal Stock";

export const AddAnimalMeet = ({ onClick, className }) => {
  const userType = localStorage.getItem("user_type_id");

  if (!shouldRenderButton("AddAnimalMeet", userType, "active")) return null;

  return (
    <button onClick={onClick} className={` ${className}`}>
      + Add Animal Meet
    </button>
  );
};
AddAnimalMeet.page = "Animal Stock";

export const EditAnimalMeet = ({ onClick, className }) => {
  const userType = localStorage.getItem("user_type_id");

  if (!shouldRenderButton("EditAnimalMeet", userType, "active")) return null;

  return (
    <button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={className}
      title="Edit"
    >
      <MdEdit className="h-4 w-4" />
    </button>
  );
};
EditAnimalMeet.page = "Animal Stock";

export const AddBornorArrival = ({ onClick, className }) => {
  const userType = localStorage.getItem("user_type_id");

  if (!shouldRenderButton("AddBornorArrival", userType, "active")) return null;

  return (
    <button onClick={onClick} className={` ${className}`}>
      + Add Born Arrival
    </button>
  );
};
AddBornorArrival.page = "Animal Stock";
export const AddAnimalDead = ({ onClick, className }) => {
  const userType = localStorage.getItem("user_type_id");

  if (!shouldRenderButton("AddAnimalDead", userType, "active")) return null;

  return (
    <button onClick={onClick} className={` ${className}`}>
      + Add Dead List
    </button>
  );
};
AddAnimalDead.page = "Animal Stock";

export const CreateUserButton = ({ onClick, className }) => {
  const userType = localStorage.getItem("user_type_id");

  if (!shouldRenderButton("CreateUserButton", userType, "active")) return null;

  return (
    <button onClick={onClick} className={inputClass} title="Create Roles">
      Create Roles
    </button>
  );
};
CreateUserButton.page = "UserManagement";
export default {
  AddListItem,
  EditListItem,
  AddVendorItem,
  EditVendorItem,
  AddOccassionItem,
  EditOccassionItem,
  AddPurchase,
  EditPurchase,
  AddConsumption,
  EditConsumption,
  ViewDonor,
  AddDonor,
  AddCashReceipt,
  AddMaterialReceipt,
  EditDonor,
  CashReceiptDonor,
  MaterialReceiptDonor,
  FamilyMemberDonor,
  EditDuplicateDonor,
  DeleteDuplicateDonor,
  ZeroDuplicateDonor,
  NoDuplicateDonor,
  ViewDonationReceipt,
  EditDonationReceipt,
  EditMaterialReceipt,
  ViewMaterialReceipt,
  WhatsappIncashRecepit,
  CashRecepitPrintOld,
  CashRecepitPrint,
  PdfDownloadIncashRecepit,
  WhatsappInMaterialRecepit,
  PdfDownloadInMaterialRecepit,
  AddAnimal,
  EditAnimal,
  AddAnimalMeet,
  EditAnimalMeet,
  AddBornorArrival,
  AddAnimalDead,
  AddFamilyMember,
  CreateUserButton,
};
