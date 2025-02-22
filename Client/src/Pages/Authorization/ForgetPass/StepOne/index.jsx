import React, { useState } from "react";
import fetchData from "../../../../Utils/fetchData";
import notify from "../../../../Utils/notify";

export default function ForgetPassStepOne() {
  const [phoneNumber, setPhoneNumber] = useState();
  const handleSubmit = async () => {
    if (!phoneNumber) {
      return notify("please enter your phone number", "error");
    }
    const res = await fetchData("auth/resend", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ phoneNumber }),
    });
    if (res.success) {
      notify(res.message, "success");
    } else {
      notify(res.message, "error");
    }
  };
  return <div></div>;
}