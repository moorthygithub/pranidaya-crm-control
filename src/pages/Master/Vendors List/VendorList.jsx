import React, { useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import EnquiryFilter from "../../../components/EnquiryFilter";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BaseUrl } from "../../../base/BaseUrl";
import MUIDataTable from "mui-datatables";
import { Spinner } from "@material-tailwind/react";
import {
  AddVendorItem,
  EditVendorItem,
} from "../../../components/ButtonComponents";
import { inputClass } from "../../../components/common/Buttoncss";
import { encryptId } from "../../../components/common/EncryptDecrypt";

const VendorList = () => {
  const [overdueListData, setOverdueListData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOpenData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BaseUrl}/fetch-vendor-list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const responseData = response.data.vendor;

        setOverdueListData(responseData);
      } catch (error) {
        console.error("Error fetching vendor list data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpenData();
  }, []);

  const columns = [
    {
      name: "sno",
      label: "S.No",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => tableMeta.rowIndex + 1,
      },
    },
    {
      name: "vendor_name",
      label: "Vendor Name",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "vendor_gst",
      label: "GST Number",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "vendor_mobile",
      label: "Mobile Number",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "vendor_email",
      label: "Email Address",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "vendor_status",
      label: "Status",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "id",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (id) => {
          return (
            <div className="flex items-center space-x-2">
              <EditVendorItem
                // onClick={() => navigate(`/EditVendors/${id}`)}
                onClick={() => {
                  const encryptedId = encryptId(id); // Encrypt the ID
                  navigate(`/EditVendors/${encodeURIComponent(encryptedId)}`);
                }}
                className="h-5 w-5 cursor-pointer text-blue-500"
              />
            </div>
          );
        },
      },
    },
  ];

  const options = {
    selectableRows: "none",
    elevation: 0,
    responsive: "standard",
    viewColumns: true,
    download: false,
    print: false,
    filter: false,
    customToolbar: () => {
      return (
        <AddVendorItem
          onClick={() => navigate("/addVendor")}
          className={inputClass}
        />
      );
    },
  };

  return (
    <Layout>
      <EnquiryFilter />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner className="h-6 w-6" />
        </div>
      ) : (
        <div className="mt-5">
          <MUIDataTable
            title={
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold"> Vendors List</span>
              </div>
            }
            data={overdueListData}
            columns={columns}
            options={options}
          />
        </div>
      )}
    </Layout>
  );
};

export default VendorList;
