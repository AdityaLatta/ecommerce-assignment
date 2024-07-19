"use client";

import { api } from "~/trpc/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const createUser = api.user.create.useMutation({
    onSuccess: async (data) => {
      setName('');
      setEmail('');
      setPassword('');
      router.push(`/signup/verify?id=${data.id}`);
    }
  });

  return (
    <div className="relative top-[40px] m-auto h-[691px] w-[576px] rounded-[20px] border border-[#C1C1C1]">

      <form onSubmit={(e) => {
        e.preventDefault();

        if (name === "" || email === "" || password === "") return;

        createUser.mutate({
            name,
            email,
            password
        })

      }}>
        <div className="relative top-[40px] text-center font-sans text-[32px] font-semibold leading-[38.73px]">
          Create your account
        </div>

        <div className="relative top-[72px] mx-auto flex h-[74px] w-[456px] flex-col justify-between">
          <label htmlFor="name" className="text-[16px] font-normal leading-[19.36px]">Name</label>
          <input
            type="text"
            className="h-12 w-full rounded-md border border-[#C1C1C1] p-4"
            id="name"
            placeholder="Enter"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="relative top-[104px] mx-auto flex h-[74px] w-[456px] flex-col justify-between">
          <label htmlFor="email" className="text-[16px] font-normal leading-[19.36px]">Email</label>
          <input
            type="email"
            className="h-12 w-full rounded-md border border-[#C1C1C1] p-4"
            id="email"
            placeholder="Enter"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="relative top-[136px] mx-auto flex h-[74px] w-[456px] flex-col justify-between">
          <label htmlFor="pass" className="text-[16px] font-normal leading-[19.36px]">
            Password
          </label>
          <input
            type="password"
            className="h-12 w-full rounded-md border border-[#C1C1C1] p-4"
            id="pass"
            placeholder="Enter"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="relative top-[176px] mx-auto flex h-[56px] w-[456px] items-center justify-center rounded-md bg-black text-white"
        >
          CREATE ACCOUNT
        </button>
      </form>

      <div className="relative top-[224px] mx-auto flex h-[19px] w-[456px] items-center justify-center gap-2">
        <span>Have an Account? </span>
        <button className="font-semibold" onClick={() => router.push("/login")}>Login</button>
      </div>
    </div>
  );
}
