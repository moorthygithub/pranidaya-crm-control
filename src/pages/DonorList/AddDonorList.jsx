import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Input } from "@material-tailwind/react";
import { BaseUrl } from "../../base/BaseUrl";
import Layout from "../../layout/Layout";
import Fields from "../../components/common/TextField/TextField";
import { toast } from "react-toastify";
import Dropdown from "../../components/common/DropDown";
import InputMask from "react-input-mask";

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

const AddDonorList = () => {
  const navigate = useNavigate();
  const value = useLocation();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [donor, setDonor] = useState({
    donor_full_name: "",
    donor_title: "",
    donor_gender: "",
    donor_contact_name: "",
    donor_contact_designation: "",
    donor_father_name: "",
    donor_mother_name: "",
    donor_spouse_name: "",
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
  console.log("locationvalue", value);
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
          [e.target.name]: e.target.value,
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
    const form = e.target;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setIsButtonDisabled(true);
    let data = {
      donor_full_name: donor.donor_full_name,
      donor_title: donor.donor_title,
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
      donor_type: donor.donor_type,
    };
    try {
      const response = await axios.post(`${BaseUrl}/create-donor`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.code == 201) {
        toast.success("Data Updated Successfully");
        navigate("/donor-list");
      } else {
        if (response.data.code == 404) {
          toast.error(" Duplicate Entry");
        }
      }
    } catch (error) {
      console.error("Error updating Course:", error);
      toast.error("Error updating Course");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  // /SUBMIT 1
  const onSubmitR = async (e) => {
    e.preventDefault();

    let data = {
      donor_full_name: donor.donor_full_name,
      donor_title: donor.donor_title,
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
      donor_type: donor.donor_type,
    };

    setIsButtonDisabled(true);
    // axios({
    //   url: BaseUrl + "/create-donor",
    //   method: "POST",
    //   data,
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //   },
    // });
    try {
      const response = await axios.post(`${BaseUrl}/create-donor`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.code == 201) {
        // toast.success("Data Updated Successfully");
        navigate(`/createrecepit-donor/${response.data.latestid.id}`);
      } else {
        if (response.data.code == 404) {
          toast.error(" Duplicate Entry");
        }
      }
    } catch (error) {
      console.error("Error updating Course:", error);
      toast.error("Error updating Course");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  //   .then((res) => {
  //     toast.success("Donor Created Sucessfully");
  //     console.log(`/createrecepit-donor?id${res.data.latestid.id}`);
  //     navigate(`/createrecepit-donor/${res.data.latestid.id}`);
  //   });
  // };
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
  return (
    <Layout>
      <div>
        {/* Title */}
        <div className="flex mb-4 mt-6">
          <Link to="/donor-list">
            <MdKeyboardBackspace className=" text-white bg-[#464D69] p-1 w-10 h-8 cursor-pointer rounded-2xl" />
          </Link>
          <h1 className="text-2xl text-[#464D69] font-semibold ml-2 content-center">
            Add Donor
          </h1>
        </div>
        <div className="p-6 mt-5 bg-white shadow-md rounded-lg">
          <h1 className="p-4 mb-2">Personal Details</h1>
          <form autoComplete="off">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
              <div>
                <Fields
                  select
                  title="Donor Type"
                  type="whatsappDropdown"
                  name="donor_type"
                  value={donor.donor_type}
                  onChange={(e) => onInputChange(e)}
                  options={company_type}
                />
              </div>
              <div className="w-full">
                <Fields
                  title="Title"
                  required={true}
                  name="donor_title"
                  value={donor.donor_title}
                  type="TitleDropDown"
                  options={donor.donor_type == "Individual" ? title : title1}
                  onChange={(e) => onInputChange(e)}
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

              <div className="mb-4">
                <Fields
                  select
                  title="Gender"
                  type="whatsappDropdown"
                  required={true}
                  name="donor_gender"
                  value={donor.donor_gender}
                  onChange={(e) => onInputChange(e)}
                  options={gender}
                />
              </div>
              {donor.donor_type == "Individual" ? (
                ""
              ) : (
                <div>
                  <Input
                    label="Contact Name"
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
                    // required={true}
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
            <div className="mb-4">
              <Fields
                title="House&Street Number Address"
                type="textField"
                autoComplete="Name"
                name="donor_address"
                value={donor.donor_address}
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {" "}
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
              <div>
                <Fields
                  select
                  title="State"
                  type="stateDropDown"
                  name="donor_state"
                  value={donor.donor_state}
                  onChange={(e) => onInputChange(e)}
                  options={states}
                />
              </div>
              <div>
                <Fields
                  title="Pincode"
                  type="textField"
                  autoComplete="Name"
                  name="donor_pin_code"
                  maxLenght={6}
                  value={donor.donor_pin_code}
                  onChange={(e) => onInputChange(e)}
                />
              </div>
            </div>
            <div className="mt-4 text-center">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                disabled={isButtonDisabled}
                onClick={onSubmit}
              >
                Submit
              </button>

              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                onClick={onSubmitR}
              >
                Submit& Create Recepit
              </button>
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

export default AddDonorList;
