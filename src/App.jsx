import { Route, Routes } from "react-router-dom";
import ForgetPassword from "./pages/auth/ForgetPassword";
import SignIn from "./pages/auth/SignIn";
import SIgnUp from "./pages/auth/SIgnUp";
import Home from "./pages/dashboard/Home";
import Maintenance from "./pages/maintenance/Maintenance";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditMaterial from "././pages/Recepits/MaterialRecepits/EditMaterial";
import DisableRightClick from "./components/common/DisableRightClick";
import Animal from "./pages/AnimalStock/Animal/Animal";
import CreateAnimal from "./pages/AnimalStock/Animal/CreateAnimal";
import EditAnimal from "./pages/AnimalStock/Animal/EditAnimal";
import AnimalBornArrival from "./pages/AnimalStock/AnimalBornArrival/AnimalBornArrival";
import CreateBornArrival from "./pages/AnimalStock/AnimalBornArrival/CreateBornArrival";
import AnimalDead from "./pages/AnimalStock/AnimalDead/AnimalDead";
import CreateAnimalDead from "./pages/AnimalStock/AnimalDead/CreateAnimalDead";
import AnimalMeat from "./pages/AnimalStock/AnimalMeat/AnimalMeat";
import CreateAnimalMeat from "./pages/AnimalStock/AnimalMeat/CreateAnimalMeat";
import EditAnimalMeat from "./pages/AnimalStock/AnimalMeat/EditAnimalMeat";
import AnimalStocks from "./pages/AnimalStock/AnimalStocks/AnimalStocks";
import AnimalStocksView from "./pages/AnimalStock/AnimalStocks/AnimalStocksView";
import AddDonorList from "./pages/DonorList/AddDonorList";
import CashRecepitAll from "./pages/DonorList/CashRecepitAll";
import CreateDonorRecepit from "./pages/DonorList/CreateDonorCashRecepit";
import CreateDonor from "./pages/DonorList/CreateDonorMaterialRecepit";
import DonorList from "./pages/DonorList/DonorList";
import DonorReceiptsDetails from "./pages/DonorList/DonorReceiptsDetails";
import ConvertDuplicate from "./pages/DonorList/Duplicate/ConvertDuplicate";
import DuplicateDonorList from "./pages/DonorList/Duplicate/DuplicateDonorList";
import EditDuplicate from "./pages/DonorList/Duplicate/EditDuplicate";
import FamilyDonorDuplicate from "./pages/DonorList/Duplicate/FamilyDonorDuplicate";
import EditDonorList from "./pages/DonorList/EditDonorList";
import AddFamilyMembers from "./pages/DonorList/FamilyMembers/AddFamilyMembers";
import FamilyList from "./pages/DonorList/FamilyMembers/FamilyList";
import MaterialRecepitAll from "./pages/DonorList/MaterialRecepitAll";
import ViewDonorDetails from "./pages/DonorList/ViewDonorDetails";
import DowloadConsumption from "./pages/Dowloads/Consumption/DowloadConsumption";
import Cash from "./pages/Dowloads/Delivery/Cash";
import Donor from "./pages/Dowloads/Donor/Donor";
import Exam from "./pages/Dowloads/MaterialReceipts/MaterialReceipts";
import Students from "./pages/Dowloads/Purchase/CashPurchase";
import DownloadWebDonation from "./pages/Dowloads/WebDonation/DownloadWebDonation";
import EnquiryDownload from "./pages/download/EnquiryDownload";
import AddEnquiry from "./pages/Master/ListItem/AddItem";
import EditList from "./pages/Master/ListItem/EditList";
import OpenListEnquiry from "./pages/Master/ListItem/List Item";
import AddOccasion from "./pages/Master/Occasion/Addoccasion";
import EditOccasion from "./pages/Master/Occasion/Editoccasion";
import ListOccasion from "./pages/Master/Occasion/Listoccasion";
import AddVendors from "./pages/Master/Vendors List/AddVendors";
import EditVendors from "./pages/Master/Vendors List/EditVendors";
import VendorList from "./pages/Master/Vendors List/VendorList";
import RecepitCashRecepit from "./pages/Recepits/CashRecepits/CashRecepit";
import EditRecepit from "./pages/Recepits/CashRecepits/EditRecepits";
import ViewCashRecepit from "./pages/Recepits/CashRecepits/ViewRecepit";
import MaterialRecepits from "./pages/Recepits/MaterialRecepits/MaterialRecepits";
import ViewMaterial from "./pages/Recepits/MaterialRecepits/ViewMaterial";
import DonationSummary from "./pages/Reports/DonationSummary/DonationSummary";
import DonationSummaryView from "./pages/Reports/DonationSummary/DonationSummaryView";
import PendingListTask from "./pages/Reports/StockReport";
import ViewStockSummary from "./pages/Reports/ViewStockSummary";
import AddConsumption from "./pages/Stock/Consumption/Addconsumption";
import Consumption from "./pages/Stock/Consumption/consumption";
import EditConsumption from "./pages/Stock/Consumption/EditConsumption";
import AddPurchase from "./pages/Stock/Purchase/AddPurchase";
import EditPurchase from "./pages/Stock/Purchase/EditPurchase";
import PurchaseList from "./pages/Stock/Purchase/PurchaseList";
import Stock from "./pages/Stock/StockList/StockList";
import CreateButton from "./pages/userManagement/CreateButton";
import TabIndex from "./pages/userManagement/TabIndex";
import WebDonation from "./pages/WebDonation/WebDonation";
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <>
        <DisableRightClick />
        <ToastContainer />
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/register" element={<SIgnUp />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          {/* <Route path="/enquiry-now" element={<EnquiryNow />} /> */}
          <Route path="/home" element={<Home />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/donor-list" element={<DonorList />} />
          <Route path="/add-donor/:id?" element={<AddDonorList />} />
          <Route path="/edit-donor/:id" element={<EditDonorList />} />
          <Route path="/create-donor/:id" element={<CreateDonor />} />
          <Route path="/create-family/:id" element={<FamilyList />} />
          <Route path="/add-family" element={<AddFamilyMembers />} />
          <Route path="/duplicate" element={<DuplicateDonorList />} />
          <Route path="/edit-duplicate/:id" element={<EditDuplicate />} />
          <Route
            path="/zero-duplicate/:id"
            element={<FamilyDonorDuplicate />}
          />
          <Route path="/no-duplicate/:id" element={<ConvertDuplicate />} />
          <Route
            path="/createrecepit-donor/:id?"
            element={<CreateDonorRecepit />}
          />
          <Route path="/cashrecepitall/:id?" element={<CashRecepitAll />} />
          <Route path="/materialrecepitall" element={<MaterialRecepitAll />} />
          <Route path="/viewdonor-list/:id" element={<ViewDonorDetails />} />
          <Route
            path="/recepitdonor-list/:id"
            element={<DonorReceiptsDetails />}
          />
          {/* MASTER  */}
          <Route path="/master-list" element={<OpenListEnquiry />} />
          <Route path="/add-enquiry" element={<AddEnquiry />} />
          <Route path="/edit-enquiry/:id" element={<EditList />} />
          <Route path="/occasion" element={<ListOccasion />} />
          <Route path="/add-occasion" element={<AddOccasion />} />
          <Route path="/edit-occasion/:id" element={<EditOccasion />} />
          <Route path="/addVendor" element={<AddVendors />} />
          <Route path="/purchase" element={<PurchaseList />} />
          <Route path="/consumption" element={<Consumption />} />
          <Route path="/cashrecepit" element={<RecepitCashRecepit />} />
          <Route path="recepit-material" element={<MaterialRecepits />} />
          {/* Reports  */}
          <Route path="/stock-summary" element={<PendingListTask />} />
          <Route path="/d-summary" element={<DonationSummary />} />
          <Route path="/d-summary-view" element={<DonationSummaryView />} />
          <Route path="/view-stock" element={<ViewStockSummary />} />
          <Route path="/download-enquiry" element={<EnquiryDownload />} />
          <Route path="/donor" element={<Donor />} />
          <Route path="/cashpurchase" element={<Students />} />
          <Route path="/cash" element={<Cash />} />
          <Route path="/M-recepit" element={<Exam />} />
          <Route path="/D-consumption" element={<DowloadConsumption />} />
          <Route path="/VendorList" element={<VendorList />} />
          <Route path="/EditVendors/:id" element={<EditVendors />} />
          <Route path="/add-purchase" element={<AddPurchase />} />
          <Route path="/edit-purchase/:id" element={<EditPurchase />} />
          <Route path="/add-consumption" element={<AddConsumption />} />
          <Route path="/edit-consumption/:id" element={<EditConsumption />} />
          {/* //STOCK */}
          <Route path="/stock" element={<Stock />} />
          <Route path="/recepit-edit/:id" element={<EditRecepit />} />
          <Route path="/recepit-view/:id" element={<ViewCashRecepit />} />
          {/* //MATERIAL Recepits */}
          <Route path="/material-edit/:id" element={<EditMaterial />} />
          <Route path="/material-view/:id" element={<ViewMaterial />} />
          {/* //DOWLOAD */}
          <Route path="/web-donation" element={<DownloadWebDonation />} />
          <Route path="/webdonation" element={<WebDonation />} />
          {/* <Route path="/test" element={<Test />} /> */}
          <Route path="/userManagement" element={<TabIndex />} />
          <Route path="/create-createMTest" element={<CreateButton />} />
          {/* ///animal stock */}

          <Route path="/animalStock" element={<Animal />} />
          <Route path="/add-animal" element={<CreateAnimal />} />
          <Route path="/edit-animal/:id" element={<EditAnimal />} />
          {/* //animal meet */}
          <Route path="/animal-meet" element={<AnimalMeat />} />
          <Route path="/add-animal-meet" element={<CreateAnimalMeat />} />
          <Route path="/edit-animal-meet/:id" element={<EditAnimalMeat />} />
          {/* //animal born/arrival meet */}
          <Route path="/animal-born-arrival" element={<AnimalBornArrival />} />
          <Route path="/add-born-arrival" element={<CreateBornArrival />} />
          {/* //animal dead */}
          <Route path="/animal-dead" element={<AnimalDead />} />
          <Route path="/add-animal-dead" element={<CreateAnimalDead />} />
          {/* //animal stocks */}
          <Route path="/animal-stock" element={<AnimalStocks />} />
          <Route path="/animal-stock-view" element={<AnimalStocksView />} />
        </Routes>
      </>
    </QueryClientProvider>
  );
};

export default App;
