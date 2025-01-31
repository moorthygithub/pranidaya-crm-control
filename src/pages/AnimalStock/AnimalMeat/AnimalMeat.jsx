import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../../../layout/Layout";
import {
  AddAnimal,
  AddAnimalMeet,
  EditAnimalMeet,
  EditPurchase,
} from "../../../components/ButtonComponents";
import MUIDataTable from "mui-datatables";
import { Spinner } from "@material-tailwind/react";
import { BaseUrl } from "../../../base/BaseUrl";
import AnimalStockFilter from "../../../components/common/AnimalStockFilter";
import moment from "moment";
import { inputClass } from "../../../components/common/Buttoncss";
import { encryptId } from "../../../components/common/EncryptDecrypt";

const fetchAnimalMeetList = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${BaseUrl}/fetch-animalMeet-list`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data?.animalMeet ?? [];
};

const AnimalMeat = () => {
  const navigate = useNavigate();
  const {
    data: AnimalMeetData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["AnimalMeetList"],
    queryFn: fetchAnimalMeetList,
  });

  const columns = [
    {
      name: "animal_male_no",
      label: "Male Govt Id",
      options: { filter: false, sort: false },
    },
    {
      name: "animal_female_no",
      label: "Female Govt Id",
      options: { filter: false, sort: false },
    },
    {
      name: "animal_meet_date",
      label: "Meet Date",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) => {
          return value && moment(value).isValid()
            ? moment(value).format("DD-MM-YYYY")
            : "";
        },
      },
    },

    {
      name: "animal_baby_no",
      label: "Baby Govt Id",
      options: { filter: false, sort: false },
    },
    {
      name: "animal_baby_date",
      label: "Baby Date",
      options: {
        filter: false,
        sort: false,

        customBodyRender: (value) => {
          return value && moment(value).isValid()
            ? moment(value).format("DD-MM-YYYY")
            : "";
        },
      },
    },
    {
      name: "animal_meet_status",
      label: "Status",
      options: { filter: false, sort: false },
    },

    {
      name: "id",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (id) => (
          <div className="flex items-center space-x-2">
            <EditAnimalMeet
              // onClick={() => navigate(`/edit-animal-meet/${id}`)}
              onClick={() => {
                const encryptedId = encryptId(id); // Encrypt the ID
                navigate(
                  `/edit-animal-meet/${encodeURIComponent(encryptedId)}`
                );
              }}
              className="h-5 w-5 cursor-pointer text-blue-500"
            />
          </div>
        ),
      },
    },
  ];

  const options = {
    selectableRows: "none",
    elevation: 0,
    responsive: "standard",
    viewColumns: true,
    download: false,
    print: false,
    filter: false,
    customToolbar: () => {
      return (
        <AddAnimalMeet
          onClick={() => navigate("/add-animal-meet")}
          className={inputClass}
        />
      );
    },
  };

  return (
    <Layout>
      <AnimalStockFilter />

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner className="h-6 w-6" />
        </div>
      ) : isError ? (
        <div className="text-red-500 text-center mt-4">Error loading data</div>
      ) : (
        <div className="mt-5">
          <MUIDataTable
            title={
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold"> Animal Meet List</span>
              </div>
            }
            data={AnimalMeetData || []}
            columns={columns}
            options={options}
          />
        </div>
      )}
    </Layout>
  );
};

export default AnimalMeat;
