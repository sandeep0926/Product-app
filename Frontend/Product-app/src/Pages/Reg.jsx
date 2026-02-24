import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import assets from "../assets/bgpage.jpg";
import { ToastContainer } from "react-toastify";
import { HandleError, HandleSuccess } from "../utils/util";
import { API } from "../Api/axios";

export default function Reg() {
  const navigate = useNavigate();
  const [Register, setRegister] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [err, setErr] = useState({});

  const validate = () => {
    let newErr = {};

    if (!Register.name) {
      newErr.name = "Name is Requierd";
    }
    if (!Register.email) {
      newErr.email = "Email is Requierd";
    }
    if (!Register.password  ) {
      newErr.password="Passwoed is Required";
    }
    else if(Register.password.length <6){
      newErr.password = "Password  max length 6 is Requierd";

    }
    return newErr;
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();

    // const { name, email, password } = Register;
    // if (!name || !email || !password) {
    //   return HandleError("All Filed is Required ");
    // }
    console.log("HandleSubmit");
    
    const ValErr = validate();
    setErr(ValErr);

    if (Object.keys(ValErr).length === 0) {
      try {
        const res = await API.post("/api/reg", Register);

        if (res.status === 201 || res.data.success) {
          HandleSuccess("Successfully Registered!");
          setTimeout(() => navigate("/login"), 2000);
        }
      } catch (error) {
        HandleError("Register Failed");
      }
    }
  };

  return (
    <div>
      <div
        className="bg-cover bg-white w-full flex items-center justify-center h-[100vh] px-4"
        style={{ backgroundImage: `url(${assets})` }}
      >
        <div className="w-full max-w-[450px] border rounded-2xl bg-white border-white  shadow-2xl flex-col items-center  flex justify-center space-x-2  text-black px-6 md:px-10 py-8 md:py-9 ">
          <h1 className="text-black mb-10 py-4 font-bold text-orange-400 items-center text-center text-4xl border-b-2 ">
            SIGNUP
          </h1>
          <form onSubmit={HandleSubmit}>
            <div className="flex flex-col w-full  item-center ">
              <div className="mb-9  flex flex-col">
                <label className=" text-gray-800 font-stretch-200% py-3 w-65 font-bold">              
                  Name :
                </label>
                <input
                  onChange={(e) => {
                    setRegister({ ...Register, name: e.target.value });
                  }}
                  className="border w-full rounded h-13 p-2 w-70"
                  type="text"
                  autoFocus
                  value={Register.name}
                  placeholder="Enter your name"
                />
                {err.name && <p style={{color:"red"}}>
                  {err.name}</p>}
              </div>
              <div className="mb-9  flex flex-col">
                <label className=" text-gray-800 w-35 font-stretch-200% py-3 font-bold">
                  Email :
                </label>
                <input
                  value={Register.email}
                  onChange={(e) => {
                    setRegister({ ...Register, email: e.target.value });
                  }}
                  className="border w-full rounded h-13 p-2 w-70"
                  type="email"
                  placeholder="Enter your email"
                />
                  {err.email && <p style={{color:"red"}}>
                  {err.email}</p>}
              </div>
              <div className="mb-9 flex flex-col">
                <label className=" font-stretch-120% text-gray-800 py-3 w-35 font-bold">
                  Password :
                </label>
                <input
                  value={Register.password}
                  onChange={(e) => {
                    setRegister({ ...Register, password: e.target.value });
                  }}
                  className="border p-2 w-full  rounded h-13 w-70"
                  type="password"
                  placeholder="Enter your Password"
                />
                  {err.password && <p style={{color:"red"}}>
                  {err.password}</p>}
              </div>
            </div>
            <div>
              <button
                className="text-white  text-2xl bg-orange-400 h-12 rounded-2xl w-full"
                type="submit"
              >
                Register
              </button>
            </div>
          </form>
          <div className="mt-10 flex text-center justify-center items-center ">
            <span className="font-extrabold  font-stretch-125%">
              Have An Account ? <Link to="/login">Login</Link>
            </span>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
