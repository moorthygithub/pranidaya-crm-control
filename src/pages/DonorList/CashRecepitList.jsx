import React, { useContext, useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { useNavigate } from "react-router-dom";
import { BaseUrl } from "../../base/BaseUrl";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import { MdKeyboardBackspace } from "react-icons/md";

import moment from "moment/moment";

const CashRecepitList = () => {
  const [cashListData, setCashListData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchOpenData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BaseUrl}/fetch-receipt-list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const responseData = response.data.receipts;

        if (Array.isArray(responseData)) {
          const tempRows = responseData.map((item, index) => [
            index + 1,
            item.donor + (donor_full_name || ""),
            moment(item.receipt_date).format("DD-MM-YYYY"),
            item.receipt_exemption_type,
            item.receipt_donation_type,
            item.receipt_total_amount,
            item.id,
          ]);
          setCashListData(tempRows);
        } else {
          console.error("Expected an array but received", responseData);
          setCashListData([]);
        }
      } catch (error) {
        console.error("Error fetching open list enquiry data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpenData();
  }, []);

  const columns = [
    {
      name: "SlNo",
      options: {
        filter: false,
        print: true,
        download: true,
      },
    },
    {
      name: "Receipt No",
      options: {
        filter: true,
        print: true,
        download: true,
        display: "included",
      },
    },
    "Name",
    "Date",
    "Exemption Type",
    "Donation Type",
    "Amount",
  ];
  const options = {
    selectableRows: "none",
    elevation: 0,
    rowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 25],
    responsive: "standard",
    viewColumns: true,
    download: false,
    print: false,
    setRowProps: (rowData) => {
      return {
        style: {
          borderBottom: "10px solid #f1f7f9",
        },
      };
    },
  };
  return (
    <Layout>
      <div className="flex flex-row justify-start p-2">
        <MdKeyboardBackspace
          className="text-white bg-[#464D69] p-1 w-10 h-8 cursor-pointer rounded-2xl"
          onClick={() => navigate("/donor-list")}
        />
        <h1 className="text-xl md:text-2xl text-[#464D69] font-semibold ml-2">
          Cash Receipts List
        </h1>
      </div>
      <div className="mt-5">
        <MUIDataTable
          data={cashListData ? cashListData : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  );
};

export default CashRecepitList;
