import Layout from "../../../layout/Layout";
import PageTitle from "../../../components/common/PageTitle";
import Dropdown from "../../../components/common/DropDown";
import { FaArrowCircleLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "@material-tailwind/react";
import { Card } from "@material-tailwind/react";
import { useState } from "react";
import { BaseUrl } from "../../../base/BaseUrl";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import DownloadCommon from "../../download/DeliveryDownload";
import { AddAnimal } from "../../../components/ButtonComponents";
import { inputClass } from "../../../components/common/Buttoncss";

function Donor() {
  const navigate = useNavigate();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

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

  const DonorType = [
    {
      value: "Individual",
      label: "Individual",
    },
    {
      value: "Private",
      label: "Private",
    },
    {
      value: "Public",
      label: "Public",
    },
    {
      value: "PSU",
      label: "PSU",
    },
    {
      value: "Trust",
      label: "Trust",
    },
    {
      value: "Society",
      label: "Society",
    },
    {
      value: "Others",
      label: "Others",
    },
  ];
  const [downloadDonor, setDonorDownload] = useState({
    donor_type: "",
    donor_gender: "",
  });
  //ONCHANGE
  const onInputChange = (name, value) => {
    setDonorDownload((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  //SUBMIT
  const onSubmit = (e) => {
    e.preventDefault();
    let data = {
      donor_type: downloadDonor.donor_type,
      donor_gender: downloadDonor.donor_gender,
    };
    var v = document.getElementById("dowRecp").checkValidity();
    var v = document.getElementById("dowRecp").reportValidity();
    e.preventDefault();
    console.log("Data : ", data);
    if (v) {
      setIsButtonDisabled(true);

      axios({
        url: BaseUrl + "/download-donor",
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "donor_list.csv");
          document.body.appendChild(link);
          link.click();
          toast.success("Donor is Downloaded Successfully");
          setIsButtonDisabled(false);
        })
        .catch((err) => {
          toast.error("Donor is Not Downloaded");
          setIsButtonDisabled(false);
        });
    }
  };

  return (
    <Layout>
      <DownloadCommon />
      <ToastContainer />
      <div className="p-6 mt-5 bg-white shadow-md rounded-lg">
        <div>
          <h1 className="text-xl md:text-2xl text-[#464D69] font-semibold ml-2">
            Download Donor
          </h1>
        </div>
        <div className="p-4">
          <h3 className="text-red-500 mb-5">
            Leave blank if you want all records.
          </h3>

          <form id="dowRecp" autoComplete="off">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="w-full">
                <Dropdown
                  required
                  label="Donor Type"
                  className="required"
                  options={DonorType}
                  value={downloadDonor.donor_type}
                  onChange={(value) => onInputChange("donor_type", value)}
                  name="donor_type"
                />
              </div>
              {downloadDonor.donor_type == "Individual" ? (
                <div className="w-full">
                  <Dropdown
                    label="Gender"
                    className="required"
                    value={downloadDonor.donor_gender}
                    options={gender}
                    name="donor_gender"
                    onChange={(value) => onInputChange("donor_gender", value)}
                  />
                </div>
              ) : (
                ""
              )}
              <div className="w-77">
                <button
                  name="donor_gender"
                  className={`${inputClass} ${
                    isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={onSubmit}
                  disabled={isButtonDisabled}
                >
                  {isButtonDisabled ? "Downloading..." : "Download"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default Donor;
