import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import axios from "axios";
import { BaseUrl } from "../../../base/BaseUrl";
import Layout from "../../../layout/Layout";
import Fields from "../../../components/common/TextField/TextField";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  inputClass,
  inputClassBack,
} from "../../../components/common/Buttoncss";

const AddEnquiry = () => {
  const navigate = useNavigate();
  const [item, setItems] = useState({
    item_name: "",
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleBackButton = () => {
    navigate("/master-list");
  };

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
    if (e.target.name === "item_name") {
      if (validateOnlyText(e.target.value)) {
        setItems({
          ...item,
          [e.target.name]: e.target.value,
        });
      }
    } else {
      setItems({
        ...item,
        [e.target.name]: e.target.value,
      });
    }
  };

  // Handle form submission
  const onSubmit = (e) => {
    e.preventDefault();
    let data = {
      item_name: item.item_name,
    };

    var isValid = document.getElementById("addIndiv").checkValidity();
    var reportValid = document.getElementById("addIndiv").reportValidity();

    if (isValid && reportValid) {
      setIsButtonDisabled(true);

      axios({
        url: BaseUrl + "/create-item",
        method: "POST",
        data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          if (res.data.code == "200") {
            toast.success("Item is Created Successfully");
            navigate("/master-list");
          } else {
            toast.error("Duplicate Entry");
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
        {/* Title */}

        <div className="p-6 mt-5 bg-white shadow-md rounded-lg">
          <h1 className="text-2xl text-[#464D69] font-semibold ml-2 content-center mb-4">
            Create Item
          </h1>
          <form autoComplete="off" id="addIndiv" onSubmit={onSubmit}>
            <div className="md:flex gap-2 justify-start mb-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full justify-between">
                <div>
                  <Fields
                    required={true}
                    label="Item Name"
                    type="textField"
                    autoComplete="Name"
                    name="item_name"
                    value={item.item_name}
                    onChange={onInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <button
                type="submit"
                className={inputClass}
                disabled={isButtonDisabled}
              >
                Submit
              </button>
              <button onClick={handleBackButton} className={inputClassBack}>
                Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddEnquiry;
