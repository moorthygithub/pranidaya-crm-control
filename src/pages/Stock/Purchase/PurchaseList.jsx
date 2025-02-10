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
import { encryptId } from "../../../components/common/EncryptDecrypt";
const PurchaseList = () => {
  const [pendingDListData, setPendingDListData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //encryption
  // const secretKey = "AGSOLUTION@123";

  // const encryptId = (id) => {
  //   if (!id) {
  //     console.error("ID is missing");
  //     return "";
  //   }
  //   return CryptoJS.AES.encrypt(id.toString(), secretKey).toString();
  // };
  useEffect(() => {
    const fetchOpenData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BaseUrl}/fetch-purchase-list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const responseData = response.data.purchase;

        setPendingDListData(responseData);
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
      name: "purchase_date",
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
              {/* <EditPurchase
                onClick={() => navigate(`/edit-purchase/${id}`)}
                className="h-5 w-5 cursor-pointer text-blue-500"
              /> */}
              {/* <EditPurchase
                onClick={() => {
                  const encryptedId = encryptId(id);
                  navigate(`/edit-purchase/${encodeURIComponent(encryptedId)}`);
                }}
                className="h-5 w-5 cursor-pointer text-blue-500"
              /> */}
              <div className="flex items-center space-x-2">
                <EditPurchase
                  onClick={() => {
                    const encryptedId = encryptId(id); // Encrypt the ID
                    navigate(
                      `/edit-purchase/${encodeURIComponent(encryptedId)}`
                    );
                  }}
                  className="h-5 w-5 cursor-pointer text-blue-500"
                />
              </div>
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
