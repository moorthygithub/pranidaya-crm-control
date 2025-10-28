import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import axios from "axios";
import moment from "moment/moment";
import numWords from "num-words";
import { useEffect, useRef, useState } from "react";
import { IoIosPrint } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { toast, ToastContainer } from "react-toastify";
import { BaseUrl } from "../../../base/BaseUrl";
import {
  PdfDownloadIncashRecepit,
  WhatsappIncashRecepit,
} from "../../../components/ButtonComponents";
import {
  inputClass,
  inputClassBack,
} from "../../../components/common/Buttoncss";
import Layout from "../../../layout/Layout";

function ViewCashRecepit() {
  const [receipts, setReceipts] = useState(null);
  const [company, setCompany] = useState({});
  const [donor, setDonor] = useState(null);
  const [recepitsub, setRecepitsub] = useState(null);
  const { id } = useParams();
  const componentRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [emailloading, setEmailloading] = useState(false);

  const amountInWords = receipts?.c_receipt_total_amount
    ? numWords(receipts.c_receipt_total_amount).replace(/\b\w/g, (char) =>
        char.toUpperCase()
      )
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

  // const printReceipt = (e) => {
  //   e.preventDefault();
  //   axios({
  //     url: BaseUrl + "/print-receiptc/" + id,
  //     method: "GET",
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem("token")}`,
  //     },
  //   }).then((res) => {
  //     window.open(BaseUrl + "/print-receiptc/" + id, "_blank");
  //   });
  // };
  const printReceipt = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Recepit Report",
    pageStyle: `
         @page {
           size: A4;
           margin: 0mm;
         }
         @media print {
           body {
             margin: 0;
             padding: 2mm;
           }
           .print-hide {
             display: none;
           }
         }
       `,
  });
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

            <div
              className="flex justify-center mt-2 text-[#030762]"
              ref={componentRef}
            >
              <div className="py-4 px-2 w-full max-w-[700px]">
                <div className="flex justify-between text-[18px] mb-3 px-12">
                  <h4>ESTD 1981</h4>
                  <h4>DONATION RECEIPT</h4>
                  <h4>Phone : 29532204</h4>
                </div>
                <img
                  src="https://pranidaya.org/public/assets/images/panel/pranidaya.png"
                  alt="header logo"
                  className="mb-2"
                />
                <div className="border border-black text-[18px]">
                  <div className="border-b border-black">
                    <p className="text-justify px-3 py-1">
                      Donation is exempted u/s 80G of the Income Tax Act 1961
                      CIT (E)BLR/80G/S55/ AABAA6706H/1TO (E)-1/VOL 2017-2018{" "}
                      <span className="font-bold ml-6">
                        PAN: AABAA6706H, CSR00008537
                      </span>
                    </p>
                  </div>
                  <div className="space-y-2 text-[18px] leading-relaxed w-full py-2">
                    {/* Row 1 */}
                    <div className="grid grid-cols-[130px_20px_1fr_80px_20px_1fr] items-center gap-2">
                      <div className="ml-2">Receipt No</div>
                      <div>:</div>
                      <div className="border-b border-dashed border-black pb-1 text-black font-bold">
                        {receipts.c_receipt_no}
                      </div>
                      <div>Date</div>
                      <div>:</div>
                      <div className="border-b border-dashed border-black pb-1 text-black font-bold">
                        {moment(receipts.c_receipt_date).format("DD-MM-YYYY")}
                      </div>
                    </div>
                    {/* Row 2 */}
                    <div className="grid grid-cols-[130px_20px_1fr] items-center gap-2">
                      <div className="ml-2">Received with thanks from</div>
                      <div>:</div>
                      <div className="border-b border-dashed border-black pb-1 text-black font-bold min-h-[24px]">
                        <p className="ml-2">
                          {donor?.donor_title}{" "}
                          {receipts.family_full_check == "Yes"
                            ? receipts?.family_full_name
                            : donor?.donor_full_name}
                          {donor?.donor_city ? `, ${donor.donor_city}` : ""}
                          {donor?.donor_pin_code
                            ? ` - ${donor.donor_pin_code}`
                            : ""}
                          {donor?.donor_state ? `, ${donor.donor_state}` : ""}
                        </p>
                      </div>
                    </div>
                    {/* Row 3 */}
                    <div className="grid grid-cols-[130px_20px_1fr] items-start gap-2">
                      <div className="ml-2">Address</div>
                      <div>:</div>
                      <div className="border-b border-dashed border-black pb-1 text-black font-bold min-h-[24px]">
                        {donor?.donor_address || "\u00A0"}
                      </div>
                    </div>
                    {/* Row 4 */}
                    <div className="grid grid-cols-[130px_20px_1fr] items-center gap-2">
                      <div className="ml-2">Occasion of</div>
                      <div>:</div>
                      <div className="border-b border-dashed border-black pb-1 text-black font-bold min-h-[24px]">
                        {receipts?.occasion || "\u00A0"}
                      </div>
                    </div>
                    {/* Row 5 */}
                    <div className="grid grid-cols-[130px_20px_1fr] items-center gap-2">
                      <div className="ml-2">On Account of</div>
                      <div>:</div>
                      <div className="border-b border-dashed border-black pb-1 text-black font-bold min-h-[24px]">
                        {recepitsub && recepitsub.length > 0 ? (
                          recepitsub.map((item, index) => (
                            <div key={index} className="flex items-center">
                              <p className="ml-2">
                                {item.c_receipt_sub_donation_type} -{" "}
                                {item.c_receipt_sub_amount}
                                {index < recepitsub.length - 1 && ","}
                              </p>
                            </div>
                          ))
                        ) : (
                          <span className="invisible">placeholder</span>
                        )}
                      </div>
                    </div>
                    {/* Row 6 */}
                    <div className="grid grid-cols-[130px_20px_1fr_80px_20px_1fr] items-center gap-2">
                      <div className="ml-2">Pay Mode</div>
                      <div>:</div>
                      <div className="border-b border-dashed border-black pb-1 text-black font-bold min-h-[24px]">
                        {receipts?.c_receipt_tran_pay_mode || "\u00A0"}
                      </div>
                      <div>PAN No</div>
                      <div>:</div>
                      <div className="border-b border-dashed border-black pb-1 text-black font-bold min-h-[24px]">
                        {company?.company_pan_no || "\u00A0"}
                      </div>
                    </div>
                    {/* Row 7 */}
                    <div className="grid grid-cols-[130px_20px_1fr] items-center gap-2">
                      <div className="ml-2">Amount</div>
                      <div>:</div>
                      <div className="border-b border-dashed border-black pb-1  min-h-[24px]">
                        <span> Rs.</span>{" "}
                        <span className="text-black font-bold">
                          {receipts.c_receipt_total_amount || "\u00A0"}
                          /- ( {amountInWords} Only )
                        </span>
                      </div>
                    </div>
                    {/* Row 8 */}
                    <div className="grid grid-cols-[130px_20px_1fr] items-center gap-2">
                      <div className="ml-2">Reference</div>
                      <div>:</div>
                      <div className="border-b border-dashed border-black pb-1 text-black font-bold min-h-[24px]">
                        {receipts.c_receipt_ref_no || "\u00A0"}
                      </div>
                    </div>

                    <div className="border-b  border-black">
                      <div className="grid grid-cols-12 gap-2 mx-6 mb-2 min-h-[100px] items-end text-[18px]">
                        <div className="col-span-6 flex flex-col items-end">
                          {donor?.donor_full_name && (
                            <p>
                              ({donor?.donor_title} {donor?.donor_full_name})
                            </p>
                          )}
                          <p>Donor Sign</p>
                        </div>

                        <div className="col-span-6 flex flex-col items-end">
                          {company?.company_authsign && (
                            <p>({company.company_authsign})</p>
                          )}
                          <p>Receiver Sign</p>
                        </div>
                      </div>
                    </div>
                    <div className="mx-4">
                      <img
                        src="https://pranidaya.org/public/assets/images/panel/bank.png"
                        alt="Fotter img"
                        // className="mb-2"
                      />
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
