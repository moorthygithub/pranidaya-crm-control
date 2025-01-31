import React, { useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import { useNavigate } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import { BaseUrl } from "../../../base/BaseUrl";
import { Spinner } from "@material-tailwind/react";
import CommonListing from "../CommonListing";
import { toast } from "react-toastify";
import {
  DeleteDuplicateDonor,
  EditDuplicateDonor,
  NoDuplicateDonor,
  ZeroDuplicateDonor,
} from "../../../components/ButtonComponents";
import { encryptId } from "../../../components/common/EncryptDecrypt";

const DuplicateDonorList = () => {
  const [duplicate, setDuplicate] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchPendingRData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BaseUrl}/fetch-donors-duplicate`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDuplicate(response.data?.individualCompanies || []);
    } catch (error) {
      console.error("Error fetching pending list request data", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPendingRData();
  }, []);

  const updateData = async (id) => {
    try {
      await axios.put(`${BaseUrl}/update-donors-duplicate-by-id/${id}`, null, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      toast.success("Data Updated Successfully");

      setDuplicate((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, c_receipt_count: 0 } : item
        )
      );

      fetchPendingRData();
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("Error updating data");
    }
  };

  const columns = [
    {
      name: "donor_fts_id",
      label: "PDS Id",
      options: { filter: false, sort: false },
    },
    {
      name: "donor_full_name",
      label: "Name",
      options: { filter: false, sort: false },
    },
    {
      name: "donor_type",
      label: "Type",
      options: { filter: false, sort: false },
    },
    {
      name: "donor_spouse_name",
      label: "Spouse/Contact",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          return tableMeta.rowData[3] === "Individual"
            ? value
            : duplicate[tableMeta.rowIndex]?.donor_contact_name;
        },
      },
    },
    { name: "donor_mobile", label: "Mobile", options: { sort: true } },
    {
      name: "donor_email",
      label: "Email",
      options: { filter: false, sort: false },
    },
    {
      name: "c_receipt_count",
      label: "Receipt Count",
      options: { filter: false, sort: false },
    },
    {
      name: "actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (_, tableMeta) => {
          const id = duplicate[tableMeta.rowIndex]?.id;
          const receiptCount = duplicate[tableMeta.rowIndex]?.c_receipt_count;

          return (
            <div className="flex space-x-3">
              {receiptCount !== 0 ? (
                <>
                  <EditDuplicateDonor
                    className="h-5 w-5 cursor-pointer text-blue-500"
                    // onClick={() => navigate(`/edit-duplicate/${id}`)}
                    onClick={() => {
                      const encryptedId = encryptId(id);
                      navigate(
                        `/edit-duplicate/${encodeURIComponent(encryptedId)}`
                      );
                    }}
                  />
                  <NoDuplicateDonor
                    className="h-5 w-5 cursor-pointer text-blue-500"
                    // onClick={() => navigate(`/no-duplicate/${id}`)}
                    onClick={() => {
                      const encryptedId = encryptId(id);
                      navigate(
                        `/no-duplicate/${encodeURIComponent(encryptedId)}`
                      );
                    }}
                  />
                </>
              ) : (
                <>
                  <DeleteDuplicateDonor
                    className="h-5 w-5 cursor-pointer text-blue-500"
                    onClick={() => updateData(id)}
                  />
                  <ZeroDuplicateDonor
                    className="h-5 w-5 cursor-pointer text-blue-500"
                    // onClick={() => navigate(`/zero-duplicate/${id}`)}
                    onClick={() => {
                      const encryptedId = encryptId(id);
                      navigate(
                        `/zero-duplicate/${encodeURIComponent(encryptedId)}`
                      );
                    }}
                  />
                </>
              )}
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
  };

  return (
    <Layout>
      <CommonListing />
      <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
          Duplicate List
        </h3>
      </div>
      <div className="flex justify-between items-center p-4 bg-teal-200">
        <p className="text-black">
          Duplicate Criteria: If Mobile Number is the same or Donor Name is the
          same.
          <br />
          (Note: All the below data is not 100% duplicate. It is all recommended
          data that may be duplicated. Please make the changes carefully.)
        </p>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner className="h-6 w-6" />
        </div>
      ) : (
        <div className="mt-5">
          <MUIDataTable data={duplicate} columns={columns} options={options} />
        </div>
      )}
    </Layout>
  );
};

export default DuplicateDonorList;
