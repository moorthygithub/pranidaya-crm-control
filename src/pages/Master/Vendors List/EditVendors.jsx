import { Card, CardBody, Input } from "@material-tailwind/react";
import CommonCard from "../../../components/common/dataCard/CommonCard";
import { Link, useNavigate, useParams } from "react-router-dom"; // Import useParams
import { MdKeyboardBackspace } from "react-icons/md";
import { useEffect, useState } from "react";
import Fields from "../../../components/common/TextField/TextField";
import axios from "axios";
import { toast } from "react-toastify";
import Layout from "../../../layout/Layout";
import { BaseUrl } from "../../../base/BaseUrl";
import {
  inputClass,
  inputClassBack,
} from "../../../components/common/Buttoncss";
import { decryptId } from "../../../components/common/EncryptDecrypt";

const status = [
  {
    value: "Active",
    label: "Active",
  },
  {
    value: "Inactive",
    label: "Inactive",
  },
];

const EditVendors = () => {
  const { id } = useParams();
  const decryptedId = decryptId(id);
  const navigate = useNavigate();
  const [vendor, setVendor] = useState({
    vendor_name: "",
    vendor_mobile: "",
    vendor_email: "",
    vendor_gst: "",
    vendor_address: "",
    vendor_status: "",
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // Button state for disable/enable
  // console.log("Decrypted ID:", decryptedId);

  const handleBackButton = () => {
    navigate("/VendorList");
  };

  // Validate only text input
  const validateOnlyText = (inputtxt) => {
    const re = /^[A-Za-z ]+$/;
    return inputtxt === "" || re.test(inputtxt);
  };

  // Handle input change
  const onInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "vendor_name" || name === "vendor_status") {
      if (validateOnlyText(value)) {
        setVendor((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else {
      setVendor((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    if (id) {
      axios({
        url: `${BaseUrl}/fetch-vendor-by-id/${decryptedId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          setVendor(res.data.vendor);
        })
        .catch((error) => {
          toast.error("Failed to fetch vendor details");
        });
    }
  }, [decryptedId]);

  // Handle form submission
  const onSubmit = (e) => {
    e.preventDefault();
    const data = {
      vendor_name: vendor.vendor_name,
      vendor_mobile: vendor.vendor_mobile,
      vendor_email: vendor.vendor_email,
      vendor_gst: vendor.vendor_gst,
      vendor_address: vendor.vendor_address,
      vendor_status: vendor.vendor_status,
    };

    if (document.getElementById("addIndiv").checkValidity()) {
      setIsButtonDisabled(true);

      axios({
        url: `${BaseUrl}/update-vendor/${decryptedId}`,
        method: "PUT",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          if (res.data.code == "200") {
            toast.success(res.data.msg || "Vendor updated successfully");
            navigate("/VendorList");
          } else if (res.data.code == "401") {
            toast.warning(res.data.msg || "Mobile number duplicate entry");
          } else if (res.data.code == "402") {
            toast.warning(res.data.msg || "Email ID duplicate entry");
          } else if (res.data.code == "403") {
            toast.warning(res.data.msg || "Vendor name duplicate entry");
          } else {
            toast.error(res.data.msg || "Duplicate entry");
          }
        })
        .catch((error) => {
          toast.error("An error occurred, please try again.");
        })
        .finally(() => {
          setIsButtonDisabled(false);
        });
    }
  };

  return (
    <Layout>
      <div className="p-6 mt-5 bg-white shadow-md rounded-lg">
        {/* Title */}
        <div className="flex mb-4">
          <h1 className="text-2xl text-[#464D69] font-semibold ml-2">
            Edit Vendor
          </h1>
        </div>

        {/* Form Section */}
        <form autoComplete="off" id="addIndiv" onSubmit={onSubmit}>
          <div className="md:flex gap-2 justify-start mb-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full justify-between">
              <div>
                <Fields
                  required
                  label="Vendor Name"
                  type="textField"
                  autoComplete="off"
                  name="vendor_name"
                  value={vendor.vendor_name}
                  onChange={onInputChange}
                />
              </div>
              <div>
                <Input
                  label="Mobile"
                  type="tel"
                  maxLength={10}
                  name="vendor_mobile"
                  value={vendor.vendor_mobile}
                  onChange={onInputChange}
                />
              </div>
              <div>
                <Input
                  label="Email"
                  type="email"
                  name="vendor_email"
                  value={vendor.vendor_email}
                  onChange={onInputChange}
                />
              </div>
              <div>
                <Fields
                  label="GST No"
                  type="textField"
                  autoComplete="off"
                  name="vendor_gst"
                  value={vendor.vendor_gst}
                  onChange={onInputChange}
                />
              </div>
              <div>
                <Fields
                  label="Address"
                  type="textField"
                  autoComplete="off"
                  name="vendor_address"
                  value={vendor.vendor_address}
                  onChange={onInputChange}
                />
              </div>
              <div>
                <Fields
                  required
                  title=" Status"
                  type="whatsappDropdown"
                  autoComplete="Name"
                  options={status}
                  name="vendor_status"
                  value={vendor.vendor_status}
                  onChange={onInputChange}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <button
              type="submit"
              className={inputClass}
              disabled={isButtonDisabled}
            >
              Update
            </button>
            <button
              onClick={handleBackButton}
              type="button" // Changed type to button to avoid form submission
              className={inputClassBack}
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditVendors;
