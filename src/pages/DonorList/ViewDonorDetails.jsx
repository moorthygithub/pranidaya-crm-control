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
import { inputClass } from "../../components/common/Buttoncss";
import { decryptId } from "../../components/common/EncryptDecrypt";
const TABLE_HEAD = ["Full Name", "Relation"];

const ViewDonorDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const decryptedId = decryptId(id);

  const [donor, setDonor] = useState(null);
  const [donorfam, setDonorFam] = useState([]);
  const [company, setCompany] = useState([]);
  const [famgroup, setFamGroup] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const fetchRecepitData = async () => {
      try {
        const res = await axios.get(
          `${BaseUrl}/fetch-donor-view-by-id/${decryptedId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

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
  }, [decryptedId]);

  const handleBackButton = () => {
    navigate("/donor-list");
  };

  const Section = ({ title, children }) => (
    <div className="mb-6">
      <h1 className="text-lg font-bold">{title}</h1>
      <div>{children}</div>
    </div>
  );

  const InfoRow = ({ label, value }) => (
    <div className="text-gray-700">
      <strong>{label}</strong>
      <div className="text-blue-400 inline-flex ml-1">{value}</div>
    </div>
  );
  console.log(famgroup, "fam");
  return (
    <Layout>
      <div className="p-6 mt-5 bg-white shadow-md rounded-lg">
        <div>
          <div className="flex justify-between mb-4 mt-6 items-center">
            <div className="flex items-center">
              <h1 className="text-2xl text-[#464D69] font-semibold ml-2">
                Donor Details
              </h1>
            </div>

            <button
              onClick={() => navigate(`/recepitdonor-list/${id}`)}
              className={inputClass}
            >
              + Receipts Details
            </button>
          </div>

          {loader ? (
            <div className="flex justify-center items-center h-64">
              <Spinner className="h-6 w-6" />
            </div>
          ) : (
            <div className="p-6 mt-5">
              {/* Donor Details */}
              <div className="flex flex-col md:flex-row justify-between items-center md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
                <div className="text-gray-700">
                  <strong className="font-semibold">
                    {donor.donor_type === "Individual" ? "" : "M/S:"}
                  </strong>
                  <div className="text-blue-400 inline-flex ml-1 text-lg">
                    {donor.donor_type === "Individual" ? (
                      <>
                        {donor.donor_title} {donor.donor_full_name}
                      </>
                    ) : (
                      <>{donor.donor_full_name}</>
                    )}
                  </div>
                </div>
                <div className="text-gray-700">
                  <strong className="font-semibold">Pds Id :</strong>
                  <div className="text-blue-400 inline-flex ml-1 text-lg">
                    {donor.donor_fts_id}
                  </div>
                </div>
                <div className="text-gray-700">
                  <strong className="font-semibold">Family Group of:</strong>
                  <div className="text-blue-400 inline-flex ml-1 text-lg">
                    {famgroup.length > 0 && famgroup[0].donor_full_name
                      ? famgroup[0].donor_full_name
                      : ""}
                  </div>
                </div>
              </div>

              {/* Donor Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {donor && (
                  <>
                    <div className="text-gray-700">
                      <strong className="font-semibold">Father Name:</strong>
                      <div className="text-blue-400 inline-flex ml-1">
                        {donor.donor_father_name || ""}
                      </div>
                    </div>

                    <div className="text-gray-700">
                      <strong className="font-semibold">Mother Name:</strong>
                      <div className="text-blue-400 inline-flex ml-1">
                        {donor.donor_mother_name || ""}
                      </div>
                    </div>

                    {/* Individual Details */}
                    {donor.donor_type === "Individual" && (
                      <>
                        <div className="text-gray-700">
                          <strong className="font-semibold">DOA:</strong>
                          <div className="text-blue-400 inline-flex ml-1">
                            {donor.donor_doa
                              ? moment(donor.donor_doa).format("DD-MM-YYYY")
                              : ""}
                          </div>
                        </div>

                        <div className="text-gray-700">
                          <strong className="font-semibold">DOB:</strong>
                          <div className="text-blue-400 inline-flex ml-1">
                            {donor.donor_dob_annualday
                              ? moment(donor.donor_dob_annualday).format(
                                  "DD-MM-YYYY"
                                )
                              : ""}
                          </div>
                        </div>

                        <div className="text-gray-700">
                          <strong className="font-semibold">Gender:</strong>
                          <div className="text-blue-400 inline-flex ml-1">
                            {donor.donor_gender || ""}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Non-Individual Details */}
                    {donor.donor_type !== "Individual" && (
                      <>
                        <div className="text-gray-700">
                          <strong className="font-semibold">
                            Contact Name:
                          </strong>
                          <div className="text-blue-400 inline-flex ml-1">
                            {donor.donor_contact_name || ""}
                          </div>
                        </div>

                        <div className="text-gray-700">
                          <strong className="font-semibold">Gender:</strong>
                          <div className="text-blue-400 inline-flex ml-1">
                            {donor.donor_gender || ""}
                          </div>
                        </div>

                        <div className="text-gray-700">
                          <strong className="font-semibold">Annual Day:</strong>
                          <div className="text-blue-400 inline-flex ml-1">
                            {donor.donor_dob_annualday
                              ? moment(donor.donor_dob_annualday).format(
                                  "DD-MM-YYYY"
                                )
                              : donor.donor_dob_annualday || ""}
                          </div>
                        </div>

                        <div className="text-gray-700">
                          <strong className="font-semibold">PAN Number:</strong>
                          <div className="text-blue-400 inline-flex ml-1">
                            {donor.donor_pan_no || ""}
                          </div>
                        </div>

                        <div className="text-gray-700">
                          <strong className="font-semibold">Donor Type:</strong>
                          <div className="text-blue-400 inline-flex ml-1">
                            {donor.donor_type || ""}
                          </div>
                        </div>

                        <div className="text-gray-700">
                          <strong className="font-semibold">Remarks:</strong>
                          <div className="text-blue-400 inline-flex ml-1">
                            {donor.donor_remarks || ""}
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Communication Details */}
              <h1 className="text-xl font-semibold text-gray-800 my-6">
                Communication Details
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {donor && (
                  <>
                    <div className="text-gray-700">
                      <strong className="font-semibold">Mobile:</strong>
                      <div className="text-blue-400 inline-flex ml-1">
                        {donor.donor_mobile || ""}
                      </div>
                    </div>

                    <div className="text-gray-700">
                      <strong className="font-semibold">WhatsApp:</strong>
                      <div className="text-blue-400 inline-flex ml-1">
                        {donor.donor_whatsapp || ""}
                      </div>
                    </div>

                    <div className="text-gray-700">
                      <strong className="font-semibold">Email:</strong>
                      <div className="text-blue-400 inline-flex ml-1">
                        {donor.donor_email || ""}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Address Details */}
              <h1 className="text-xl font-semibold text-gray-800 my-6">
                Address Details
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {donor && (
                  <div className="text-gray-700">
                    <strong className="font-semibold">Address:</strong>
                    <div className="text-blue-400 inline-flex ml-1">
                      {donor.donor_address}, {donor.donor_area},{" "}
                      {donor.donor_ladmark},{donor.donor_city},{" "}
                      {donor.donor_state} - {donor.donor_pin_code}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* //FAMILY  */}
        <div className="flex justify-center mt-4">
          <div className="p-4 w-full overflow-x-auto">
            {loader ? (
              <div className="flex justify-center items-center h-64">
                <Spinner className="h-6 w-6" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="flex justify-between items-center p-4">
                  <div className="text-xl md:text-2xl font-bold">
                    Family Details
                  </div>
                </div>
                <table className="w-full border-collapse border border-gray-200 mb-[10px] text-sm">
                  <thead>
                    <tr className="bg-gray-200">
                      {TABLE_HEAD.map((head) => (
                        <th className="border p-2">{head}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {donorfam.length === 0 ? (
                      <tr>
                        <td
                          colSpan="4"
                          className="border p-2 text-center text-gray-500"
                        >
                          No data available
                        </td>
                      </tr>
                    ) : (
                      donorfam.map((stockItem, index) => (
                        <tr key={index} className="border">
                          <td className="border p-2 text-center">
                            {" "}
                            {stockItem.family_full_name}
                          </td>
                          <td className="border p-2 text-center">
                            {" "}
                            {stockItem.family_relation}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ViewDonorDetails;
