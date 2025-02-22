import React, { useEffect, useState } from "react";
import OtpInput from "./OtpInput";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import fetchData from "../../../Utils/fetchData";
import notify from "../../../Utils/notify";

const CheckOtp = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [timer,setTimer]=useState(120)
  const [isResendDisables,setIsResendDisables]=useState(true)
  const handleOtpComplete =async (code) => {
   const phoneNumber = localStorage.getItem('phoneNumber')
   const newAccount = localStorage.getItem('newAccount')
    const res = await fetchData("auth/otp",{
      method:'POST',
      headers:{
        "Content-Type":"application.json"
      },
      body: JSON.stringify({code,newAccount,phoneNumber})
    })
    if(res.success){
      dispatch(login({user: res?.data?.user , token: res?.data?.token}))
      notify(res.message, "success")
      navigate('/')
    }else{
      notify(res.message, "error")
    }
  };
const handleResendOtp = async() => {
  const phoneNumber = localStorage.getItem('phoneNumber')
  const res = await fetchData('auth/resend',{
    method:'POST',
    headers:{
      "Content-Type":"application.json"
    },
    body: JSON.stringify({phoneNumber})
  })
  if(res.success){
    notify(res.message, "success")
    setTimer(120)
    setIsResendDisables(true)
  }else{
    notify(res.message, "error")
  }
}
 useEffect(() => {
  let interval 
  if(timer > 0){
    interval = setInterval(() => {
      setTimer((prevTimer)=> prevTimer - 1)
    },1000
    )
  }else{
    setIsResendDisables(false)
  }
 },[]
 )

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Enter OTP
        </h2>
        <OtpInput length={6} onComplete={handleOtpComplete} />
        <p className="mt-6 text-center text-sm text-gray-600">
          We've sent a 6-digit code to your phone.
        </p>
        <button
          onClick={() => console.log("Resend OTP")}
          disabled={isResendDisables}
          className={`mt-4 w-full text-center text-sm ${
            isResendDisables? 'text-gray-400 cursor-not-allowed' :
            ''
          } focus:outline-none`}
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
};

export default CheckOtp;
