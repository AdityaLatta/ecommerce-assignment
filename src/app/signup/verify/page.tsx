import React from 'react'
import Verify from '~/app/_components/Verify'
import { redirect } from 'next/navigation'
import { api } from '~/trpc/server'


export default async function page() {

    const user = await api.user.getUser();

    if (user?.isVerified) {
        redirect('/')
    }

    return (
        <div className='flex justify-center'>
            <div className='w-[1440px] h-[945px] bg-white'>
                <Verify/>
            </div>
        </div>
    )
}