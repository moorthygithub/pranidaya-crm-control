import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BaseUrl } from "../../../base/BaseUrl";
import { MdEdit, MdKeyboardBackspace } from "react-icons/md";
import MUIDataTable from "mui-datatables";
import { AddFamilyMember } from "../../../components/ButtonComponents";
import { inputClass } from "../../../components/common/Buttoncss";
import { decryptId } from "../../../components/common/EncryptDecrypt";

const FamilyList = () => {
  const [FamilyList, setFamilyList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const decryptedId = decryptId(id);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchdeliveryDData = async () => {
      try {
        setLoading(true);
        localStorage.setItem("donor_fts_id", decryptedId);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BaseUrl}/fetch-family-member-by-id/${decryptedId}`,
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

    customToolbar: () => {
      return (
        <AddFamilyMember
          onClick={() => navigate("/add-family")}
          className={inputClass}
        />
      );
    },
  };
  return (
    <Layout>
      <div className="mt-5">
        <MUIDataTable
          title={
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold"> Family Member List</span>
            </div>
          }
          data={FamilyList}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  );
};

export default FamilyList;
