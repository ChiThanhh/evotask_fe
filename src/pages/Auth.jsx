import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import { Navigate } from "react-router-dom";

export default function Auth({ setIsLoggedIn }) {
  const [isLogin, setIsLogin] = useState(true);
  const token = localStorage.getItem("token");
  if (token) return <Navigate to="/dashboard" />;
  return (
    <div className="flex justify-center items-center h-full">
      <div className="relative w-full max-w-2xl h-[500px] overflow-hidden">
        <div
          className={`flex w-[200%] h-full transition-transform duration-500 ease-in-out`}
          style={{ transform: isLogin ? "translateX(0)" : "translateX(-50%)" }}
        >
          <div className="w-1/2 px-4">
            <Login
              setIsLoggedIn={setIsLoggedIn}
              onSwitch={() => setIsLogin(false)}
            />
          </div>
          <div className="w-1/2 px-4">
            <Register onSwitch={() => setIsLogin(true)} />
          </div>
        </div>
      </div>
    </div>
  );
}
