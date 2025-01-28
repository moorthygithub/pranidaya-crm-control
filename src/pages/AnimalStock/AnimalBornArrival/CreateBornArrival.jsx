import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import axios from "axios";
import Layout from "../../../layout/Layout";
import Fields from "../../../components/common/TextField/TextField";
import { toast } from "react-toastify";
import { IconButton, TextField } from "@mui/material";
import { BaseUrl } from "../../../base/BaseUrl";
import {
  Button,
  Input,
  Option,
  Select,
  Spinner,
  Textarea,
} from "@material-tailwind/react";
import { useQuery } from "@tanstack/react-query";
import Dropdown from "../../../components/common/DropDown";
import moment from "moment";

// Unit options for dropdown
const AnimalGender = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
];
const AnimalTypeSource = [
  { value: "Born", label: "Born" },
  { value: "Arrival", label: "Arrival" },
];

const CreateBornArrival = () => {
  const navigate = useNavigate();
  const todayDate = moment().format("YYYY-MM-DD");
  const [unique, setUnique] = useState("");
  const [animalborn, setAnimalBorn] = useState({
    animal_type: "",
    animal_type_no: "",
    animal_type_source: "",
    animal_type_gender: "",
    animal_type_mother_no: "",
    animal_type_father_no: "",
    animal_type_date: todayDate,
    animal_type_remarks: "",
    animal_meet_unique: unique,
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const fetchAnimalMeetMaleList = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${BaseUrl}/fetch-animalBornArrival-by-value/Male`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data?.animalBornArrival ?? {};
  };
  const fetchAnimalMeetFemaleList = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${BaseUrl}/fetch-animalBornArrival-by-value/Female`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data?.animalBornArrival ?? {};
  };
  const fetchAnimalTypeList = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${BaseUrl}/fetch-animalType-list`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data?.animalType ?? [];
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

  const { data: AnimalMeetMaleData } = useQuery({
    queryKey: ["MaleList"],
    queryFn: fetchAnimalMeetMaleList,
  });
  const { data: AnimalMeetFemaleData } = useQuery({
    queryKey: ["FemaleList"],
    queryFn: fetchAnimalMeetFemaleList,
  });
  const { data: AnimalTypeData } = useQuery({
    queryKey: ["TypeList"],
    queryFn: fetchAnimalTypeList,
  });

  const fetchAnimalMaleFemlaeList = async ({ queryKey }) => {
    const [, fatherNo, motherNo] = queryKey;

    if (!fatherNo || !motherNo) return {};

    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${BaseUrl}/fetch-animalMeet-by-value/${fatherNo}/${motherNo}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data?.animalMeet ?? {};
  };

  const { data: AnimalBornArrivalData, isLoading } = useQuery({
    queryKey: [
      "BornArrivalList",
      animalborn?.animal_type_father_no,
      animalborn?.animal_type_mother_no,
    ],
    queryFn: fetchAnimalMaleFemlaeList,
    enabled:
      !!animalborn?.animal_type_father_no &&
      !!animalborn?.animal_type_mother_no,
  });

  const onSubmit = (e) => {
    e.preventDefault();
    const updatedAnimalborn = {
      ...animalborn,
      animal_meet_unique: unique,
    };
    const requiredFields = [
      "animal_type",
      "animal_type_no",
      "animal_type_source",
      "animal_type_gender",
    ];
    let isValid = true;

    requiredFields.forEach((field) => {
      if (!animalborn[field]) {
        isValid = false;
      }
    });

    if (!isValid) {
      toast.error("Please fill all required fields.");
      return;
    }

    setIsButtonDisabled(true);

    axios
      .post(`${BaseUrl}/create-animalBornArrival`, updatedAnimalborn, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.data.code == "200") {
          toast.success("Animal Born or Arrival Created Successfully");
          navigate("/animal-born-arrival");
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
    navigate("/animal-born-arrival");
  };
  //   useEffect(() => {
  //     if (AnimalBornArrivalData?.length === 0) {
  //       setIsButtonDisabled(true);
  //     } else {
  //       setIsButtonDisabled(false);
  //     }
  //   }, [AnimalBornArrivalData]);
  useEffect(() => {
    if (AnimalBornArrivalData?.length === 0) {
      setIsButtonDisabled(true);
      setUnique("");
    } else if (AnimalBornArrivalData?.length > 0) {
      const uniqueValue = AnimalBornArrivalData[0]?.animal_meet_unique ?? "";
      console.log("Found unique value:", uniqueValue);
      setIsButtonDisabled(false);
      setUnique(uniqueValue);
    }
  }, [AnimalBornArrivalData]);
  useEffect(() => {
    console.log("Unique state value:", unique);
  }, [unique]);
  return (
    <Layout>
      <div>
        <div className="flex mb-4 mt-6">
          <MdKeyboardBackspace
            onClick={handleBackButton}
            className="text-white bg-[#464D69] p-1 w-10 h-8 cursor-pointer rounded-2xl"
          />
          <h1 className="text-2xl text-[#464D69] font-semibold ml-2">
            Create Animal Born or Arrival
          </h1>
        </div>

        <div className="p-6 mt-5 bg-white shadow-md rounded-lg">
          <form id="addIndiv" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 my-4">
              <div>
                <Dropdown
                  label="Animal Type"
                  value={animalborn.animal_type}
                  name="animal_type"
                  required={true}
                  options={
                    AnimalTypeData?.map((animal, index) => ({
                      value: animal.animal_type,
                      label: animal.animal_type,
                    })) ?? []
                  }
                  onChange={(value) => onInputChangeN("animal_type", value)}
                />
              </div>
              <div>
                <Input
                  //   required
                  label="Type"
                  type="text"
                  value={animalborn.animal_type_no}
                  onChange={onInputChange}
                  name="animal_type_no"
                />
              </div>
              <div>
                <Dropdown
                  required={true}
                  label="Source"
                  className="required"
                  name="animal_type_source"
                  value={animalborn.animal_type_source}
                  options={AnimalTypeSource}
                  onChange={(value) =>
                    onInputChangeN("animal_type_source", value)
                  }
                />
              </div>
              <div>
                <Dropdown
                  required={true}
                  label="Gender"
                  className="required"
                  name="animal_type_gender"
                  value={animalborn.animal_type_gender}
                  options={AnimalGender}
                  onChange={(value) =>
                    onInputChangeN("animal_type_gender", value)
                  }
                />
              </div>
              {animalborn.animal_type_source == "Born" && (
                <>
                  <div>
                    <Dropdown
                      label="Male No"
                      className="required"
                      name="animal_type_father_no"
                      value={animalborn.animal_type_father_no}
                      options={
                        AnimalMeetMaleData?.map((animal, index) => ({
                          value: animal.animal_type_no,
                          label: animal.animal_type_no,
                        })) ?? []
                      }
                      onChange={(value) =>
                        onInputChangeN("animal_type_father_no", value)
                      }
                    />
                  </div>
                  <div>
                    <Dropdown
                      label="Female No"
                      className="required"
                      name="animal_type_mother_no"
                      value={animalborn.animal_type_mother_no}
                      options={
                        AnimalMeetFemaleData?.map((animal, index) => ({
                          value: animal.animal_type_no,
                          label: animal.animal_type_no,
                        })) ?? []
                      }
                      onChange={(value) =>
                        onInputChangeN("animal_type_mother_no", value)
                      }
                    />
                  </div>
                </>
              )}
              <div>
                <Input
                  required
                  label="Meet Date"
                  type="date"
                  value={animalborn.animal_type_date}
                  onChange={onInputChange}
                  name="animal_type_date"
                />
              </div>
              <div className="flex justify-center mt-2 text-red-600">
                {AnimalBornArrivalData?.length > 0 && <div>Meat is Found</div>}
                {AnimalBornArrivalData?.length === 0 && (
                  <div>Meat Not Found</div>
                )}
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
                className="resize-y" // Enables vertical resizing
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

export default CreateBornArrival;
