import { Card, Typography, Button, Spinner } from "@material-tailwind/react";
import { LuDownload } from "react-icons/lu";
import { MdKeyboardBackspace } from "react-icons/md";
import { IoIosPrint } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import moment from "moment";
import html2pdf from "html2pdf.js";
import Layout from "../../../layout/Layout";
import { BaseUrl } from "../../../base/BaseUrl";
import { toast } from "react-toastify";
import { inputClass } from "../../../components/common/Buttoncss";

function AnimalStocksView() {
  const navigate = useNavigate();
  const componentRef = useRef();
  const componentRef1 = useRef();

  const [animaltotalcount, setAnimalTotalCount] = useState(0);
  const [animalinactivecount, setAnimalInactiveCount] = useState(0);
  const [animalcount, setAnimalCount] = useState([]);
  const [stock, setStock] = useState([]);
  const [animalarrival, setAnimalArrival] = useState([]);
  const [animalborn, setAnimalBorn] = useState([]);
  const [animaldeath, setAnimalDeath] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const data = {
      from_date: localStorage.getItem("from_date-animal"),
      to_date: localStorage.getItem("to_date-animal"),
    };

    axios({
      url: `${BaseUrl}/fetch-animalType-stock`,
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        setAnimalTotalCount(res.data.active_all_animal_count);
        setAnimalInactiveCount(res.data.inactive_all_animal_count);
        setAnimalCount(res.data.active_animal_count);
        setStock(res.data.stock);
        setAnimalArrival(res.data.animal_arrival);
        setAnimalBorn(res.data.animal_born);
        setAnimalDeath(res.data.animal_death);
        setLoader(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoader(false);
      });
  }, []);
  const PrintRecepit = () => {
    const printContent = componentRef.current;
    const printWindow = window.open("", "", "height=500,width=800");

    printWindow.document.write("<html><head><title>Print Receipt</title>");

    const styles = Array.from(document.styleSheets)
      .map((styleSheet) => {
        try {
          return Array.from(styleSheet.cssRules)
            .map((rule) => rule.cssText)
            .join("");
        } catch (e) {
          console.log(
            "Accessing cross-origin styles is not allowed, skipping."
          );
          return "";
        }
      })
      .join("");
    printWindow.document.write(`<style>
    ${styles}
    .print-container {
      margin: 20px; /* Adjust margin as needed */
    }
  </style>`);
    printWindow.document.write("</head><body>");
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };
  const PrintRecepit1 = () => {
    const printContent = componentRef1.current;
    const printWindow = window.open("", "", "height=500,width=800");

    printWindow.document.write("<html><head><title>Print Receipt</title>");

    const styles = Array.from(document.styleSheets)
      .map((styleSheet) => {
        try {
          return Array.from(styleSheet.cssRules)
            .map((rule) => rule.cssText)
            .join("");
        } catch (e) {
          console.log(
            "Accessing cross-origin styles is not allowed, skipping."
          );
          return "";
        }
      })
      .join("");
    printWindow.document.write(`<style>
    ${styles}
    .print-container {
      margin: 20px; /* Adjust margin as needed */
    }
  </style>`);
    printWindow.document.write("</head><body>");
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const data = {
      from_date: localStorage.getItem("from_date-animal"),
      to_date: localStorage.getItem("to_date-animal"),
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
      from_date: localStorage.getItem("from_date-animal"),
      to_date: localStorage.getItem("to_date-animal"),
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
      <div className="p-6 mt-5 bg-white shadow-md rounded-lg  min-h-screen">
        <div className="flex items-center justify-between mb-4 p-2 bg-white rounded-lg flex-wrap">
          <div className="flex items-center w-full sm:w-auto mb-2 sm:mb-0">
            <Typography
              variant="h4"
              className="ml-3 text-gray-700 font-semibold"
            >
              Animal Stock Overview
            </Typography>
          </div>
          <div className="flex flex-wrap space-x-4 justify-between w-full sm:w-auto">
            <button
              className={`${inputClass} flex justify-center items-center space-x-3`}
              onClick={onSubmit1}
            >
              <LuDownload className="text-lg" />
              <span>Details Stock</span>
            </button>
            <button
              className={`${inputClass} flex justify-center items-center space-x-3`}
              onClick={onSubmit}
            >
              <LuDownload className="text-lg" />
              <span>Stock</span>
            </button>

            <button
              className={`${inputClass} flex justify-center items-center space-x-3`}
              onClick={PrintRecepit}
            >
              <IoIosPrint className="text-lg" />
              <span className="ml-2">Detail Stock</span>
            </button>

            <button
              className={`${inputClass} flex justify-center items-center space-x-3`}
              onClick={PrintRecepit1}
            >
              <IoIosPrint className="text-lg" />
              <span>Stock</span>
            </button>
          </div>
        </div>

        {loader ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <Spinner color="blue" />
          </div>
        ) : (
          <div ref={componentRef}>
            {/* Total Active Animal Count */}
            <div className="p-6 shadow-lg my-6   rounded-lg   overflow-hidden ">
              <div className="flex justify-between">
                <Typography
                  variant="h6"
                  className="text-gray-800 font-bold whitespace-nowrap overflow-hidden text-ellipsis"
                >
                  Total Animal Born/Arrival :{" "}
                  <span className="text-indigo-600 ml-1">
                    {animaltotalcount}
                  </span>
                </Typography>
                <Typography
                  variant="h6"
                  className="text-gray-800 font-bold text-right whitespace-nowrap overflow-hidden text-ellipsis"
                >
                  Total Animal Death/Given :{" "}
                  <span className="text-red-600 ml-1">
                    {animalinactivecount}
                  </span>
                </Typography>
              </div>
            </div>

            <div className="grid  grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 mb-6 mx-2">
              {animalcount.map((animal, index) => (
                <Card
                  key={index}
                  className="p-2 shadow-lg bg-white w-[8rem] flex flex-col items-center text-center"
                >
                  <Typography
                    variant="h6"
                    className="text-gray-800 font-bold text-sm"
                  >
                    {animal.animal_type}
                  </Typography>
                  <Typography
                    variant="h5"
                    className="text-indigo-600 font-semibold mt-2 text-sm"
                  >
                    {animal.animalCount}
                  </Typography>
                </Card>
              ))}
            </div>

            {/* Stock Table */}
            <div className="p-4  mb-4 " ref={componentRef1}>
              <Typography
                variant="h6"
                className="text-gray-700 font-semibold mb-3"
              >
                Animal Stock
              </Typography>
              <table className="w-full border-collapse border border-gray-200 mb-[10px] text-sm">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">Animal Type</th>
                    <th className="border p-2">Arrival</th>
                    <th className="border p-2">Born</th>
                    <th className="border p-2">Deaths</th>
                  </tr>
                </thead>
                <tbody>
                  {stock.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="border p-2 text-center text-gray-500"
                      >
                        No data available
                      </td>
                    </tr>
                  ) : (
                    stock.map((item, index) => (
                      <tr key={index} className="border">
                        <td className="border p-2 ">{item.animal_type}</td>
                        <td className="border p-2 text-center">
                          {item.arrival}
                        </td>
                        <td className="border p-2 text-center">{item.born}</td>
                        <td className="border p-2 text-center">{item.dead}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 mb-4 ">
              <div className="flex justify-center">
                <Typography variant="h6" className=" font-bold mb-3 text-lg">
                  Animal Stock Details
                </Typography>
              </div>
              <Typography
                variant="h6"
                className="text-gray-700 font-semibold mb-3"
              >
                Arrival
              </Typography>
              <table className="w-full border-collapse border border-gray-200 mb-[20px] text-sm">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">Animal Type</th>
                    <th className="border p-2">Govt Id</th>
                    <th className="border p-2">Gender</th>
                    <th className="border p-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {animalarrival.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="border p-2 text-center text-gray-500"
                      >
                        No data available
                      </td>
                    </tr>
                  ) : (
                    animalarrival.map((item, index) => (
                      <tr key={index} className="border">
                        <td className="border p-2">{item.animal_type}</td>
                        <td className="border p-2 text-center">
                          {item.animal_type_no}
                        </td>
                        <td className="border p-2 text-center">
                          {item.animal_type_gender}
                        </td>{" "}
                        <td className="border p-2 text-center">
                          {moment(item.animal_type_date).format("DD-MM-YYYY")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              <Typography
                variant="h6"
                className="text-gray-700 font-semibold my-3"
              >
                Born
              </Typography>
              <table className="w-full border-collapse border border-gray-200 mb-[20px] text-sm">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">Animal Type</th>
                    <th className="border p-2">Govt Id</th>
                    <th className="border p-2">Gender</th>
                    <th className="border p-2">Date</th>
                    <th className="border p-2">Mother Govt Id</th>
                    <th className="border p-2">Father Govt Id</th>
                  </tr>
                </thead>
                <tbody>
                  {animalborn.length == 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="border p-2 text-center text-gray-500"
                      >
                        No data available
                      </td>
                    </tr>
                  ) : (
                    animalborn.map((item, index) => (
                      <tr key={index} className="border">
                        <td className="border p-2">{item.animal_type}</td>
                        <td className="border p-2 text-center">
                          {item.animal_type_no}
                        </td>
                        <td className="border p-2 text-center">
                          {item.animal_type_no}
                        </td>

                        <td className="border p-2 text-center">
                          {moment(item.animal_type_date).format("DD-MM-YYYY")}
                        </td>
                        <td className="border p-2 text-center">
                          {item.animal_type_mother_no}
                        </td>
                        <td className="border p-2 text-center">
                          {item.animal_type_father_no}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <Typography
                variant="h6"
                className="text-gray-700 font-semibold my-3"
              >
                Death/Given
              </Typography>

              <table className="w-full border-collapse border border-gray-200 text-sm ">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2 ">Animal Type</th>
                    <th className="border p-2">Govt Id</th>
                    <th className="border p-2">Gender</th>
                    <th className="border p-2">Date</th>
                    <th className="border p-2">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {animaldeath.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="border p-2 text-center text-gray-500"
                      >
                        No data available
                      </td>
                    </tr>
                  ) : (
                    animaldeath.map((item, index) => (
                      <tr key={index} className="border">
                        <td className="border p-2 ">{item.animal_type}</td>
                        <td className="border p-2 text-center">
                          {item.animal_type_no}
                        </td>
                        <td className="border p-2 text-center">
                          {item.animal_type_gender}
                        </td>{" "}
                        <td className="border p-2 text-center">
                          {moment(item.animal_type_date).format("DD-MM-YYYY")}
                        </td>
                        <td className="border p-2 text-center">
                          {item.animal_dead_source}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default AnimalStocksView;
