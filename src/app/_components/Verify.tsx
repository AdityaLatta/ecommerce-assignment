"use client";

import React, { useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { setCookie } from "lib";

export default function Verify() {
  const query = useSearchParams();
  const id = Number(query.get("id"));
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const { data, isLoading } = api.user.getUserEmail.useQuery({ id: id });

  const verifyUser = api.user.verifyUser.useMutation({
    onError: async (error) => {
      setError(error.message);
    },
    onSuccess: async (data) => {
      await setCookie(data);
      router.push("/");
    },
  });

  const otpBoxReference = useRef<(HTMLInputElement | null)[]>(Array.from({ length: 8 }, () => null));


  const [otp, setOtp] = useState<string[]>(new Array(8).fill(""));

  function handleChange(value: string, index: number): void {
    const newArr = [...otp];
    newArr[index] = value;
    setOtp(newArr);

    if (value && index < 8 - 1) {
      otpBoxReference.current[index + 1]?.focus();
    }
  }

  function handleBackspaceAndEnter(e: React.KeyboardEvent<HTMLInputElement>, index: number) {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      otpBoxReference.current[index - 1]?.focus();
      setError(null);
    }
    if (e.key === "Enter" && e.currentTarget.value && index < 8 - 1) {
      otpBoxReference.current[index + 1]?.focus();
    }
  }

  return (
    <div className="relative top-[40px] m-auto h-[453px] w-[576px] rounded-[20px] border border-[#C1C1C1]">
      <div className="relative top-[40px] text-center font-sans text-[32px] font-semibold leading-[38.73px]">
        Verify your email
      </div>
      <p className="relative top-[72px] text-center font-sans text-[16px] font-normal leading-[19.36px]">
        Enter the 8 digit code you have received on
      </p>
      {!isLoading && (
        <span className="relative top-[72px] inline-block w-full text-center font-sans text-[16px] font-medium leading-[19.36px]">
          {data?.email}
        </span>
      )}

      <div className="relative top-[118px] m-auto h-[74px] w-[452px]">
        <span>Code</span>
        <div className="flex justify-between">
          {otp.map((digit, index) => (
            <input
              key={index}
              value={digit}
              maxLength={1}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyUp={(e) => handleBackspaceAndEnter(e, index)}
              ref={(reference) => {
                otpBoxReference.current[index] = reference;
              }}
              className="h-[48px] w-[46px] rounded-md border border-[#C1C1C1] text-center text-2xl"
            />
          ))}
        </div>
      </div>

      {error && (
        <div className="relative top-[140px] inline-block w-full text-center font-sans text-sm font-light leading-[19.36px] text-red-600">
          Wrong Otp
        </div>
      )}

      <div className="relative top-[168px] m-auto h-[56px] w-[456px]">
        <button
          className={`h-full w-full rounded-md bg-black text-white ${
            verifyUser.isPending ? "bg-gray-500" : ""
          }`}
          disabled={verifyUser.isPending}
          onClick={() => {
            verifyUser.mutate({ id, clientOtp: otp.join("") });
          }}
        >
          Verify
        </button>
      </div>
    </div>
  );
}
