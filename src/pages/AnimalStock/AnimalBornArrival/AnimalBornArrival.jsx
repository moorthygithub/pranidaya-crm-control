import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../../../layout/Layout";
import {

  AddBornorArrival,

} from "../../../components/ButtonComponents";
import MUIDataTable from "mui-datatables";
import { Spinner } from "@material-tailwind/react";
import { BaseUrl } from "../../../base/BaseUrl";
import AnimalStockFilter from "../../../components/common/AnimalStockFilter";
import moment from "moment";
import { inputClass } from "../../../components/common/Buttoncss";

const fetchAnimalMeetList = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    `${BaseUrl}/fetch-animalBornArrival-list
`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data?.animalBornArrival ?? [];
};

const AnimalBornArrival = () => {
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
      name: "animal_type",
      label: "Animal Type",
      options: { filter: false, sort: false },
    },
    {
      name: "animal_type_date",
      label: "Date",
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
      name: "animal_type_source",
      label: "Type Source",
      options: { filter: false, sort: false },
    },

    {
      name: "animal_type_mother_no",
      label: "Mother Govt Id",
      options: { filter: false, sort: false },
    },
    {
      name: "animal_type_father_no",
      label: "Father Govt Id",
      options: { filter: false, sort: false },
    },

    {
      name: "animal_type_status",
      label: "Status",
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
        <AddBornorArrival
          onClick={() => navigate("/add-born-arrival")}
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
                  Animal Born or Arrival Listt
                </span>
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

export default AnimalBornArrival;
