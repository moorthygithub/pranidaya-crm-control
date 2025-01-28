import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import DeliveryFilter from "../../../components/DeliveryFilter";
import { ContextPanel } from "../../../utils/ContextPanel";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BaseUrl } from "../../../base/BaseUrl";
import { MdEdit, MdKeyboardBackspace } from "react-icons/md";
import MUIDataTable from "mui-datatables";
import moment from "moment";
import { AddFamilyMember } from "../../../components/ButtonComponents";

const FamilyList = () => {
  const [FamilyList, setFamilyList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchdeliveryDData = async () => {
      try {
        setLoading(true);
        localStorage.setItem("donor_fts_id", id);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BaseUrl}/fetch-family-member-by-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // const res = response.data.donor;
        setFamilyList(response.data.donor);
      } catch (error) {
        console.error("Error fetching deliverd list Delivery data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchdeliveryDData();
    setLoading(false);
  }, []);

  const columns = [
    {
      name: "family_full_name",
      label: "Name",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "family_relation",
      label: "Relation",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "family_status",
      label: "Status",
      options: {
        filter: false,
        sort: false,
      },
    },
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
    filter: false,
  };
  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
        {/* <MdKeyboardBackspace
              // onClick={handleBackButton}
              className="text-white bg-[#464D69] p-1 w-10 h-8 cursor-pointer rounded-2xl"
            />
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
          Family Member List{" "}
        </h3> */}
        <div className="flex items-center">
          <MdKeyboardBackspace
            onClick={() => {
              navigate("/donor-list");
            }}
            className="text-white bg-[#464D69] p-1 w-10 h-8 cursor-pointer rounded-2xl"
          />
          <h1 className="text-2xl text-[#464D69] font-semibold ml-2">
            Family Member List
          </h1>
        </div>

        <AddFamilyMember
          onClick={() => navigate("/add-family")}
          className="flex flex-row items-center gap-1 text-center text-sm font-[400] cursor-pointer text-white bg-blue-600 hover:bg-red-700 p-2 rounded-lg shadow-md"
        />
      </div>
      <div className="mt-5">
        <MUIDataTable data={FamilyList} columns={columns} options={options} />
      </div>
    </Layout>
  );
};

export default FamilyList;
