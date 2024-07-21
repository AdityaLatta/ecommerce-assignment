'use client';

import { api } from "~/trpc/react"
import { Checkbox } from "./checkBox";
import { useState, useEffect } from "react";

export function Categories () {

    interface Category {
        id: number;
        category: string;
      }

    const [currentPage, setCurrentPage] = useState(1);    
    const [list, setList] = useState<Category[]>([]);

    const {data, isLoading} = api.user.getUser.useQuery();
    

    const getList = api.user.getCategories.useMutation({
        onSuccess: (data) => {
            setList(data)
        }
    });

    const [arr, setArr] = useState<number[]>([]);     
    
    const userCats = api.user.getUserCategories.useMutation({
        onSuccess: async (data) => {
            setArr(data);
        }
    });

    useEffect(() => {
      if (data) {
        userCats.mutate({
            id: Number(data.id)
          })
      }
    }, [data])
    

    useEffect(() => {      
        getList.mutate({
            page: currentPage,
        })
        
    }, [currentPage])    

    return (
        <div className={`${getList.isPending ? "cursor-wait": ''} relative top-[40px] m-auto h-[658px] w-[576px] rounded-[20px] border border-[#C1C1C1]`}>
            <p className="font-sans font-semibold text-[32px] leading-[38.73px] text-center relative top-[40px]">Please mark your interests!</p>
            <p className="font-sans font-normal text-[16px] leading-[26px] text-center relative top-[60px]">We will keep you notified.</p>
            
            <div className="w-full h-[450px] pl-10 relative top-[90px] flex flex-col gap-6">
                <p className="font-sans font-medium text-[20px] leading-[26px]">My saved interests!</p>

                {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center">
                        <p className="text-2xl font-semibold">Loading...</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {list.map((item) => (
                            <Checkbox
                                key={item.id}
                                id={item.id}
                                category={item.category}
                                user={!isLoading && data!} 
                                checked={arr.includes(item.id)}
                            />
                        ))}
                    </div>
                )}
               

                <div className="w-[293px] h-[26px] mt-9 text-[#ACACAC] text-xl font-medium flex justify-between items-center">
                    <button onClick={() => setCurrentPage(1)}>&lt;&lt;</button>
                    <button className="cursor-pointer" disabled={currentPage <= 1 || getList.isPending} onClick={() => setCurrentPage(currentPage - 1)}>&lt;</button>

                    <button onClick={() => setCurrentPage(currentPage - 3)} hidden={currentPage-3 < 1}>{currentPage - 3}</button>
                    <button onClick={() => setCurrentPage(currentPage - 2)} hidden={currentPage-2 < 1}>{currentPage - 2}</button>
                    <button onClick={() => setCurrentPage(currentPage - 1)} hidden={currentPage-1 < 1}>{currentPage - 1}</button>
                    <button className="text-black">{currentPage}</button>
                    <button hidden={currentPage == 17} onClick={() => setCurrentPage(currentPage + 1)}>{currentPage + 1}</button>
                    <button hidden={currentPage == 17} onClick={() => setCurrentPage(currentPage + 2)}>{currentPage + 2}</button>
                    <button hidden={currentPage == 17} onClick={() => setCurrentPage(currentPage + 3)}>{currentPage + 3}</button>

                    <button hidden={currentPage == 17} onClick={() => setCurrentPage(currentPage + 1)} disabled={getList.isPending} >&gt;</button>
                    <button hidden={currentPage == 17} onClick={() => setCurrentPage(17)}>&gt;&gt;</button>
                </div>
            </div>
        </div>
    )
}