import {
  Input,
  Checkbox,
  Button,
  Typography,
  Carousel,
} from "@material-tailwind/react";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BaseUrl } from "../../base/BaseUrl";
import { ContextPanel } from "../../utils/ContextPanel";

import image1 from "../../assets/mainpage.jpg";
import Logo from "../../assets/logo.jpg";
import { toast } from "react-toastify";
import { inputClass } from "../../components/common/Buttoncss";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { isPanelUp, fetchPermissions, fetchPagePermission } =
    useContext(ContextPanel);
  const navigate = useNavigate();

  const handleSumbit = async (e) => {
    e.preventDefault();
    if (!isPanelUp) {
      navigate("/maintenance");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);
    console.log(formData, "dormdata");
    try {
      const res = await axios.post(`${BaseUrl}/login`, formData);
      console.log(res, "res");

      if (res.status === 200) {
        const token = res.data.UserInfo?.token;
        localStorage.setItem("token", token);
        localStorage.setItem("full_name", res.data.UserInfo.user.full_name);
        localStorage.setItem("username", res.data.UserInfo.user.name);
        localStorage.setItem(
          "user_type_id",
          res.data.UserInfo.user.user_type_id
        );
        await fetchPagePermission();
        await fetchPermissions();

        if (token) {
          navigate("/home");
          toast.success("User Logged In Successfully");
        } else {
          toast.error("Login Failed, Token not received.");
        }
      } else {
        toast.error("Login Failed, Please check your credentials.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during login.");
    }

    setLoading(false);
  };
  return (
    <>
      <section className="flex flex-col lg:flex-row h-screen">
        {/* Left Section for Carousel // h-full -add */}
        <div className="hidden lg:block lg:w-1/2 h-full">
          {/* <Carousel autoplay loop>
            <img
              src={image1}
              alt="Slide 1"
              className="h-full w-full object-cover"
            />
            <img
              src={image2}
              alt="Slide 2"
              className="h-full w-full object-cover"
            />
            <img
              src={image3}
              alt="Slide 3"
              className="h-full w-full object-cover"
            />
          </Carousel> */}

          <img
            src={image1}
            // src="https://img.freepik.com/free-photo/white-bovine-ox-grazing-agricultural-field-goa-india_181624-53390.jpg?t=st=1738149059~exp=1738152659~hmac=20594f6da5f06958e9cc22c66bf8d1a8ef46004658d27f9684aebed0551c44db&w=996"
            alt="img 1"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right Section for Login Form  h-full add*/}
        <div className="flex-1 flex items-center bg-blue-50 justify-center px-4 lg:px-8 py-12 h-full lg:w-1/2">
          <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg  shadow-blue-500 ">
            <div>
              <img
                src={Logo}
                alt="Logo"
                className="h-auto w-full rounded-lg  "
              />
            </div>

            <div className="flex justify-between mb-4">
              <div>
                <h2 className="font-bold text-2xl text-[#002D74]">Login</h2>
                <p className="text-xs mt-4 text-[#002D74]">
                  If you are already a member, easily log in
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSumbit}
              method="POST"
              className="mt-8 mb-2 w-full"
            >
              <div className="mb-6 flex flex-col gap-6">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="-mb-3 font-medium"
                >
                  User Name
                </Typography>
                <Input
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  size="lg"
                  placeholder="username"
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
                <div className="flex justify-between">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="-mb-3 font-medium"
                  >
                    Password
                  </Typography>
                </div>

                <Input
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  size="lg"
                  placeholder="********"
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
              </div>

              {/* <button
                type="submit"
                disabled={loading}
                className={`${inputClass} ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                } w-full`}
                fullWidth
              >
                {loading ? "Checking..." : "Sign In"}
              </button> */}
              <button
                type="submit"
                disabled={loading}
                className={`${inputClass} w-full flex items-center justify-center space-x-3 py-2 px-4 transition-all duration-300 ease-in-out transform ${
                  loading
                    ? "opacity-75 cursor-not-allowed scale-95"
                    : "scale-100"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-4 border-t-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
                    <span className="animate-pulse">Checking...</span>
                  </>
                ) : (
                  <span className="transition-opacity duration-300 ease-in-out opacity-100">
                    Sign In
                  </span>
                )}
              </button>

              <div className="flex items-center justify-end gap-2 mt-6">
                <Typography
                  variant="small"
                  className="font-medium p-2 text-gray-900 hover:bg-blue-200 hover:rounded-lg border-b border-blue-500"
                >
                  <Link to="/forget-password" className="text-gray-900 ml-1">
                    Forgot Password
                  </Link>
                </Typography>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignIn;
