import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdClose, MdKeyboardBackspace } from "react-icons/md";
import axios from "axios";
import Layout from "../../../layout/Layout";
import Fields from "../../../components/common/TextField/TextField";
import { toast } from "react-toastify";
import { BaseUrl } from "../../../base/BaseUrl";
import {
  Button,
  Card,
  CardBody,
  Dialog,
  DialogHeader,
  DialogBody,
  Input,
} from "@material-tailwind/react";
import MUIDataTable from "mui-datatables";

const FamilyDonorDuplicate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [donorName, setDonorName] = useState("");
  const [donor, setDonor] = useState({
    donor_fts_id: "",
    indicomp_full_name: "",
    indicomp_type: "",
    indicomp_com_contact_name: "",
    indicomp_spouse_name: "",
    indicomp_mobile_phone: "",
    indicomp_email: "",
    indicomp_donor_type: "",
    indicomp_related_id: "",
  });
  console.log(id, "Params");
  // States to control the dialog
  const [showDialog, setShowDialog] = useState(false);
  const [donorData, setDonorData] = useState([]);

  const columns = [
    { name: "PDS Id", options: { filter: false, sort: false } },
    { name: "Donor Name", options: { filter: false, sort: false } },
    { name: "Mobile", options: { filter: false, sort: false } },
    {
      name: "Actions",
      options: {
        filter: false,
        sort: false,

        customBodyRender: (value) => (
          <Button onClick={() => addDonorToReceipt(value)}>Select</Button>
        ),
      },
    },
  ];

  const addDonorToReceipt = (fts_id) => {
    setDonorName(fts_id);
    setShowDialog(false);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const data = {
      donor_fts_id: donor.donor_fts_id,
      new_indicomp_fts_id: donorName,
    };

    axios
      .put(
        `${BaseUrl}/update-donors-duplicate-zero-receipt-family-member/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        toast.success("Donor Updated Successfully");
        navigate("/duplicate");
      })
      .catch(() => {
        toast.error("Error Occurred");
      });
  };

  const handleBackButton = () => {
    navigate("/duplicate");
  };

  const fetchDonorData = () => {
    axios
      .get(`${BaseUrl}/fetch-donors`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        const tempRows = res.data.individualCompanies.map((donor) => [
          donor.donor_fts_id,
          donor.donor_full_name,
          donor.donor_mobile,
          donor.donor_fts_id,
        ]);
        setDonorData(tempRows);
      })
      .catch(() => toast.error("Error fetching donor data"));
  };

  useEffect(() => {
    axios
      .get(`${BaseUrl}/fetch-donors-duplicate-by-id/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setDonor(res.data.individualCompanies));

    fetchDonorData();
  }, [id]);

  return (
    <Layout>
      <div>
        <div className="flex flex-col md:flex-row items-center justify-between mb-4 mt-6">
          <div className="flex items-center">
            <MdKeyboardBackspace
              onClick={handleBackButton}
              className="text-white bg-[#464D69] p-1 w-10 h-8 cursor-pointer rounded-2xl"
            />
            <h1 className="text-2xl text-[#464D69] font-semibold ml-2 mb-2 md:mb-0">
              Update Zero Receipt Family Member
            </h1>
          </div>
        </div>

        <Card className="p-6 mt-5 bg-white shadow-md rounded-lg">
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
              <div className="text-gray-700">
                <strong>Donor Name:</strong>
                {donor.donor_full_name}
              </div>
              <div className="text-gray-700">
                <strong>PDS ID:</strong>
                {donor.id}
              </div>
              <div className="text-gray-700">
                <strong>Type:</strong>
                {donor.donor_type}
              </div>
              <div className="text-gray-700">
                <strong>Contact Name:</strong>
                {donor.donor_contact_name}
              </div>
              <div className="text-gray-700">
                <strong>Mobile:</strong>
                {donor.donor_mobile}
              </div>
              <div className="text-gray-700">
                <strong>Email:</strong>
                {donor.donor_email}
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="p-6 mt-5 bg-white shadow-md rounded-lg">
          <form id="addIndiv" onSubmit={onSubmit}>
            <div>
              <Fields
                required
                title="Donor Name"
                type="textField"
                name="donor_fts_id"
                value={donorName}
                onClick={() => setShowDialog(true)} // Open the dialog when clicking on the field
              />
            </div>

            <div className="flex justify-center mt-4 space-x-4">
              <Button type="submit" className="bg-blue-400">
                Submit
              </Button>
              <Button className="bg-red-400" onClick={handleBackButton}>
                Back
              </Button>
            </div>
          </form>
        </div>

        <Dialog
          open={showDialog}
          handler={() => setShowDialog(false)}
          size="lg"
        >
          <DialogHeader className="flex justify-between items-center">
            <span>Select a Donor</span>
            <MdClose
              className="cursor-pointer text-gray-500"
              onClick={() => setShowDialog(false)}
              size={24}
            />
          </DialogHeader>
          <DialogBody>
            <div className="max-h-[500px] overflow-y-auto">
              <MUIDataTable
                title={"Donor List"}
                data={donorData}
                columns={columns}
                options={{
                  filterType: "textField",
                  print: false,
                  viewColumns: false,
                  filter: false,
                  searchOpen: true,
                  download: false,
                  // selectableRows: false,
                  selectableRows: "none",

                  responsive: "standard",
                  search: false,
                  pagination: true,
                  rowsPerPageOptions: [5, 10, 50],
                  rowsPerPage: 10,
                }}
              />
            </div>
          </DialogBody>
        </Dialog>
      </div>
    </Layout>
  );
};

export default FamilyDonorDuplicate;
