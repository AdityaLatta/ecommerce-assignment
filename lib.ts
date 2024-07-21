'use server'

import { cookies } from "next/headers";

export async function setCookie (token:string) {
    cookies().set('token', token);
}

export async function deleteCookie(token:string) {
    cookies().delete(token);
}