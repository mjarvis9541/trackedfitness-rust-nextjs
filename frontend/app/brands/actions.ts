"use server";

import { API } from "@/lib/constants";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createBrand(formData: FormData) {
  const token = cookies().get("token")?.value;
  const name = formData.get("name");

  const res = await fetch(`${API}/brands`, {
    cache: "no-store",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    const errors = await res.json();
    return { errors: errors };
  }
  const data = await res.json();
  revalidatePath("/brands");
  return data;
}

export async function editBrand(formData: FormData) {
  const token = cookies().get("token")?.value;
  const slug = formData.get("slug");
  const name = formData.get("name");

  const res = await fetch(`${API}/brands/${slug}`, {
    cache: "no-store",
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    const errors = await res.json();
    return { errors: errors };
  }
  const data = await res.json();

  revalidatePath("/brands/[slug]");
  redirect(`/brands/${data.slug}`);
}
