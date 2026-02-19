import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import assets from "../assets/bgpage.jpg";
import { API } from "../Api/axios";
import { ToastContainer } from "react-toastify";
import { HandleError, HandleSuccess } from "../utils/util";


export default function Login() {
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const HandleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = login;
    if (!email || !password) {
      return HandleError("All Filed is Required ");
    }
    try {
      const res = await API.post("api/login", login);

      localStorage.setItem("token", res.data.JwtTok);
      localStorage.setItem("userName", res.data.name);
      localStorage.setItem("userEmail", res.data.email);
      localStorage.setItem("userRole", res.data.role);

      if (res.status === 201) {
        HandleSuccess("Login Successfully !");

        if (res.data.role === "admin") {
          setTimeout(() => navigate("/admin"), 2000);
        } else {
          setTimeout(() => navigate("/productpage"), 2000);
        }
      }
    } catch (error) {
      HandleError("Login Failed");
    }
  };

  return (
    <div>
      <div
        className="bg-cover w-full flex items-center justify-center h-[100vh]"
        style={{ backgroundImage: `url(${assets})` }}
      >
        <div className="max-w-[500px] border rounded-2xl   shadow-2xl flex-col items-center  flex justify-center space-x-2  text-black px-10 py-9">
          <h1 className="text-black mb-10 py-4 font-bold text-orange-400 text-4xl items-center text-center  border-b-2 ">
            LOGIN
          </h1>
          <form onSubmit={HandleSubmit}>
            <div className="flex flex-col item-center ">
              <div className="mb-9  flex flex-col">
                <label className=" text-gray-800 w-35 font-stretch-200% py-3 font-bold">
                  Email :
                </label>
                <input
                  onChange={(e) => {
                    setLogin({ ...login, email: e.target.value });
                  }}
                  className="border rounded h-13 p-2 w-70"
                  type="email"
                  autoFocus
                  value={login.email}
                  placeholder="Enter your email"
                />
              </div>
              <div className="mb-9 flex flex-col">
                <label className=" font-stretch-120% text-gray-800 py-3 w-35 font-bold">
                  Password :
                </label>
                <input
                  onChange={(e) => {
                    setLogin({ ...login, password: e.target.value });
                  }}
                  className="border p-2 rounded h-13 w-70"
                  type="password"
                  value={login.password}
                  placeholder="Enter your Password"
                />
              </div>
            </div>
            <div>
              <button className="text-white bg-orange-400 h-12 w-[300px] rounded-2xl text-2xl " type="submit">
                LOGIN
              </button>
            </div>
            <div className="mt-9 flex items-center justify-center text-center">
              <span className="font-extrabold font-stretch-110%">
                Have Not An Account ? <Link to="/reg">Register</Link>
              </span>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
