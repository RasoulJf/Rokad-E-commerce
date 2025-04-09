import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

const Address = () => {
  const navigate = useNavigate();

  return (
    <div>
  
      <Outlet />
    </div>
  );
};

export default Address;
