import React, { useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BaseUrl } from "../../../base/BaseUrl";
import MUIDataTable from "mui-datatables";
import EnquiryFilter from "../../../components/EnquiryFilter";
import { Spinner } from "@material-tailwind/react";
import {
  AddListItem,
  EditListItem,
} from "../../../components/ButtonComponents";
import { inputClass } from "../../../components/common/Buttoncss";
import { encryptId } from "../../../components/common/EncryptDecrypt";

const OpenListEnquiry = () => {
  const [openListData, setOpenListData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOpenData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BaseUrl}/fetch-item-list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const responseData = response.data.item;

        setOpenListData(responseData);
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
      name: "sno",
      label: "S.No",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => tableMeta.rowIndex + 1,
      },
    },
    {
      name: "item_name",
      label: "Name",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "item_status",
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
              <EditListItem
                // onClick={() => navigate(`/edit-enquiry/${id}`)}
                onClick={() => {
                  const encryptedId = encryptId(id); // Encrypt the ID
                  navigate(`/edit-enquiry/${encodeURIComponent(encryptedId)}`);
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
        <AddListItem
          onClick={() => navigate("/add-enquiry")}
          className={inputClass}
        />
      );
    },
  };
  let usertype = localStorage.getItem("user_type_id");

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
                <span className="text-lg font-semibold">Enquiry List</span>
              </div>
            }
            data={openListData}
            columns={columns}
            options={options}
          />
        </div>
      )}
    </Layout>
  );
};

export default OpenListEnquiry;
