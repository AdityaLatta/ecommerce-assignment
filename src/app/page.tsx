import { api, HydrateClient } from "~/trpc/server";
import {  redirect } from "next/navigation";
import { Categories } from "./_components/categories";
import { cookies } from "next/headers";

export default async function Home() {
  const token = cookies().get('token');

  if (!token) redirect('/login');

  return (
    <HydrateClient>
      <div className='flex justify-center'>
            <div className='w-[1440px] h-[945px] bg-white'>
                <Categories/>
            </div>
        </div>
    </HydrateClient>
  );
}
