"use server";

import { API } from "@/lib/constants";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function mealOfDayCreate(formData: FormData) {
  const token = cookies().get("token")?.value;
  const name = formData.get("name");
  const ordering = Number(formData.get("ordering"));

  const res = await fetch(`${API}/meal-of-day`, {
    cache: "no-store",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, ordering }),
  });
  if (!res.ok) {
    const errors = await res.json();
    return { errors: errors };
  }

  const data = await res.json();
  revalidatePath("/meal-of-day/[slug]");
  redirect(`/meal-of-day/${data.slug}`);
}

export async function mealOfDayUpdate(formData: FormData) {
  const token = cookies().get("token")?.value;
  const slug = formData.get("slug");
  const name = formData.get("name");
  const ordering = Number(formData.get("ordering"));

  const res = await fetch(`${API}/meal-of-day/${slug}`, {
    cache: "no-store",
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, ordering }),
  });
  if (!res.ok) {
    const errors = await res.json();
    return { errors: errors };
  }

  const data = await res.json();
  revalidatePath("/meal-of-day/[slug]");
  redirect(`/meal-of-day/${data.slug}`);
}
