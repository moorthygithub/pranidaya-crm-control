import Layout from "../../../layout/Layout";
import PageTitle from "../../../components/common/PageTitle";
import { useNavigate } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import { Card } from "@material-tailwind/react";
import { useState } from "react";
import { BaseUrl } from "../../../base/BaseUrl";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Fields from "../../../components/common/TextField/TextField";

function AddFamilyMembers() {
  const navigate = useNavigate();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const donorid = localStorage.getItem("donor_fts_id");
  const [donor, setDonor] = useState({
    family_full_name: "",
    donor_fts_id: "",
    family_relation: "",
  });
  //ONCHANGE
  const onInputChange = (e) => {
    setDonor({
      ...donor,
      [e.target.name]: e.target.value,
    });
  };
  //SUBMIT

  const onSubmit = (e) => {
    let data = {
      family_full_name: donor.family_full_name,
      donor_fts_id: donorid,
      family_relation: donor.family_relation,
    };

    e.preventDefault();

    setIsButtonDisabled(true);
    axios({
      url: BaseUrl + "/create-family-member",
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      if (res.data.code == "200") {
        toast.success("Family Member Created Sucessfully");
        navigate(`/create-family/${donorid}`);
      } else {
        toast.error("Duplicate Entry");
      }
    });
  };
  return (
    <Layout>
      {/* <ToastContainer /> */}
      <div className="mt-4 mb-6">
        <PageTitle title={"Personal Details"} backLink="-1" />
      </div>
      <Card className="p-4">
        <form id="dowRecp" onSubmit={onSubmit} autoComplete="off">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="w-full">
              <Fields
                required={true}
                title="Full Name"
                type="textField"
                autoComplete="Name"
                name="family_full_name"
                value={donor.family_full_name}
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className="w-full">
              <Fields
                title="Relation"
                type="textField"
                autoComplete="Name"
                name="family_relation"
                value={donor.family_relation}
                onChange={(e) => onInputChange(e)}
              />
            </div>

            <div className="w-auto">
              <Button
                className="bg-blue-400 "
                fullWidth
                type="submit"
                name="donor_gender"
                disabled={isButtonDisabled}
              >
                Submit
              </Button>
            </div>

            <div className="w-auto">
              <Button
                className=" bg-red-500"
                fullWidth
                name="donor_gender"
                onClick={() => {
                  navigate("/donor-list");
                }}
              >
                Back
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </Layout>
  );
}

export default AddFamilyMembers;
