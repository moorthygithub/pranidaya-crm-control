import Layout from "../../../layout/Layout";
import { Link, useNavigate, useParams } from "react-router-dom"; // Import useParams
import { MdKeyboardBackspace } from "react-icons/md";
import { useEffect, useState } from "react";
import Fields from "../../../components/common/TextField/TextField";
import axios from "axios";
import  { BaseUrl } from "../../../base/BaseUrl";
import { toast } from "react-toastify";

const status = [
  {
    value: "Active",
    label: "Active",
  },
  {
    value: "Inactive",
    label: "Inactive",
  },
];

const EditOccasion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [occasion, setOccasion] = useState({
    occasion_name: "",
    occasion_status: "",
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleBackButton = () => {
    navigate("/occasion");
  };
  console.log(id, "item id ");
  // Validate only text input
  const validateOnlyText = (inputtxt) => {
    var re = /^[A-Za-z ]+$/;
    if (inputtxt === "" || re.test(inputtxt)) {
      return true;
    } else {
      return false;
    }
  };

  // Handle input change
  const onInputChange = (e) => {
    if ((e.target.name === "occasion_name") | "occasion_status") {
      if (validateOnlyText(e.target.value)) {
        setOccasion({
          ...occasion,
          [e.target.name]: e.target.value,
        });
      }
    } else {
      setOccasion({
        ...occasion,
        [e.target.name]: e.target.value,
      });
    }
  };

  useEffect(() => {
    if (id) {
      axios({
        url: BaseUrl + "/fetch-occasion-by-id/" + id,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          setOccasion(res.data.occasion);
        })
        .catch((error) => {
          toast.error("Failed to fetch item details");
        });
    }
  }, [id]);

  // Handle form submission
  const onSubmit = (e) => {
    e.preventDefault();
    let data = {
      occasion_name: occasion.occasion_name,
      occasion_status: occasion.occasion_status,
    };

    var isValid = document.getElementById("addIndiv").checkValidity();
    var reportValid = document.getElementById("addIndiv").reportValidity();

    if (isValid && reportValid) {
      setIsButtonDisabled(true);

      axios({
        url: BaseUrl + "/update-occasion/" + id,
        method: "PUT",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          if (res.data.code == "200") {
            toast.success(res.data.msg || "Item is updated successfully");
            navigate("/occasion");
          } else {
            toast.error(res.data.msg || "Duplicate Entry");
          }
        })
        .catch((error) => {
          toast.error("An error occurred, please try again.");
        })
        .finally(() => {
          setIsButtonDisabled(false);
        });
    }
  };

  return (
    <Layout>
      <div>
        <div>
          {/* Title */}
          <div className="flex mb-4 mt-6">
            <MdKeyboardBackspace
              onClick={handleBackButton}
              className="text-white bg-[#464D69] p-1 w-10 h-8 cursor-pointer rounded-2xl"
            />
            <h1 className="text-2xl text-[#464D69] font-semibold ml-2 content-center">
              Edit Occasion
            </h1>
          </div>

          {/* Form Section */}
          <form autoComplete="off" id="addIndiv" onSubmit={onSubmit}>
            <div className="md:flex gap-2 justify-start mb-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full justify-between">
                {/* Item Name Field */}
                <div>
                  <Fields
                    required={true}
                    label="Occasion Name"
                    type="textField"
                    autoComplete="Name"
                    name="occasion_name"
                    value={occasion.occasion_name}
                    onChange={onInputChange}
                  />
                </div>
                <div>
                  <Fields
                    required={true}
                    title=" Status"
                    type="whatsappDropdown"
                    autoComplete="Name"
                    options={status}
                    name="occasion_status"
                    value={occasion.occasion_status}
                    onChange={onInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                disabled={isButtonDisabled}
              >
                Update
              </button>
              <button
                onClick={handleBackButton}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditOccasion;
