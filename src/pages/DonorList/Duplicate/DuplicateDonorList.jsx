import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import { useNavigate } from "react-router-dom";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import { BaseUrl } from "../../../base/BaseUrl";
import { Spinner, Button } from "@material-tailwind/react";
import CommonListing from "../CommonListing";
import { toast } from "react-toastify";
import {
  DeleteDuplicateDonor,
  EditDuplicateDonor,
  NoDuplicateDonor,
  ZeroDuplicateDonor,
} from "../../../components/ButtonComponents";

const DuplicateDonorList = () => {
  const [duplicate, setDuplicate] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchPendingRData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BaseUrl}/fetch-donors-duplicate`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const res = response.data?.individualCompanies || [];

      const tempRows = res.map((item, index) => {
        if (item["donor_type"] === "Individual") {
          return [
            index + 1,
            item["donor_fts_id"],
            item["donor_full_name"],
            item["donor_type"],
            item["donor_spouse_name"],
            item["donor_mobile"],
            item["donor_email"],
            item["c_receipt_count"],
            item["c_receipt_count"] + "#" + item["id"],
          ];
        } else {
          return [
            index + 1,
            item["donor_fts_id"],
            item["donor_full_name"],
            item["donor_type"],
            item["donor_contact_name"],
            item["donor_mobile"],
            item["donor_email"],
            item["c_receipt_count"],
            item["c_receipt_count"] + "#" + item["id"],
          ];
        }
      });

      setDuplicate(tempRows);
    } catch (error) {
      console.error("Error fetching pending list request data", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPendingRData();
  }, []);

  // const updateData = (value) => {
  //   axios({
  //     url: BaseUrl + "/update-donors-duplicate-by-id/" + value,
  //     method: "PUT",
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem("token")}`,
  //     },
  //   }).then((res) => {
  //     console.log("receipt", res.data);
  //     setData(res.data.c_receipt_count);
  //     toast.success("Data Updated Successfully");
  //     fetchPendingRData();
  //   });
  // };

  const updateData = (value) => {
    axios({
      url: BaseUrl + "/update-donors-duplicate-by-id/" + value,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        console.log("receipt", res.data);
        toast.success("Data Updated Successfully");
        fetchPendingRData();
      })
      .catch((error) => {
        console.error("Error updating data:", error);
        toast.error("Error updating data");
      });
  };
  const columns = [
    {
      name: "#",
      label: "#",
      options: { filter: false, print: true, download: true, sort: false },
    },
    {
      name: "PDS Id",
      label: "PDS Id",
      options: { filter: false, sort: false },
    },
    { name: "Name", label: "Name", options: { filter: false, sort: false } },
    { name: "Type", label: "Type", options: { filter: false, sort: false } },
    {
      name: "Spouse/Contact",
      label: "Spouse/Contact",
      options: { filter: false, sort: false },
    },
    {
      name: "Mobile",
      label: "Mobile",
      options: { filter: false, sort: true },
    },
    { name: "Email", label: "Email", options: { filter: false, sort: false } },
    {
      name: "Receipt Count",
      label: "Receipt Count",
      options: { filter: false, sort: false },
    },
    {
      name: "Actions",
      options: {
        filter: true,
        customBodyRender: (value) => {
          return (
            <div style={{ minWidth: "150px" }}>
              {!value.startsWith(0) ? (
                <>
                  <div className="flex">
                    <EditDuplicateDonor
                      className="h-5 w-5 cursor-pointer text-blue-500 mr-3"
                      onClick={() => {
                        navigate(
                          `/edit-duplicate/${value.substr(
                            value.indexOf("#") + 1,
                            value.length - 1
                          )}`
                        );
                      }}
                    />
                    <NoDuplicateDonor
                      className="h-5 w-5 cursor-pointer text-blue-500"
                      onClick={() => {
                        navigate(
                          `/no-duplicate/${value.substr(
                            value.indexOf("#") + 1,
                            value.length - 1
                          )}`
                        );
                      }}
                    />
                    {/* <MdGroups
                      className="h-5 w-5 cursor-pointer text-blue-500 "
                      onClick={() => {
                        navigate(
                          `/no-duplicate/${value.substr(
                            value.indexOf("#") + 1,
                            value.length - 1
                          )}`
                        );
                      }}
                    /> */}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex">
                    <DeleteDuplicateDonor
                      className="h-5 w-5 cursor-pointer text-blue-500 mr-3"
                      onClick={() =>
                        updateData(value.substr(value.indexOf("#") + 1))
                      }
                    />
                    {/* <GrGroup
                      className="h-4 w-4 cursor-pointer text-blue-500"
                      onClick={() =>
                        updateData(value.substr(value.indexOf("#") + 1))
                      }
                    /> */}

                    {/* <GrGroup
                      className="h-5 w-5 cursor-pointer text-blue-500 "
                      onClick={() => {
                        navigate(
                          `/zero-duplicate/${value.substr(
                            value.indexOf("#") + 1,
                            value.length - 1
                          )}`
                        );
                      }}
                    /> */}
                    <ZeroDuplicateDonor
                      className="h-5 w-5 cursor-pointer text-blue-500 "
                      onClick={() => {
                        navigate(
                          `/zero-duplicate/${value.substr(
                            value.indexOf("#") + 1,
                            value.length - 1
                          )}`
                        );
                      }}
                    />
                  </div>
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
      <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
          Duplicate List
        </h3>
      </div>
      <div
        className="flex justify-between items-center  p-4"
        style={{ backgroundColor: "#b8f2ed" }}
      >
        <p className="text-black">
          Duplicate Criteria: If Mobile Number is Same or Donor Name is Same.
          <br />
          (Note: All the below data is not 100% duplicate. It is all recommended
          data that may be duplicated. Please make the changes very carefully.
          We advise you to make a note before removing.)
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
