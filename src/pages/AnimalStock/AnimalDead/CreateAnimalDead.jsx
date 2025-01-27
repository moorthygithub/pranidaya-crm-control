import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import axios from "axios";
import Layout from "../../../layout/Layout";
import { toast } from "react-toastify";
import { BaseUrl } from "../../../base/BaseUrl";
import { Button, Input, Textarea } from "@material-tailwind/react";
import { useQuery } from "@tanstack/react-query";
import Dropdown from "../../../components/common/DropDown";

const AnimalTypeSource = [
  { value: "Death", label: "Death" },
  { value: "Given", label: "Given" },
];

const CreateAnimalDead = () => {
  const navigate = useNavigate();
  const [animalborn, setAnimalBorn] = useState({
    animal_type_no: "",
    animal_dead_source: "",
    animal_dead_date: "",
    animal_type_remarks: "",
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const fetchAnimalTypeList = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${BaseUrl}/fetch-animalType-list`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data?.animalType ?? [];
  };
  const fetchAnimalTypeNoList = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${BaseUrl}/fetch-animalBornArrival`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data?.animalBornArrival ?? [];
  };

  const onInputChange = (e) => {
    setAnimalBorn({
      ...animalborn,
      [e.target.name]: e.target.value,
    });
  };

  const onInputChangeN = (name, value) => {
    setAnimalBorn({
      ...animalborn,
      [name]: value,
    });
  };

  const { data: AnimalTypeData } = useQuery({
    queryKey: ["TypeList"],
    queryFn: fetchAnimalTypeList,
  });
  const { data: AnimalTypeNoData } = useQuery({
    queryKey: ["TypeNoList"],
    queryFn: fetchAnimalTypeNoList,
  });

  const onSubmit = (e) => {
    e.preventDefault();
    const requiredFields = ["animal_dead_source", "animal_type_no"];
    let isValid = true;
    const missingFields = [];

    requiredFields.forEach((field) => {
      if (!animalborn[field]) {
        isValid = false;
        missingFields.push(field);
      }
    });

    if (!isValid) {
      toast.error(
        `Please fill the following required fields: ${missingFields.join(", ")}`
      );
      console.log("Missing fields:", missingFields);
      return;
    }

    setIsButtonDisabled(true);

    axios
      .post(`${BaseUrl}/create-animalDead`, animalborn, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.data.code == "200") {
          toast.success("Animal Dead Created Successfully");
          navigate("/animal-dead");
        } else {
          toast.error("Error occurred");
        }
      })
      .catch(() => {
        toast.error("An error occurred, please try again.");
      })
      .finally(() => {
        setIsButtonDisabled(false);
      });
  };

  const handleBackButton = () => {
    navigate("/animal-dead");
  };

  return (
    <Layout>
      <div>
        <div className="flex mb-4 mt-6">
          <MdKeyboardBackspace
            onClick={handleBackButton}
            className="text-white bg-[#464D69] p-1 w-10 h-8 cursor-pointer rounded-2xl"
          />
          <h1 className="text-2xl text-[#464D69] font-semibold ml-2">
            Create Dead Stock
          </h1>
        </div>

        <div className="p-6 mt-5 bg-white shadow-md rounded-lg">
          <form id="addIndiv" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-3 my-4">
              <div>
                <Dropdown
                  label="Male No"
                  className="required"
                  name="animal_type_no"
                  required={true}
                  value={animalborn.animal_type_no}
                  options={
                    AnimalTypeNoData?.map((animal, index) => ({
                      value: animal.animal_type_no,
                      label: animal.animal_type_no,
                    })) ?? []
                  }
                  onChange={(value) => onInputChangeN("animal_type_no", value)}
                />
              </div>
              <div>
                <Dropdown
                  required={true}
                  label="Source"
                  className="required"
                  name="animal_dead_source"
                  value={animalborn.animal_dead_source}
                  options={AnimalTypeSource}
                  onChange={(value) =>
                    onInputChangeN("animal_dead_source", value)
                  }
                />
              </div>
              <div>
                <Input
                  required
                  label="Dead Date"
                  type="date"
                  value={animalborn.animal_dead_date}
                  onChange={onInputChange}
                  name="animal_dead_date"
                />
              </div>
            </div>
            <div className="w-full">
              <Textarea
                id="animal_remark"
                name="animal_type_remarks"
                value={animalborn.animal_type_remarks}
                onChange={onInputChange}
                rows={6}
                label="Animal Remark"
                className="resize-y"
              />
            </div>

            <div className="flex justify-center mt-4 space-x-4">
              <Button
                type="submit"
                disabled={isButtonDisabled}
                className="mt-4  bg-blue-400"
              >
                Submit
              </Button>

              <Button className="mt-4 bg-red-400" onClick={handleBackButton}>
                Back
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateAnimalDead;
