"use client";

import React from "react";
import { useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";

export default function Verify () {

  const query = useSearchParams();
  const id = Number(query.get("id"));

  const {data} = api.user.getOtp.useQuery({id});

  const otpBoxReference = useRef<(HTMLInputElement | null)[]>(Array(8).fill(''));

  const [otp, setOtp] = useState(new Array(8).fill(''));

  function handleChange(value: string, index: number): void {
    let newArr = [...otp];
    newArr[index] = value;
    setOtp(newArr);

    if (value && index < 8-1) {
      otpBoxReference.current[index + 1]?.focus();
    }
  }

  function handleBackspaceAndEnter (e: React.KeyboardEvent<HTMLInputElement>, index: number) {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
        otpBoxReference.current[index - 1]?.focus();
    }
    if (e.key === "Enter" && e.currentTarget.value && index < 8 - 1) {
        otpBoxReference.current[index + 1]?.focus();
    }
};

  return (
    <div className="relative top-[40px] m-auto h-[453px] w-[576px] rounded-[20px] border border-[#C1C1C1]">
        <div className="font-sans font-semibold text-[32px] leading-[38.73px] relative top-[40px] text-center">Verify your email</div>
        <p className="font-sans font-normal text-[16px] leading-[19.36px] relative top-[72px] text-center">Enter the 8 digit code you have received on</p>
        <span className="font-sans font-medium text-[16px] leading-[19.36px] inline-block w-full relative top-[72px] text-center">{data?.email || "swa***@gmail.com"}</span>

        <div className="w-[452px] h-[74px] relative top-[118px] m-auto">
            <span>Code</span>
            <div className="flex justify-between">
                {otp.map((digit, index) => (
                  <input 
                    key={index}
                    value={digit}
                    maxLength={1}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyUp={(e) => handleBackspaceAndEnter(e, index)}
                    ref={(reference) => { otpBoxReference.current[index] = reference; }}
                    className="border border-[#C1C1C1] w-[46px] h-[48px] rounded-md text-2xl text-center"></input>
                ))}
            </div>
        </div>

        {otp.length === 8 && otp.join("") === data?.otp && <div className="font-sans font-light text-sm leading-[19.36px] inline-block w-full relative top-[140px] text-center text-red-600">Wrong Otp</div>}

        <div className="w-[456px] h-[56px] relative top-[168px] m-auto">
            <button className="w-full h-full bg-black text-white rounded-md" onClick={() => console.log(otp.join(""), data?.otp)}>Verify</button>
        </div>
    </div>
  );
}
