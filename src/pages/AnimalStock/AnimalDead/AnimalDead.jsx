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
import { inputClass } from "../../../components/common/Buttoncss";

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
    customToolbar: () => {
      return (
        <AddAnimalDead
          onClick={() => navigate("/add-animal-dead")}
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
                <span className="text-lg font-semibold">
                  {" "}
                  Animal Death /Given List
                </span>
              </div>
            }
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
