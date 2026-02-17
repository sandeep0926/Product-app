import { useState } from "react";

export default function Reg() {
  const [Regeister, setRegeister] = useState({
    name: "",
    email: "",
    password: "",
  });

  return (
    <div className=" border shadow-2xl gap-3.5 ml-170  text-black px-4 py-9">
      <h1 className="text-black">SIGNUP PAGE</h1>
      <div>
        <label> Name:</label>
        <input className="border" type="text" placeholder="Enter your name" />
      </div>
      <div>
        <label>Email:</label>
        <input className="border" type="text" placeholder="Enter your email" />
      </div>
      <div>
        {" "}
        <label>Password:</label>
        <input
          className="border"
          type="password"
          placeholder="Enter your Password"
        />
      </div>
      <span>Have Not An Account </span>
    </div>
  );
}
