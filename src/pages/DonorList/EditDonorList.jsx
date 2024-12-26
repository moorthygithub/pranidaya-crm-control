import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button, Input } from "@material-tailwind/react";
import  { BaseUrl } from "../../base/BaseUrl";
import Layout from "../../layout/Layout";
import Fields from "../../components/common/TextField/TextField";
import { toast } from "react-toastify";
import InputMask from "react-input-mask";
import FamilyGroupModal from "./FamilyGroupModa";

const gender = [
  {
    value: "Male",
    label: "Male",
  },
  {
    value: "Female",
    label: "Female",
  },
];

const title = [
  {
    value: "Shri",
    label: "Shri",
  },
  {
    value: "Smt.",
    label: "Smt.",
  },
  {
    value: "Kum",
    label: "Kum",
  },
  {
    value: "Dr.",
    label: "Dr.",
  },
];

const title1 = [
  {
    value: "M/s",
    label: "M/s",
  },
];

const EditDonorList = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [donor, setDonor] = useState({
    donor_full_name: "",
    donor_title: "",
    donor_gender: "",
    donor_father_name: "",
    donor_mother_name: "",
    donor_spouse_name: "",
    donor_contact_name: "",
    donor_contact_designation: "",
    donor_dob_annualday: "",
    donor_doa: "",
    donor_pan_no: "",
    donor_image_logo: "",
    donor_remarks: "",
    donor_type: "",
    donor_mobile: "",
    donor_whatsapp: "",
    donor_email: "",
    donor_address: "",
    donor_area: "",
    donor_ladmark: "",
    donor_city: "",
    donor_state: "",
    donor_pin_code: "",
  });

  const validateOnlyDigits = (inputtxt) => {
    var phoneno = /^\d+$/;
    if (inputtxt.match(phoneno) || inputtxt.length == 0) {
      return true;
    } else {
      return false;
    }
  };

  const onInputChange = (e) => {
    if (e.target.name == "donor_mobile") {
      if (validateOnlyDigits(e.target.value)) {
        setDonor({
          ...donor,
          [e.target.name]: e.target.value || "",
        });
      }
    } else if (e.target.name == "donor_whatsapp") {
      if (validateOnlyDigits(e.target.value)) {
        setDonor({
          ...donor,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name == "donor_pin_code") {
      if (validateOnlyDigits(e.target.value)) {
        setDonor({
          ...donor,
          [e.target.name]: e.target.value,
        });
      }
    } else {
      setDonor({
        ...donor,
        [e.target.name]: e.target.value,
      });
    }
  };
  const onChangePanNumber = (e) => {
    setDonor({ ...donor, donor_pan_no: e.target.value });
  };
  const onSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting data: ", donor);
    setIsButtonDisabled(true);
    let data = {
      donor_full_name: donor.donor_full_name,
      donor_title: donor.donor_title,
      donor_type: donor.donor_type,
      donor_gender: donor.donor_gender,
      donor_father_name: donor.donor_father_name,
      donor_mother_name: donor.donor_mother_name,
      donor_spouse_name: donor.donor_spouse_name,
      donor_contact_name: donor.donor_contact_name,
      donor_contact_designation: donor.donor_contact_designation,
      donor_dob_annualday: donor.donor_dob_annualday,
      donor_doa: donor.donor_doa,
      donor_pan_no: donor.donor_pan_no,
      donor_image_logo: donor.donor_image_logo,
      donor_remarks: donor.donor_remarks,
      donor_mobile: donor.donor_mobile,
      donor_whatsapp: donor.donor_whatsapp,
      donor_email: donor.donor_email,
      donor_address: donor.donor_address,
      donor_area: donor.donor_area,
      donor_ladmark: donor.donor_ladmark,
      donor_city: donor.donor_city,
      donor_state: donor.donor_state,
      donor_pin_code: donor.donor_pin_code,
    };
    try {
      const response = await axios({
        url: BaseUrl + "/update-donor-by-id/" + id,
        method: "PUT",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("Response: ", response);
      if (response.data.code == 201) {
        toast.success(response.data.msg || "Data Updated Successfully");
        navigate("/donor-list");
      } else if (response.data && response.data.code == 401) {
        toast.error(response.data.msg || "Email Duplicate Entry");
      } else if (response.data && response.data.code == 402) {
        toast.error(response.data.msg || "Mobile Duplicate Entry");
      } else {
        toast.error(response.data.msg || "Data Duplicate Entry");
      }
    } catch (error) {
      console.error("Error updating Course:", error);
      toast.error("Error updating Course");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  //FETCH STATE
  const [states, setStates] = useState([]);
  useEffect(() => {
    var theLoginToken = localStorage.getItem("token");

    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + theLoginToken,
      },
    };

    fetch(BaseUrl + "/fetch-states", requestOptions)
      .then((response) => response.json())
      .then((data) => setStates(data.states));
  }, []);
  const company_type = [
    { label: "Individual", value: "Individual" },
    { label: "Private", value: "Private" },
    { label: "Public", value: "Public" },
    { label: "PSU", value: "PSU" },
    { label: "Trust", value: "Trust" },
    { label: "Society", value: "Society" },
    { label: "Others", value: "Others" },
  ];

  //FAMILY PATCH
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  //GET DATA
  useEffect(() => {
    axios({
      url: `${BaseUrl}/fetch-donor-by-id/${id}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        setDonor(res.data.donor);
      })
      .catch((error) => {
        console.error("Error fetching donor details:", error);
      });
  }, [id]);

  //FamilyGroupstatus
  const handleFamilyGroupStatus = (status) => {
    let data = {};

    if (status === "add_to_family_group") {
      data = {
        donor_related_id: family_related_id,
      };
    } else if (status === "leave_family_group") {
      data = {
        leave_family_group: true,
      };
    }

    axios({
      url: `${BaseUrl}/update-donor-by-id/${id}`,
      method: "PUT",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        toast.success("Data Successfully Updated");

        setShowModal(false);
      })
      .catch((err) => {
        toast.error("Error updating data, please try again.");
      });
  };

  return (
    <Layout>
      <div>
        {/* Title */}
        <div className="flex mb-4 mt-6">
          <Link to="/donor-list">
            <MdKeyboardBackspace className=" text-white bg-[#464D69] p-1 w-10 h-8 cursor-pointer rounded-2xl" />
          </Link>
          <h1 className="text-2xl text-[#464D69] font-semibold ml-2 content-center">
            Edit Donor
          </h1>
        </div>
        <div className="p-6 mt-5 bg-white shadow-md rounded-lg">
          <h1 className="p-4 mb-2">Personal Details </h1>
          <form onSubmit={onSubmit} autoComplete="off">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
              <div className="w-full">
                <Fields
                  title="Donor Type"
                  required={true}
                  name="donor_type"
                  value={donor.donor_type}
                  options={company_type}
                  type="whatsappDropdown"
                  onChange={(e) => onInputChange(e)}
                />
              </div>
              <div className="mb-4">
                <Fields
                  required
                  select
                  title="Title"
                  type="TitleDropDown"
                  name="donor_title"
                  value={donor.donor_title}
                  onChange={(e) => onInputChange(e)}
                  options={donor.donor_type == "Individual" ? title : title1}
                />
              </div>
              <div>
                <Fields
                  required={true}
                  title="Full Name"
                  type="textField"
                  autoComplete="Name"
                  name="donor_full_name"
                  value={donor.donor_full_name}
                  onChange={(e) => onInputChange(e)}
                />
              </div>
              <div className="w-full">
                <Fields
                  title="Gender"
                  required={true}
                  name="donor_gender"
                  value={donor.donor_gender}
                  options={gender}
                  type="whatsappDropdown"
                  onChange={(e) => onInputChange(e)}
                />
              </div>

              {donor.donor_type == "Individual" ? (
                ""
              ) : (
                <div>
                  <Input
                    label="Contact Name"
                    // type="number"
                    name="donor_contact_name"
                    value={donor.donor_contact_name}
                    onChange={(e) => onInputChange(e)}
                  />
                </div>
              )}

              {donor.donor_type == "Individual" ? (
                ""
              ) : (
                <div>
                  <Input
                    label="Contact Designation"
                    // type="number"
                    name="donor_contact_designation"
                    value={donor.donor_contact_designation}
                    onChange={(e) => onInputChange(e)}
                  ></Input>
                </div>
              )}

              <div className="col-sm-6 col-md-6 col-xl-3">
                <InputMask
                  mask="aaaaa 9999 a"
                  formatChars={{
                    9: "[0-9]",
                    a: "[a-zA-Z]",
                  }}
                  value={donor.donor_pan_no}
                  onChange={onChangePanNumber}
                >
                  {(inputProps) => (
                    <Fields
                      title="PAN Number"
                      type="textField"
                      autoComplete="Name"
                      name="donor_pan_no"
                      {...inputProps}
                    />
                  )}
                </InputMask>
              </div>
              {/* //FATHER NAMES */}
              {donor.donor_type == "Individual" ? (
                <div>
                  <Fields
                    title="Father Name"
                    type="textField"
                    autoComplete="Name"
                    name="donor_father_name"
                    value={donor.donor_father_name}
                    onChange={(e) => onInputChange(e)}
                  />
                </div>
              ) : (
                ""
              )}
              {donor.donor_type == "Individual" ? (
                <div>
                  <Fields
                    title="Mother Name"
                    type="textField"
                    autoComplete="Name"
                    name="donor_mother_name"
                    value={donor.donor_mother_name}
                    onChange={(e) => onInputChange(e)}
                  />
                </div>
              ) : (
                ""
              )}
              {donor.donor_type == "Individual" ? (
                <div>
                  <Fields
                    title="Spouse Name"
                    type="textField"
                    autoComplete="Name"
                    name="donor_spouse_name"
                    value={donor.donor_spouse_name}
                    onChange={(e) => onInputChange(e)}
                  />
                </div>
              ) : (
                ""
              )}
              {donor.donor_type == "Individual" ? (
                <div className="w-full">
                  <Input
                    type="date"
                    label="DOB"
                    name="donor_dob_annualday"
                    className="required"
                    value={donor.donor_dob_annualday}
                    onChange={(e) => onInputChange(e)}
                  />
                </div>
              ) : (
                ""
              )}
              <div className="w-full">
                <Input
                  type="date"
                  label={donor.donor_type == "Individual" ? "DOA" : "DOI"}
                  name="donor_doa"
                  className="required"
                  value={donor.donor_doa}
                  onChange={(e) => onInputChange(e)}
                />
              </div>
            </div>
            <div>
              <Fields
                title="Remarks"
                type="textField"
                autoComplete="Name"
                name="donor_remarks"
                value={donor.donor_remarks}
                onChange={(e) => onInputChange(e)}
              />
            </div>
            {/* //COMMIMCATION */}
            <h1 className="p-2 ">Communication Details</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <Fields
                  required={true}
                  title="Mobile Phone"
                  types="number"
                  type="textField"
                  autoComplete="Name"
                  name="donor_mobile"
                  maxLenght="10"
                  value={donor.donor_mobile}
                  onChange={(e) => onInputChange(e)}
                />
              </div>
              <div>
                <Fields
                  title="Whatsapp"
                  types="number"
                  type="textField"
                  autoComplete="Name"
                  maxLenght="10"
                  name="donor_whatsapp"
                  value={donor.donor_whatsapp}
                  onChange={(e) => onInputChange(e)}
                />
              </div>
              <div>
                <Fields
                  title="Email"
                  types="email"
                  type="textField"
                  autoComplete="Name"
                  name="donor_email"
                  value={donor.donor_email}
                  onChange={(e) => onInputChange(e)}
                />
              </div>
            </div>
            {/* ADDRESS */}
            <h1 className="p-2 ">Address</h1>
            <div className="mb-6">
              <Fields
                title="House&Street Number Address"
                type="textField"
                autoComplete="Name"
                name="donor_address"
                value={donor.donor_address}
                onChange={(e) => onInputChange(e)}
              />
            </div>{" "}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <Fields
                  title="City"
                  type="textField"
                  autoComplete="Name"
                  name="donor_city"
                  value={donor.donor_city}
                  onChange={(e) => onInputChange(e)}
                />
              </div>{" "}
              <div className="w-full">
                <Fields
                  title="State"
                  name="donor_state"
                  value={donor.donor_state || ""}
                  options={states}
                  type="stateDropDown"
                  onChange={(e) => onInputChange(e)}
                />
              </div>{" "}
              <div>
                <Fields
                  title="Pincode"
                  type="textField"
                  autoComplete="Name"
                  name="donor_pin_code"
                  value={donor.donor_pin_code}
                  onChange={(e) => onInputChange(e)}
                />
              </div>
            </div>
            <div className="mt-4 text-center flex flex-col sm:flex-row sm:justify-center sm:gap-2">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                disabled={isButtonDisabled}
              >
                Update
              </button>
              {donor.donor_related_id == donor.donor_fts_id ? (
                <Button color="blue" onClick={openModal}>
                  Attach to Group
                </Button>
              ) : (
                <Button color="blue" onClick={openModal} disabled>
                  Attach to Group
                </Button>
              )}

              <div>
                <FamilyGroupModal
                  showModal={showModal}
                  closeModal={closeModal}
                  handleFamilyGroupStatus={handleFamilyGroupStatus}
                  id={donor.donor_fts_id}
                />
              </div>
              {donor.donor_related_id == donor.donor_fts_id ? (
                <Button
                  color="red"
                  disabled
                  onClick={() => handleFamilyGroupStatus("leave_family_group")}
                >
                  Leave Group
                </Button>
              ) : (
                <Button
                  color="red"
                  onClick={() => handleFamilyGroupStatus("leave_family_group")}
                >
                  Leave Group
                </Button>
              )}

              <Link to="/donor-list">
                <button className="bg-green-500 text-white px-4 py-2 rounded-md">
                  Back
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditDonorList;
