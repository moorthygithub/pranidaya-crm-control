import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import DeliveryFilter from "../../../components/DeliveryFilter";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BaseUrl } from "../../../base/BaseUrl";
import MUIDataTable from "mui-datatables";
import { NumericFormat } from "react-number-format";
import { Spinner } from "@material-tailwind/react";

const Stock = () => {
  const [stockList, setStockList] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        setLoading(true);
        const response = await axios.post(
          `${BaseUrl}/fetch-item-stock`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const res = response.data?.stock;

        setStockList(res);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns = [
    {
      name: "SlNo",
      label: "S.No",
      options: {
        filter: false,
        print: true,
        download: true,
        sort: false,
        customBodyRender: (value, tableMeta) => tableMeta.rowIndex + 1,
      },
    },
    {
      name: "item_name",
      label: "Item Name",
      options: {
        filter: false,
        print: true,
        download: true,
        sort: false,
      },
    },
    {
      name: "openpurch",
      label: "Open Balance",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) => (
          <NumericFormat
            thousandSeparator
            thousandsGroupStyle="lakh"
            displayType="text"
            value={value}
          />
        ),
      },
    },
    {
      name: "purch",
      label: "Received",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) => (
          <NumericFormat
            thousandSeparator
            thousandsGroupStyle="lakh"
            displayType="text"
            value={value}
          />
        ),
      },
    },
    {
      name: "sale",
      label: "Consumption",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) => (
          <NumericFormat
            thousandSeparator
            thousandsGroupStyle="lakh"
            displayType="text"
            value={value}
          />
        ),
      },
    },
    {
      name: "close_balance",
      label: "Close Balance",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (_, tableMeta) => {
          const item = stockList[tableMeta.rowIndex];
          const closeBalance =
            item.openpurch - item.closesale + (item.purch - item.sale);
          return (
            <NumericFormat
              thousandSeparator
              thousandsGroupStyle="lakh"
              displayType="text"
              value={closeBalance}
            />
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
                <span className="text-lg font-semibold">
                  Stocks List ( In Kgs )-Current Month
                </span>
              </div>
            }
            data={stockList ? stockList : []}
            columns={columns}
            options={options}
          />
        </div>
      )}
    </Layout>
  );
};

export default Stock;
