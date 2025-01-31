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
import { inputClass } from "../../../components/common/Buttoncss";
import { encryptId } from "../../../components/common/EncryptDecrypt";

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
              // onClick={() => navigate(`/edit-animal/${id}`)}
              onClick={() => {
                const encryptedId = encryptId(id); // Encrypt the ID
                navigate(
                  `/edit-animal/${encodeURIComponent(encryptedId)}`
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
        <AddAnimal
          onClick={() => navigate("/add-animal")}
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
                <span className="text-lg font-semibold"> Animal Type List</span>
              </div>
            }
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
