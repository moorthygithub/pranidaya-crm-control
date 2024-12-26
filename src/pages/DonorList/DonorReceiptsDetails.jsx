import Layout from "../../layout/Layout";
import { Card, Typography, Button, Spinner } from "@material-tailwind/react";
import { LuDownload } from "react-icons/lu";
import { MdKeyboardBackspace } from "react-icons/md";
import { IoIosPrint } from "react-icons/io";
import { BaseUrl } from "../../base/BaseUrl";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment/moment";

const TABLE_HEAD = ["R.No", "Name", "Date", "Amount"];

function DonorReceiptsDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [donation, setDonation] = useState([]);
  const [famgroup, setFamgroup] = useState([]);
  const [membership, setMembership] = useState([]);
  const [loader, setLoader] = useState(true);

  // DATA FOR THE TABLE DONATION DETAILS
  useEffect(() => {
    const fetchRecepitData = async () => {
      try {
        const res = await axios.get(
          `${BaseUrl}/fetch-donor-receipt-by-id-new/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setDonation(res.data.donor_receipts || []);
        setFamgroup(res.data.related_group || []);
        setMembership(res.data.membership_details || []);

        console.log(res.data);
      } catch (error) {
        console.error("Error fetching donor data:", error);
      } finally {
        setLoader(false);
      }
    };

    fetchRecepitData();
  }, []);

  // DATA FOR THE TABLE MEMEBER DETAILS

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-2 bg-white rounded-lg">
        <div className="flex flex-row justify-start p-2">
          <MdKeyboardBackspace
            className="text-white bg-[#464D69] p-1 w-10 h-8 cursor-pointer rounded-2xl"
            onClick={() => navigate("/donor-list")}
          />
          <h1 className="text-xl md:text-2xl text-[#464D69] font-semibold ml-2">
            Receipts Details
          </h1>
        </div>
        <div className="flex flex-col md:flex-row justify-center md:justify-end items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="text-gray-700">
            <strong>Family Group of:{famgroup[0]?.donor_full_name}</strong>
            {/* {donor.donor_fts_id} */}
          </div>{" "}
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <Card className="p-4 w-full overflow-x-auto">
          {loader ? (
            <div className="flex justify-center items-center h-64">
              <Spinner className="h-12 w-12" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="flex justify-center">
                <div className="p-4 text-xl md:text-2xl flex justify-center font-bold">
                  Donation Details
                </div>
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
                  {donation.length > 0 ? (
                    donation.map((stockItem, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal "
                            >
                              {stockItem.c_receipt_no}{" "}
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
                              {moment(stockItem.c_receipt_date).format(
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
                              {stockItem.c_receipt_total_amount}{" "}
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
      </div>

      {/* <div className="flex justify-center mt-4">
        <Card className="p-4 w-full overflow-x-auto">
          {loader ? (
            <div className="flex justify-center items-center h-64">
              <Spinner className="h-12 w-12" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="flex justify-center">
                <div className="p-4 text-xl md:text-2xl flex justify-center font-bold">
                  Membership Details
                </div>
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
                  {membership.length > 0 ? (
                    donation.map((stockItem, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {stockItem.receipt_no}{" "}
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
                              {moment(stockItem.receipt_date).format(
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
                              {stockItem.receipt_total_amount}{" "}
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
}

export default DonorReceiptsDetails;
