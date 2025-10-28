import Layout from "../../../layout/Layout";
import { Card, Button } from "@material-tailwind/react";
import { LuDownload } from "react-icons/lu";
import { MdEmail, MdKeyboardBackspace } from "react-icons/md";
import { IoIosPrint } from "react-icons/io";
import { BaseUrl } from "../../../base/BaseUrl";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { FaWhatsapp } from "react-icons/fa";
import numWords from "num-words";
import {
  PdfDownloadIncashRecepit,
  WhatsappIncashRecepit,
} from "../../../components/ButtonComponents";
import {
  inputClass,
  inputClassBack,
} from "../../../components/common/Buttoncss";

function ViewCashRecepit() {
  const [receipts, setReceipts] = useState(null);
  const [company, setCompany] = useState({});
  const [donor, setDonor] = useState(null);
  const [recepitsub, setRecepitsub] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [emailloading, setEmailloading] = useState(false);

  const amountInWords = receipts?.c_receipt_total_amount
    ? numWords(receipts.c_receipt_total_amount)
    : "";
  useEffect(() => {
    fetchdata();
  }, [id]);

  const fetchdata = () => {
    axios({
      url: `${BaseUrl}/fetch-c-receipt-by-id/${id}`,

      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        setReceipts(res.data.receipts || {});
        setCompany(res.data.company || {});
        setDonor(res.data.donor);
        setRecepitsub(res.data.receiptSub || []);
      })
      .catch((error) => {
        console.error("Error fetching receipt data:", error);
      });
  };
  const downloadReceipt = (e) => {
    e.preventDefault();
    let check = (window.location.href = BaseUrl + "/download-receiptsc/" + id);
    if (check) {
      toast.success("Receipt Downloaded Sucessfully");
    } else {
      toast.error("Receipt Not Downloaded");
    }
  };

  const sendEmail = (e) => {
    e.preventDefault();
    setEmailloading(true);
    axios({
      url: BaseUrl + "/send-receiptc/" + id,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        toast.success("Email Sent Sucessfully");
        fetchdata();
        setEmailloading(false);
      })
      .catch((error) => {
        toast.error("Error sending email");
        console.error("Email error:", error);
        setEmailloading(false);
      });
  };

  const printReceipt = (e) => {
    e.preventDefault();
    axios({
      url: BaseUrl + "/print-receiptc/" + id,
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      window.open(BaseUrl + "/print-receiptc/" + id, "_blank");
    });
  };

  const openModal = () => {
    setShowModal(true);
    localStorage.setItem("ftsid", receipts.donor_fts_id + "");
  };
  const closeModal = () => setShowModal(false);

  const onSubmitEmail = (e) => {
    e.preventDefault();
    let data = {
      donor_email: email,
    };

    axios({
      url: BaseUrl + "/update-donor-email/" + donor.donor_fts_id,
      method: "PUT",
      data,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      if (res.data.code == "201") {
        toast.success("Email  Updated Sucessfully");
        closeModal();
        fetchdata();
      } else {
        toast.error("Duplicate Entry of Email Id");
        setShowModal(false);
      }
    });
  };

  // const whatsApp = (e) => {
  //   e.preventDefault();

  //   const phoneNumber = donor.donor_whatsapp;
  //   const message = "Hello!";
  //   const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
  //     message
  //   )}`;
  //   window.open(whatsappLink, "_blank");
  // };
  const whatsApp = (e) => {
    e.preventDefault();
    if (donor?.donor_whatsapp) {
      const phoneNumber = donor.donor_whatsapp;
      const message = "Hello!";
      const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        message
      )}`;
      window.open(whatsappLink, "_blank");
    } else {
      toast.error("Donor's WhatsApp number is not available.");
    }
  };
  return (
    <Layout>
      <ToastContainer />
      <div className="p-6 mt-5 bg-white shadow-md rounded-lg">
        <div className="flex flex-col md:flex-row justify-between items-center p-2 gap-4">
          <h1 className="text-2xl text-[#464D69] font-semibold">
            Cash Receipt
          </h1>
          <div className="flex space-x-3">
            <div className="flex flex-col md:flex-row justify-center md:justify-end items-center space-y-4 md:space-y-0 md:space-x-4 p-3">
              <PdfDownloadIncashRecepit
                onClick={downloadReceipt}
                className={`${inputClass} w-[80px] flex items-center justify-center text-center`}
              />
              <WhatsappIncashRecepit
                onClick={whatsApp}
                className={`${inputClass}  flex items-center justify-center text-center`}
              />

              {donor?.donor_email ? (
                <>
                  <div
                    className={`${inputClass} flex flex-col items-center text-center`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <a onClick={sendEmail} className="flex items-center">
                        <MdEmail className="text-lg" />
                        <span>
                          {emailloading ? "Sending..." : "Send Email"}{" "}
                          {receipts?.c_receipt_email_count == null
                            ? "(0)"
                            : `(${receipts.c_receipt_email_count})`}
                        </span>
                      </a>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-start text-red-500 ">
                  <button onClick={openModal} className={`${inputClass} mt-6`}>
                    Add Email
                  </button>
                  <p className="flex items-center ml-6">
                    <span>Email not found</span>
                  </p>
                </div>
              )}

              <Dialog open={showModal} handler={closeModal}>
                <DialogHeader>Add Donor Email</DialogHeader>
                <DialogBody>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter donor email"
                    className="w-full px-3 py-2 mt-1 border rounded"
                    name="donor_email"
                  />
                </DialogBody>
                <DialogFooter>
                  <button onClick={closeModal} className={inputClassBack}>
                    Cancel
                  </button>
                  <button onClick={onSubmitEmail} className={inputClass}>
                    Add Email
                  </button>
                </DialogFooter>
              </Dialog>

              <button
                className={`${inputClass} flex  justify-center items-center gap-1`}
                onClick={printReceipt}
              >
                <IoIosPrint className="text-lg" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>

        {receipts && (
          <div>
            <hr></hr>

            <div className="flex justify-center mt-2">
              <div className="p-4 w-full max-w-[90%] md:max-w-[80%] lg:max-w-[70%]">
                <div className="border border-black">
                  <div className="grid grid-cols-1 md:grid-cols-2 h-auto md:h-16">
                    <div className="border-b border-r border-black px-4 py-2 flex items-center">
                      <strong>Receipt No:</strong>
                      <p className="text-black font-bold text-sm ml-2">
                        {receipts.c_receipt_no}
                      </p>
                    </div>
                    <div className="border-b border-black px-4 py-2 flex items-center">
                      <strong>Date:</strong>
                      <p className="text-black font-bold text-sm ml-2">
                        {new Date(receipts.c_receipt_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="border-b border-black px-4 py-2 h-auto md:h-16 flex items-center">
                    <strong>Received with thanks from:</strong>
                    {receipts.family_full_check == "Yes" ? (
                      <>
                        <p className="text-black font-bold text-sm ml-2">
                          {donor?.donor_title} {receipts?.family_full_name},{" "}
                          {donor?.donor_city} - {donor?.donor_pin_code},{" "}
                          {donor?.donor_state}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-black font-bold text-sm ml-2">
                          {donor?.donor_title} {donor?.donor_full_name},{" "}
                          {donor?.donor_city} - {donor?.donor_pin_code},{" "}
                          {donor?.donor_state}
                        </p>
                      </>
                    )}
                    {/* <p className="text-black font-bold text-sm ml-2">
                      {receipts.family_full_check === "Yes"
                        ? `${donor?.donor_title} ${receipts?.family_full_name}, ${donor?.donor_city} - ${donor?.donor_pin_code}, ${donor?.donor_state}`
                        : `${donor?.donor_title} ${donor?.donor_full_name}, ${donor?.donor_city} - ${donor?.donor_pin_code}, ${donor?.donor_state}`}
                    </p> */}
                  </div>

                  <div className="border-b border-black px-4 py-2 h-auto md:h-16 flex items-center">
                    <strong>Occasion of:</strong>
                    <p className="text-black font-bold text-sm ml-2">
                      {receipts.c_receipt_occasional}
                    </p>
                  </div>

                  <div className="border-b border-black px-4 py-2 h-auto md:h-16 flex items-center">
                    <strong>On Account of:</strong>
                    {recepitsub.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <p className="text-black font-bold text-sm ml-2">
                          {item.c_receipt_sub_donation_type} -{" "}
                          {item.c_receipt_sub_amount},
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 h-auto md:h-16">
                    <div className="border-b border-r border-black px-4 py-2 flex items-center">
                      <strong>Pay Mode:</strong>
                      <p className="text-black font-bold text-sm ml-2">
                        {receipts.c_receipt_tran_pay_mode}
                      </p>
                    </div>
                    <div className="border-b border-black px-4 py-2 flex items-center">
                      <strong>PAN:</strong>
                      <p className="text-black font-bold text-sm ml-2">
                        {company?.company_pan_no}
                      </p>
                    </div>
                  </div>

                  <div className="border-b border-black px-4 py-2 h-auto md:h-16 flex items-center">
                    <strong>Reference:</strong>
                    <p className="text-black font-bold text-sm ml-2">
                      {receipts.c_receipt_ref_no}
                    </p>
                  </div>

                  <div className="px-4 py-2 border-b border-black h-auto md:h-16 flex items-center">
                    <strong>Amount:</strong>
                    <p className="text-black font-bold text-sm ml-2">
                      {receipts.c_receipt_total_amount}
                    </p>{" "}
                    /- (
                    <p className="text-black font-bold text-sm capitalize">
                      {amountInWords} Only)
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 h-auto md:h-16">
                    <div className=" border-black px-4 py-2 flex items-center">
                      <strong>Donor Sign:</strong>
                      <p className="text-black font-bold text-sm ml-2">
                        ({donor?.donor_title} {donor?.donor_full_name})
                      </p>
                    </div>
                    <div className=" border-black px-4 py-2 flex items-center">
                      <strong>Receiver Sign:</strong>
                      <p className="text-black font-bold text-sm ml-2">
                        ({company?.company_authsign})
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default ViewCashRecepit;
