import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../../../layout/Layout";
import {
  AddAnimal,
  AddAnimalDead,
  AddAnimalMeet,
  EditAnimalMeet,
  EditPurchase,
} from "../../../components/ButtonComponents";
import MUIDataTable from "mui-datatables";
import { Spinner } from "@material-tailwind/react";
import { BaseUrl } from "../../../base/BaseUrl";
import AnimalStockFilter from "../../../components/common/AnimalStockFilter";
import moment from "moment";

const AnimalDeadDatas = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${BaseUrl}/fetch-animalDead-list`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data?.animalDead ?? [];
};

const AnimalDead = () => {
  const navigate = useNavigate();
  const {
    data: AnimalDeadData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["AnimalDeadList"],
    queryFn: AnimalDeadDatas,
  });

  const columns = [
    {
      name: "animal_type",
      label: "Animal Type",
      options: { filter: false, sort: false },
    },
    {
      name: "animal_type_no",
      label: "Govt Id",
      options: { filter: false, sort: false },
    },
    {
      name: "animal_type_gender",
      label: "Gender",
      options: { filter: false, sort: false },
    },
    {
      name: "animal_dead_date",
      label: "Dead Date",
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
      name: "animal_dead_source",
      label: " Source",
      options: { filter: false, sort: false },
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
  };

  return (
    <Layout>
      <AnimalStockFilter />
      <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
          Animal Death /Given List
        </h3>
        <AddAnimalDead
          onClick={() => navigate("/add-animal-dead")}
          className="flex flex-row items-center gap-1 text-center text-sm font-[400] cursor-pointer text-white bg-blue-600 hover:bg-red-700 p-2 rounded-lg shadow-md"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner className="h-6 w-6" />
        </div>
      ) : isError ? (
        <div className="text-red-500 text-center mt-4">Error loading data</div>
      ) : (
        <div className="mt-5">
          <MUIDataTable
            data={AnimalDeadData || []}
            columns={columns}
            options={options}
          />
        </div>
      )}
    </Layout>
  );
};

export default AnimalDead;
