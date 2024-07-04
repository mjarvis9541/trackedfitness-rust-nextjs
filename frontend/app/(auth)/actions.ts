"use server";

import { API } from "@/lib/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function serverRedirect(url: string) {
  redirect(url);
}

export async function login(formData: FormData) {
  const username = formData.get("username");
  const password = formData.get("password");

  const res = await fetch(`${API}/users/login`, {
    cache: "no-store",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) return { errors: await res.json() };
  const data = await res.json();
  cookies().set({
    name: "token",
    value: data.token,
    httpOnly: true,
    maxAge: 864000,
    sameSite: "strict",
  });
  cookies().set({
    name: "username",
    value: data.username,
    httpOnly: true,
    maxAge: 864000,
    sameSite: "strict",
  });
  return data;
  // redirect(`/users/${data.username}`);
}

export async function logout() {
  cookies().set({
    name: "token",
    value: "",
    httpOnly: true,
    maxAge: 0,
    sameSite: "strict",
  });
  cookies().set({
    name: "username",
    value: "",
    httpOnly: true,
    maxAge: 0,
    sameSite: "strict",
  });
  // revalidatePath("/");
  // redirect(`/login`);
}

export async function passwordReset(formData: FormData) {
  const email = formData.get("email");

  const res = await fetch(`${API}/auth/password-reset`, {
    cache: "no-store",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) return { errors: await res.json() };
  const data = await res.json();
  redirect(`/login`);
}

export async function signup(formData: FormData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const username = formData.get("username");
  const password = formData.get("password");

  const res = await fetch(`${API}/auth/signup`, {
    cache: "no-store",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, username, password }),
  });
  if (!res.ok) return { errors: await res.json() };
  const data = await res.json();
  redirect("/activate");
}

export async function activate(formData: FormData) {
  const token = formData.get("token");

  const res = await fetch(`${API}/auth/activate`, {
    cache: "no-store",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  if (!res.ok) return { errors: await res.json() };
  const data = await res.json();

  cookies().set({
    name: "token",
    value: data.token,
    httpOnly: true,
    maxAge: 864000,
    sameSite: "strict",
  });
  cookies().set({
    name: "username",
    value: data.username,
    httpOnly: true,
    maxAge: 864000,
    sameSite: "strict",
  });

  return data;
}
