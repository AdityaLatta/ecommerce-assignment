"use client";

import React from "react";
import { useState } from "react";

import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const loginUser = api.user.login.useMutation({
        onSuccess: async () => {
            setEmail("");
            setPassword("");
            router.push("/");
        }
    });


  return (
    <div className="relative top-[40px] m-auto h-[614px] w-[576px] rounded-[20px] border border-[#C1C1C1]">
      <form onSubmit={(e) => {
        e.preventDefault();

        if (email === "" || password === "") return;

        loginUser.mutate({
            email,
            password
        })
        
      }}>
        <div className="relative top-[40px] text-center font-sans text-[32px] font-semibold leading-[38.73px]">
          Login
        </div>
        <div className="relative top-[75px] text-center font-sans text-2xl font-medium leading-[29.05px]">
          Welcome back to ECOMMERCE
        </div>
        <div className="relative top-[82px] text-center font-sans text-[16px] font-normal leading-[19.36px]">
          The next gen business marketplace
        </div>

        <div className="relative top-[127px] mx-auto flex h-[74px] w-[456px] flex-col justify-between">
          <label
            htmlFor="email"
            className="text-[16px] font-normal leading-[19.36px]"
          >
            Email
          </label>
          <input
            type="email"
            value={email}
            className="h-12 w-full rounded-md border border-[#C1C1C1] p-4"
            id="email"
            placeholder="Enter"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="relative top-[159px] mx-auto flex h-[74px] w-[456px] flex-col justify-between">
          <label
            htmlFor="pass"
            className="text-[16px] font-normal leading-[19.36px]"
          >
            Password
          </label>
          <input
            type="password"
            value={password}
            className="h-12 w-full rounded-md border border-[#C1C1C1] p-4"
            id="pass"
            placeholder="Enter"
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="absolute right-4 top-9 underline">Show</span>
        </div>

        <button type="submit" className="relative top-[191px] mx-auto flex h-[56px] w-[456px] items-center justify-center rounded-md bg-black text-white">
          LOGIN
        </button>
      </form>

      <div className="relative top-[220px] mx-auto h-[1px] w-[456px] bg-[#C1C1C1]"></div>

      <div className="relative top-[251px] mx-auto flex h-[19px] w-[456px] items-center justify-center gap-2">
        <span>Don't have an Account? </span>
        <button className="font-semibold" onClick={() => router.push("/signup")}>SIGN UP</button>
      </div>
    </div>
  );
};

export default Login;
