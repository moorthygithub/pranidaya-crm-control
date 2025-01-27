import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdAdd, MdKeyboardBackspace } from "react-icons/md";
import axios from "axios";
import Layout from "../../layout/Layout";
import {
  CardBody,
  Card,
  Button,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import moment from "moment";
import { BaseUrl } from "../../base/BaseUrl";
const TABLE_HEAD = ["Full Name", "Relation"];

const ViewDonorDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [donor, setDonor] = useState(null);
  const [donorfam, setDonorFam] = useState([]);
  const [company, setCompany] = useState([]);
  const [famgroup, setFamGroup] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const fetchRecepitData = async () => {
      try {
        const res = await axios.get(`${BaseUrl}/fetch-donor-view-by-id/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setDonor(res.data.donor);
        setDonorFam(res.data.family_member || []);
        setCompany(res.data.company_details);
        setFamGroup(res.data.related_group);

        console.log(res.data.family_member);
      } catch (error) {
        console.error("Error fetching donor data:", error);
      } finally {
        setLoader(false);
      }
    };

    fetchRecepitData();
  }, [id]);

  const handleBackButton = () => {
    navigate("/donor-list");
  };
  console.log(famgroup, "fam");
  return (
    <Layout>
      <div>
        <div className="flex justify-between mb-4 mt-6 items-center">
          <div className="flex items-center">
            <MdKeyboardBackspace
              onClick={handleBackButton}
              className="text-white bg-[#464D69] p-1 w-10 h-8 cursor-pointer rounded-2xl"
            />
            <h1 className="text-2xl text-[#464D69] font-semibold ml-2">
              Donor Details
            </h1>
          </div>

          <div className="text-right text-gray-700">
            <strong>Family Group of: </strong>
            {famgroup.length > 0 && famgroup[0].donor_full_name
              ? famgroup[0].donor_full_name
              : ""}
          </div>
        </div>

        {loader ? (
          <div className="flex justify-center items-center h-64">
            <Spinner className="h-12 w-12" />
          </div>
        ) : (
          <Card className="p-6 mt-5 bg-white shadow-md rounded-lg">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="text-gray-700">
                <strong>
                  {donor.donor_type == "Individual" ? "" : "M/S:"}
                </strong>
                <div className="text-blue-400 inline-flex ml-1">
                  {donor.donor_type === "Individual" ? (
                    <>
                      {donor.donor_title} {donor.donor_full_name}
                    </>
                  ) : (
                    <>{donor.donor_full_name}</>
                  )}
                </div>{" "}
              </div>
              <div className="text-gray-700">
                <strong>Pds Id :</strong>
                <div className="text-blue-400 inline-flex ml-1">
                  {donor.donor_fts_id}
                </div>{" "}
              </div>{" "}
              <Button
                onClick={() => navigate(`/recepitdonor-list/${id}`)}
                className="bg-red-400"
              >
                Receipts Details
              </Button>
            </div>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {donor && (
                  <>
                    <div className="text-gray-700">
                      <strong>Father Name:</strong>
                      <div className="text-blue-400 inline-flex ml-1">
                        {donor.donor_father_name || ""}
                      </div>
                    </div>

                    <div className="text-gray-700">
                      <strong>Mother Name:</strong>
                      <div className="text-blue-400 inline-flex ml-1">
                        {donor.donor_mother_name || ""}
                      </div>
                    </div>

                    {/* Individual specific details */}
                    {donor.donor_type === "Individual" && (
                      <>
                        <div className="text-gray-700">
                          <strong>DOA:</strong>
                          <div className="text-blue-400 inline-flex ml-1">
                            {donor.donor_doa
                              ? moment(donor.donor_doa).format("DD-MM-YYYY")
                              : ""}
                          </div>
                        </div>

                        <div className="text-gray-700">
                          <strong>DOB:</strong>
                          <div className="text-blue-400 inline-flex ml-1">
                            {donor.donor_dob_annualday
                              ? moment(donor.donor_dob_annualday).format(
                                  "DD-MM-YYYY"
                                )
                              : ""}
                          </div>
                        </div>

                        <div className="text-gray-700">
                          <strong>Gender:</strong>
                          <div className="text-blue-400 inline-flex ml-1">
                            {donor.donor_gender || ""}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Non-Individual specific details */}
                    {donor.donor_type !== "Individual" && (
                      <>
                        <div className="text-gray-700">
                          <strong>Contact Name:</strong>
                          <div className="text-blue-400 inline-flex ml-1">
                            {donor.donor_contact_name || ""}
                          </div>
                        </div>

                        <div className="text-gray-700">
                          <strong>Gender:</strong>
                          <div className="text-blue-400 inline-flex ml-1">
                            {donor.donor_gender || ""}
                          </div>
                        </div>

                        <div className="form-group">
                          <strong>Annual Day:</strong>
                          <div className="text-blue-400 inline-flex ml-1">
                            {donor.donor_dob_annualday
                              ? moment(donor.donor_dob_annualday).format(
                                  "DD-MM-YYYY"
                                )
                              : donor.donor_dob_annualday || ""}
                          </div>
                        </div>

                        <div className="text-gray-700">
                          <strong>PAN Number:</strong>
                          <div className="text-blue-400 inline-flex ml-1">
                            {donor.donor_pan_no || ""}
                          </div>
                        </div>

                        <div className="text-gray-700">
                          <strong>Donor Type:</strong>
                          <div className="text-blue-400 inline-flex ml-1">
                            {donor.donor_type || ""}
                          </div>
                        </div>

                        <div className="text-gray-700">
                          <strong>Remarks:</strong>
                          <div className="text-blue-400 inline-flex ml-1">
                            {donor.donor_remarks || ""}
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </CardBody>

            <h1>Communication Details</h1>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {donor && (
                  <>
                    <div className="text-gray-700">
                      <strong>Mobile :</strong>
                      <div className="text-blue-400 inline-flex ml-1">
                        {donor.donor_mobile || ""}
                      </div>{" "}
                    </div>

                    <div className="text-gray-700">
                      <strong>WhatsApp :</strong>
                      <div className="text-blue-400 inline-flex ml-1">
                        {donor.donor_whatsapp || ""}
                      </div>{" "}
                    </div>

                    <div className="text-gray-700">
                      <strong>Email:</strong>{" "}
                      <div className="text-blue-400 inline-flex ml-1">
                        {donor.donor_email || ""}
                      </div>{" "}
                    </div>
                  </>
                )}
              </div>
            </CardBody>
            <h1>Address Details</h1>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {donor && (
                  <div className="text-gray-700">
                    <strong>Address :</strong>
                    <div className="text-blue-400 inline-flex ml-1">
                      {donor.donor_address}, {donor.donor_area},{" "}
                      {donor.donor_ladmark},{donor.donor_city},{" "}
                      {donor.donor_state} - {donor.donor_pin_code}
                    </div>{" "}
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        )}
      </div>

      {/* //FAMILY  */}
      <div className="flex justify-center mt-4">
        <Card className="p-4 w-full overflow-x-auto">
          {loader ? (
            <div className="flex justify-center items-center h-64">
              <Spinner className="h-12 w-12" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="flex justify-between items-center p-4">
                <div className="text-xl md:text-2xl font-bold">
                  Family Details
                </div>
                {/* <button
                  class="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                  onClick={() => {
                    navigate(`/add-donor/${id}`);
                  }}
                >
                  <MdAdd />

                  <span>Add Family</span>
                </button> */}
              </div>
              <table className="min-w-full table-auto text-left">
                <thead>
                  <tr className="bg-blue-gray-50 border-b border-blue-gray-100">
                    {TABLE_HEAD.map((head) => (
                      <th
                        key={head}
                        className="px-4 py-3 text-sm font-medium text-blue-gray-600 uppercase tracking-wider"
                      >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal leading-none opacity-70"
                        >
                          {head}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {donorfam.length > 0 ? (
                    donorfam.map((stockItem, index) => (
                      <tr
                        key={index}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-blue-gray-50/50"
                        } hover:bg-blue-gray-100`}
                      >
                        <td className="px-4 py-3 text-sm font-normal text-blue-gray-700">
                          <Typography variant="small" color="blue-gray">
                            {stockItem.family_full_name}
                          </Typography>
                        </td>
                        <td className="px-4 py-3 text-sm font-normal text-blue-gray-700 bg-blue-gray-50/50">
                          <Typography variant="small" color="blue-gray">
                            {stockItem.family_relation}
                          </Typography>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-4 text-center text-blue-gray-500"
                      >
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* //COMPANY  */}

      {/* <div className="flex justify-center mt-4">
        <Card className="p-4 w-full overflow-x-auto">
          {loader ? (
            <div className="flex justify-center items-center h-64">
              <Spinner className="h-12 w-12" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="flex justify-between items-center p-4">
                <div className="text-xl md:text-2xl font-bold">
                  Company Details
                </div>
                <button
                  class="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                  onClick={() => {
                    navigate(`/add-donor/${id}`);
                  }}
                >
                  <MdAdd />

                  <span>Add Company</span>
                </button>
              </div>

              <table className="min-w-full text-left">
                <thead>
                  <tr>
                    {TABLE_HEAD.map((head) => (
                      <th
                        key={head}
                        className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                      >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal leading-none opacity-70"
                        >
                          {head}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {company.length > 0 ? (
                    company.map((stockItem, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {stockItem.donor_fts_id}{" "}
                            </Typography>
                          </td>
                          <td className="bg-blue-gray-50/50">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {stockItem.donor_full_name}{" "}
                            </Typography>
                          </td>
                          <td>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {moment(stockItem.donor_dob_annualday).format(
                                "DD-MM-YYYY"
                              )}
                            </Typography>
                          </td>
                          <td className={` bg-blue-gray-50/50`}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {stockItem.donor_mobile}{" "}
                            </Typography>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-4 text-center">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div> */}
    </Layout>
  );
};

export default ViewDonorDetails;
