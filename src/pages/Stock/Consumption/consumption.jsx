import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import DeliveryFilter from "../../../components/DeliveryFilter";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BaseUrl } from "../../../base/BaseUrl";
import { MdEdit } from "react-icons/md";
import MUIDataTable from "mui-datatables";
import moment from "moment";
import { Spinner } from "@material-tailwind/react";
import {
  AddConsumption,
  EditConsumption,
} from "../../../components/ButtonComponents";
import { inputClass } from "../../../components/common/Buttoncss";
import { encryptId } from "../../../components/common/EncryptDecrypt";

const Consumption = () => {
  const [consumptionList, setConsumptionList] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchdeliveryDData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BaseUrl}/fetch-cons-list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const res = response.data?.cons;

        setConsumptionList(res);
      } catch (error) {
        console.error("Error fetching deliverd list Delivery data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchdeliveryDData();
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
      name: "cons_date",
      label: " Date ",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) => moment(value).format("DD-MM-YYYY"),
      },
    },
    {
      name: "cons_count",
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
              <EditConsumption
                // onClick={() => navigate(`/edit-consumption/${id}`)}
                onClick={() => {
                  const encryptedId = encryptId(id);
                  navigate(
                    `/edit-consumption/${encodeURIComponent(encryptedId)}`
                  );
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
        <AddConsumption
          onClick={() => navigate("/add-consumption")}
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
                <span className="text-lg font-semibold"> Consumption List</span>
              </div>
            }
            data={consumptionList ? consumptionList : []}
            columns={columns}
            options={options}
          />
        </div>
      )}
    </Layout>
  );
};

export default Consumption;
