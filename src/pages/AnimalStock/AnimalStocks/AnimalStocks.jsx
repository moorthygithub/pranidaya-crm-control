import React, {  useState } from "react";
import Layout from "../../../layout/Layout";
import { Link, useNavigate } from "react-router-dom";

import { Input, } from "@material-tailwind/react";
import AnimalStockFilter from "../../../components/common/AnimalStockFilter";
import moment from "moment";
import { BaseUrl } from "../../../base/BaseUrl";
import axios from "axios";
import { toast } from "react-toastify";
import { inputClass } from "../../../components/common/Buttoncss";

const AnimalStocks = () => {
  const navigate = useNavigate();
  const todayDate = moment().format("YYYY-MM-DD");
  const monthStartDate = moment().startOf("month").format("YYYY-MM-DD");

  const [animalstock, setAnimalStock] = useState({
    from_date: monthStartDate,
    to_date: todayDate,
  });

  const onInputChange = (e) => {
    setAnimalStock({
      ...animalstock,
      [e.target.name]: e.target.value,
    });
  };

  const onReportView = (e) => {
    e.preventDefault();
    var v = document.getElementById("dowRecp").checkValidity();
    var v = document.getElementById("dowRecp").reportValidity();
    if (v) {
      localStorage.setItem("from_date-animal", animalstock.from_date);
      localStorage.setItem("to_date-animal", animalstock.to_date);
      navigate("/animal-stock-view");
    }
  };
  const onSubmit = (e) => {
    e.preventDefault();
    const data = {
      from_date: animalstock.from_date,
      to_date: animalstock.to_date,
    };

    e.preventDefault();

    axios({
      url: BaseUrl + "/download-animalstock-summary",
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "animalstock.csv");
        document.body.appendChild(link);
        link.click();
        toast.success("Animalstock is Downloaded Successfully");
      })
      .catch((err) => {
        toast.error("Animalstock is Not Downloaded");
      });
  };

  const onSubmit1 = (e) => {
    e.preventDefault();
    const data = {
      from_date: animalstock.from_date,
      to_date: animalstock.to_date,
    };

    e.preventDefault();

    axios({
      url: BaseUrl + "/download-animalstock-summary-detail",
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "animalstock details.csv");
        document.body.appendChild(link);
        link.click();
        toast.success("Animalstock Details is Downloaded Successfully");
      })
      .catch((err) => {
        toast.error("Animalstock Details is Not Downloaded");
      });
  };
  return (
    <Layout>
      <AnimalStockFilter />
      <div className="bg-white mt-5 p-2 rounded-lg ">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
            Animal Stock
          </h3>
        </div>

        <form id="dowRecp" autoComplete="off" className="my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="w-full">
              <Input
                type="date"
                label="From Date "
                className="required"
                required
                name="from_date"
                value={animalstock.from_date}
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className="w-full">
              <Input
                type="date"
                label="To Date"
                required
                className="required"
                value={animalstock.to_date}
                onChange={(e) => onInputChange(e)}
                name="to_date"
              />
            </div>
          </div>
          <div className="space-x-3 mt-6">
            <button className={inputClass} onClick={onReportView}>
              View
            </button>

            <button className={inputClass} onClick={onSubmit}>
              Download Stock
            </button>
            <button className={`${inputClass} w-[180px]`} onClick={onSubmit1}>
              Download Deatils Stock
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AnimalStocks;
