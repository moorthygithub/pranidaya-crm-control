import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import RequestFilter from "../../../components/RequestFilter";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BaseUrl } from "../../../base/BaseUrl";
import { MdEdit } from "react-icons/md";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import MUIDataTable from "mui-datatables";
import moment from "moment";
import { Spinner } from "@material-tailwind/react";
import {
  EditMaterialReceipt,
  ViewMaterialReceipt,
} from "../../../components/ButtonComponents";
import { encryptId } from "../../../components/common/EncryptDecrypt";

const MaterialReceipts = () => {
  const [materialdata, setMaterialData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApprovedRData = async () => {
      setLoading(true);

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BaseUrl}/fetch-m-receipt-list`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const res = response.data?.receipts;

        setMaterialData(res);
      } catch (error) {
        console.error("Error fetching approved list request data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedRData();
  }, []);

  const columns = [
    {
      name: "m_receipt_no",
      label: "Receipt No",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "m_receipt_date",
      label: "Date",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) => {
          return moment(value).format("DD-MM-YYYY");
        },
      },
    },
    {
      name: "donor_full_name",
      label: "Name",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "m_receipt_total_amount",
      label: "Approx Value",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "m_receipt_count",
      label: "No of Items",
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
              <ViewMaterialReceipt
                onClick={() => navigate(`/material-view/${id}`)}
                // onClick={() => {
                //   const encryptedId = encryptId(id); // Encrypt the ID
                //   navigate(`/material-view/${encodeURIComponent(encryptedId)}`);
                // }}
                className="h-5 w-5 cursor-pointer text-blue-500"
              />

              <EditMaterialReceipt
                // onClick={() => navigate(`/material-edit/${id}`)}
                onClick={() => {
                  const encryptedId = encryptId(id); // Encrypt the ID
                  navigate(`/material-edit/${encodeURIComponent(encryptedId)}`);
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
    filter: false,
    responsive: "standard",
    viewColumns: true,
    download: false,
    print: false,
  };

  return (
    <Layout>
      <RequestFilter />

      <div className="mt-5">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner className="h-6 w-6" />
          </div>
        ) : (
          <MUIDataTable
            title={
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">
                  {" "}
                  Material Receipts List
                </span>
              </div>
            }
            data={materialdata ? materialdata : []}
            columns={columns}
            options={options}
          />
        )}
      </div>
    </Layout>
  );
};

export default MaterialReceipts;
