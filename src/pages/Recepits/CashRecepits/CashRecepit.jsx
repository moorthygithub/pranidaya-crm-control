import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import RequestFilter from "../../../components/RequestFilter";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BaseUrl } from "../../../base/BaseUrl";
import { MdEdit, MdOutlineRemoveRedEye } from "react-icons/md";
import MUIDataTable from "mui-datatables";
import moment from "moment";
import { Spinner } from "@material-tailwind/react";
import {
  EditDonationReceipt,
  ViewDonationReceipt,
} from "../../../components/ButtonComponents";
import { useQuery } from "@tanstack/react-query";
import { encryptId } from "../../../components/common/EncryptDecrypt";

const fetchCashRecepitData = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${BaseUrl}/fetch-c-receipt-list`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data?.receipts ?? [];
};
const RecepitCashRecepit = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["fetchrecepitdata"],
    queryFn: fetchCashRecepitData,
  });
  const columns = [
    {
      name: "c_receipt_no",
      label: "Receipt No",
      options: {
        filter: false,
        print: true,
        download: true,
        sort: false,
      },
    },
    //1
    {
      name: "donor_full_name",
      label: "Name",
      options: {
        filter: false,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: true,
      },
    },
    //2
    {
      name: "family_full_name",
      label: "Name",
      options: {
        filter: false,
        display: "exclude",
        viewColumns: false,
        searchable: true,
        sort: true,
      },
    },

    {
      name: "full_name",
      label: "Name",
      options: {
        filter: false,
        print: true,
        download: true,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const donorName = tableMeta.rowData[1];
          const familyName = tableMeta.rowData[2];

          return familyName && familyName.trim() !== ""
            ? familyName
            : donorName;
        },
      },
    },

    {
      name: "c_receipt_date",
      label: "Date",
      options: {
        filter: false,
        print: true,
        download: true,
        sort: false,
        customBodyRender: (value) => {
          return moment(value).format("DD-MM-YYYY");
        },
      },
    },
    {
      name: "c_receipt_exemption_type",
      label: "Exemption Type",
      options: {
        filter: false,
        print: true,
        download: true,
        sort: false,
      },
    },

    {
      name: "c_receipt_total_amount",
      label: "Amount",
      options: {
        filter: false,
        print: true,
        download: true,
        sort: false,
      },
    },
    {
      name: "c_receipt_count",
      label: "No of Item",
      options: {
        filter: false,
        print: true,
        download: true,
        sort: false,
      },
    },
    {
      name: "id",
      label: "Action",
      options: {
        sort: false,
        customBodyRender: (id) => {
          return (
            <div className="flex items-center space-x-2">
              <ViewDonationReceipt
                onClick={() => navigate(`/recepit-view/${id}`)}
                // onClick={() => {
                //   const encryptedId = encryptId(id); // Encrypt the ID
                //   navigate(`/recepit-view/${encodeURIComponent(encryptedId)}`);
                // }}
                className="h-5 w-5 cursor-pointer text-blue-500"
              />

              <EditDonationReceipt
                // onClick={() => navigate(`/recepit-edit/${id}`)}
                onClick={() => {
                  const encryptedId = encryptId(id); // Encrypt the ID
                  navigate(`/recepit-edit/${encodeURIComponent(encryptedId)}`);
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
    download: false,
    print: false,
  };

  return (
    <Layout>
      <RequestFilter />

      <div className="mt-5">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner className="h-6 w-6" />
          </div>
        ) : (
          <MUIDataTable
            title={
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">
                  {" "}
                  Donation Receipts List
                </span>
              </div>
            }
            data={data || []}
            columns={columns}
            options={options}
          />
        )}
      </div>
    </Layout>
  );
};

export default RecepitCashRecepit;
