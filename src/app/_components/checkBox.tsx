'use client';

import { useEffect, useState } from "react";
import { api } from "~/trpc/react";

interface Props {
    id: number,
    category: string,
    user: {
        name: string,
        id: number,
        email: string,
        // isVefified: boolean,
    }
    checked: boolean
}


export function Checkbox (props: Props) {   
    
    const [ischeck, setischeck] = useState<boolean>(false);
    
    const createUserCategory = api.user.createUserCategory.useMutation();
    const deleteUserCategory = api.user.deleteUserCategory.useMutation();

    const handleClick = () => {
        
        if (ischeck) {
            deleteUserCategory.mutate({
                userId: props.user.id,
                categoryId: props.id,
            })
        }else{
            createUserCategory.mutate({
                userId: props.user.id,
                categoryId: props.id,
            })    
        }
    }

    const changeHandler = () => {
        if (ischeck) {
            setischeck(false)
        }else{
            setischeck(true)
        }
    }

    useEffect(() => {
      setischeck(props.checked)
    }, [props.checked])
    

    return (
        <div className="flex items-center gap-2">
            <input 
            checked={ischeck}
            onClick={() => handleClick()}
            onChange={() => changeHandler()}
            type="checkbox" id={String(props.id)}
            className="w-6 h-6 rounded-md border bg-[#CCCCCC] appearance-none checked:appearance-auto checked:accent-black"/>
            <label htmlFor={String(props.id)} className="font-sans font-normal text-xl leading-[26px] select-none" >{props.category}</label>   
        </div>  
    )
}
