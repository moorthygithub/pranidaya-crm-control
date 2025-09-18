import { Input } from "@material-tailwind/react";
import Moment from "moment";
import { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { BaseUrl } from "../../../base/BaseUrl";
import Dropdown from "../../../components/common/DropDown";
import Layout from "../../../layout/Layout";
// import "react-hot-toast/dist/ReactToastify.css";
import axios from "axios";
import { inputClass } from "../../../components/common/Buttoncss";
import { ContextPanel } from "../../../utils/ContextPanel";
import DownloadCommon from "../../download/DeliveryDownload";
const donation_type = [
  {
    value: "Gopalak",
    label: "Gopalak",
  },
  {
    value: "Wet/Dry-Grass",
    label: "Wet/Dry-Grass",
  },
  {
    value: "FIne/Rough Bran",
    label: "FIne/Rough Bran",
  },
  {
    value: "Gou-Daan",
    label: "Gou-Daan",
  },
  {
    value: "Building Fund",
    label: "Building Fund",
  },
  {
    value: "Pigeon Feeds",
    label: "Pigeon Feeds",
  },
  {
    value: "General Fund/Others",
    label: "General Fund/Others",
  },
  {
    value: "Milk",
    label: "Milk",
  },
  {
    value: "Manure",
    label: "Manure",
  },
];
const exemption = [
  {
    value: "80G",
    label: "80G",
  },
  {
    value: "Non 80G",
    label: "Non 80G",
  },
  {
    value: "FCRA",
    label: "FCRA",
  },
  {
    value: "CSR",
    label: "CSR",
  },
];
const manual = [
  {
    value: "All",
    label: "All",
  },
  {
    value: "1",
    label: "Manual",
  },
];
const pay_mode = [
  {
    value: "Cash",
    label: "Cash",
  },
  {
    value: "Cheque",
    label: "Cheque",
  },
  {
    value: "Credit Card",
    label: "Credit Card",
  },
  {
    value: "Online",
    label: "Online",
  },
  {
    value: "Others",
    label: "Others",
  },
];
function Cash() {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const { dates } = useContext(ContextPanel);
  const userType = localStorage.getItem("user_type_id");

  //FROM AND TO DATE
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;
  var todayback = yyyy + "-" + mm + "-" + dd;
  const allowedDates = dates?.c_receipts || [];

  let firstdate = Moment().startOf("month").format("YYYY-MM-DD");

  if (userType == 5 && allowedDates.length > 0) {
    firstdate = allowedDates[allowedDates.length - 1];
  }
  const [receiptsdwn, setReceiptDownload] = useState({
    receipt_from_date: firstdate,
    receipt_to_date: todayback,
    receipt_donation_type: "",
    receipt_exemption_type: "",
    c_manual_receipt_no: "",
    receipt_tran_pay_mode: "",
  });

  const onInputChange = (e) => {
    setReceiptDownload({
      ...receiptsdwn,
      [e.target.name]: e.target.value,
    });
  };

  //SUBMIT
  const onSubmit = (e) => {
    e.preventDefault();
    let data = {
      receipt_from_date: receiptsdwn.receipt_from_date,
      receipt_to_date: receiptsdwn.receipt_to_date,
      receipt_donation_type: receiptsdwn.receipt_donation_type,
      receipt_exemption_type: receiptsdwn.receipt_exemption_type,
      c_manual_receipt_no: receiptsdwn.c_manual_receipt_no,
      receipt_tran_pay_mode: receiptsdwn.receipt_tran_pay_mode,
    };
    var v = document.getElementById("dowRecp").checkValidity();
    var v = document.getElementById("dowRecp").reportValidity();
    if (v) {
      setIsButtonDisabled(true);

      axios({
        url: BaseUrl + "/download-receipt",
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
          link.setAttribute("download", "receipt_list.csv");
          document.body.appendChild(link);
          link.click();
          toast.success("Receipt is Downloaded Successfully");
          setIsButtonDisabled(false);
        })
        .catch((err) => {
          toast.error("Receipt is Not Downloaded");
          setIsButtonDisabled(false);
        });
    }
  };

  return (
    <Layout>
      <DownloadCommon />
      <div className="p-6 mt-5 bg-white shadow-md rounded-lg">
        <div>
          <h1 className="text-xl md:text-2xl text-[#464D69] font-semibold ml-2">
            Download Donation Receipts
          </h1>
        </div>
        <div className="p-4">
          <h3 className="text-red-500 mb-5">
            Leave blank if you want all records.
          </h3>

          <form id="dowRecp" autoComplete="off">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              <div className="w-full">
                <Input
                  required
                  type="date"
                  label="From Date"
                  className="required"
                  name="receipt_from_date"
                  value={receiptsdwn.receipt_from_date}
                  min={allowedDates[allowedDates.length - 1]}
                  onChange={(e) => onInputChange(e)}
                />
              </div>
              <div className="w-full">
                <Input
                  required
                  type="date"
                  label="To Date"
                  className="required"
                  name="receipt_to_date"
                  value={receiptsdwn.receipt_to_date}
                  onChange={(e) => onInputChange(e)}
                />
              </div>

              <div className="w-full">
                <Dropdown
                  label="Purpose"
                  className="required"
                  options={donation_type.map((option, index) => ({
                    value: option.value,
                    label: option.label,
                  }))}
                  onChange={(value) => {
                    setReceiptDownload((prev) => ({
                      ...prev,
                      receipt_donation_type: value,
                    }));
                  }}
                  name="receipt_donation_type"
                />
              </div>
              <div className="w-full">
                <Dropdown
                  label="Category"
                  className="required"
                  options={exemption.map((option, index) => ({
                    value: option.value,
                    label: option.label,
                  }))}
                  onChange={(value) => {
                    setReceiptDownload((prev) => ({
                      ...prev,
                      receipt_exemption_type: value,
                    }));
                  }}
                  name="receipt_exemption_type"
                />
              </div>

              <div className="w-full">
                <Dropdown
                  label="Transaction Type"
                  className="required"
                  options={pay_mode.map((option, index) => ({
                    value: option.value,
                    label: option.label,
                  }))}
                  onChange={(value) => {
                    setReceiptDownload((prev) => ({
                      ...prev,
                      receipt_tran_pay_mode: value,
                    }));
                  }}
                  name="receipt_tran_pay_mode"
                />
              </div>
              <div className="w-full">
                <Dropdown
                  label="Manual Receipt"
                  className="required"
                  options={manual.map((option, index) => ({
                    value: option.value,
                    label: option.label,
                  }))}
                  onChange={(value) => {
                    setReceiptDownload((prev) => ({
                      ...prev,
                      c_manual_receipt_no: value,
                    }));
                  }}
                  name="c_manual_receipt_no"
                />
              </div>

              <div className="w-77">
                <button
                  className={`${inputClass} ${
                    isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={onSubmit}
                  disabled={isButtonDisabled}
                >
                  {isButtonDisabled ? "Downloading..." : "Download"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default Cash;
