import React, { useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import DeliveryFilter from "../../../components/DeliveryFilter";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BaseUrl } from "../../../base/BaseUrl";
import MUIDataTable from "mui-datatables";
import moment from "moment";
import { Spinner } from "@material-tailwind/react";
import {
  AddPurchase,
  EditPurchase,
} from "../../../components/ButtonComponents";
import { inputClass } from "../../../components/common/Buttoncss";
import CryptoJS from "crypto-js";

const PurchaseList = () => {
  const [pendingDListData, setPendingDListData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const secretKey = "!^&^!&!apicall1209437477436@%%@&&!&!";

  // Encrypting the request payload
  const encryptRequest = (data) => {
    return CryptoJS.AES.encrypt(data, secretKey).toString();
  };

  // Decrypt the response
  const decryptResponse = (encryptedData) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8); // Decrypts and returns the string
  };

  useEffect(() => {
    const fetchOpenData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        // Example: Encrypt the endpoint and any query parameters (e.g., page number, ID)
        const encryptedUrl = encryptRequest("fetch-purchase-list");

        const response = await axios.get(`${BaseUrl}/fetch-purchase-list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            encryptedUrl, // Send encrypted data as a parameter
          },
        });

        if (response.status === 200) {
          // Assuming the server sends back encrypted data that needs to be decrypted
          const decryptedData = response.data.purchase.map((item) => {
            return {
              ...item,
              vendor_name: decryptResponse(item.vendor_name),
              purchase_bill_no: decryptResponse(item.purchase_bill_no),
            };
          });

          setPendingDListData(decryptedData);
        }
      } catch (error) {
        console.error("Error fetching purchase list data", error);
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
      name: "Date",
      label: " Date ",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) => moment(value).format("DD-MM-YYYY"),
      },
    },
    {
      name: "vendor_name",
      label: " Vendor ",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "purchase_bill_no",
      label: " Bill No ",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "purchase_total_bill",
      label: " Total Amount ",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "purchase_count",
      label: " No of Item ",
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
              <EditPurchase
                onClick={() => {
                  const encryptedId = encryptRequest(id); // Encrypt the ID
                  navigate(`/edit-purchase/${encodeURIComponent(encryptedId)}`);
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
        <AddPurchase
          onClick={() => navigate("/add-purchase")}
          className={inputClass}
        />
      );
    },
  };

  return (
    <Layout>
      <DeliveryFilter />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner className="h-6 w-6" />
        </div>
      ) : (
        <div className="mt-5">
          <MUIDataTable
            title={
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold"> Purchase List</span>
              </div>
            }
            data={pendingDListData ? pendingDListData : []}
            columns={columns}
            options={options}
          />
        </div>
      )}
    </Layout>
  );
};

export default PurchaseList;
