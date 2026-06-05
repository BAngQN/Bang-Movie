/**
 * Because the `cookies` API is only available in server components, we need to create a separate file for cookie management.
 * I call this file `cookies.ts` and use it in both the `AuthInitializer` component, and it is client component,
 * so we need to use a server action to set the cookie from the client component.
 */

"use server";
import { cookies } from "next/headers";

export async function getCookie(name: string): Promise<string | null> {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(name);
    return cookie ? cookie.value : null;
}

export async function setCookies(name: string, value: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set({
        name: name,
        value: value,
        path: "/",
        sameSite: "lax",
    });
}

export async function deleteCookie(name: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(name);
}
