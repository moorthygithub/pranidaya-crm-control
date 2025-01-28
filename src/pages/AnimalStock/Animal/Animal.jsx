import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../../../layout/Layout";
import { AddAnimal, EditAnimal } from "../../../components/ButtonComponents";
import MUIDataTable from "mui-datatables";
import { Spinner } from "@material-tailwind/react";
import { BaseUrl } from "../../../base/BaseUrl";
import AnimalStockFilter from "../../../components/common/AnimalStockFilter";

const fetchAnimalList = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${BaseUrl}/fetch-animalType-list`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data?.animalType ?? [];
};

const Animal = () => {
  const navigate = useNavigate();
  const {
    data: pendingDListData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["AnimalList"],
    queryFn: fetchAnimalList,
  });

  const columns = [
    {
      name: "animal_type",
      label: "Animal Type",
      options: { filter: false, sort: false },
    },
    {
      name: "animal_type_status",
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
            <EditAnimal
              onClick={() => navigate(`/edit-animal/${id}`)}
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
  };

  return (
    <Layout>
      <AnimalStockFilter />
      <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
          Animal Type List
        </h3>
        <AddAnimal
          onClick={() => navigate("/add-animal")}
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
            data={pendingDListData || []}
            columns={columns}
            options={options}
          />
        </div>
      )}
    </Layout>
  );
};

export default Animal;
