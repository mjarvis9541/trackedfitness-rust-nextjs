"use server";

import { API } from "@/lib/constants";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createFood(formData: FormData) {
  const token = cookies().get("token")?.value;
  const serving = formData.get("serving");
  let data_value;
  let data_measurement;
  switch (serving) {
    case "100g":
      data_value = 100;
      data_measurement = "g";
      break;
    case "1srv":
      data_value = 1;
      data_measurement = "srv";
      break;
    case "100ml":
      data_value = 100;
      data_measurement = "ml";
      break;
  }

  const name = formData.get("name");
  const brand_id = formData.get("brand");
  const energy = Number(formData.get("energy"));
  const fat = formData.get("fat");
  const saturates = formData.get("saturates");
  const carbohydrate = formData.get("carbohydrate");
  const sugars = formData.get("sugars");
  const fibre = formData.get("fibre");
  const protein = formData.get("protein");
  const salt = formData.get("salt");

  const res = await fetch(`${API}/food`, {
    cache: "no-store",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
      brand_id,
      data_value,
      data_measurement,
      energy,
      fat,
      saturates,
      carbohydrate,
      sugars,
      fibre,
      protein,
      salt,
    }),
  });

  if (!res.ok) {
    const errors = await res.json();
    return { errors: errors };
  }
  const data = await res.json();

  revalidatePath("/food/[slug]");
  redirect(`/food/${data.slug}`);
}

export async function updateFood(formData: FormData) {
  const token = cookies().get("token")?.value;
  const serving = formData.get("serving");
  let data_value;
  let data_measurement;
  switch (serving) {
    case "100g":
      data_value = 100;
      data_measurement = "g";
      break;
    case "1srv":
      data_value = 1;
      data_measurement = "srv";
      break;
    case "100ml":
      data_value = 100;
      data_measurement = "ml";
      break;
  }
  const slug = formData.get("slug");
  const name = formData.get("name");
  const brand_id = formData.get("brand");
  const energy = Number(formData.get("energy"));
  const fat = formData.get("fat");
  const saturates = formData.get("saturates");
  const carbohydrate = formData.get("carbohydrate");
  const sugars = formData.get("sugars");
  const fibre = formData.get("fibre");
  const protein = formData.get("protein");
  const salt = formData.get("salt");

  const res = await fetch(`${API}/food/${slug}`, {
    cache: "no-store",
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
      brand_id,
      data_value,
      data_measurement,
      energy,
      fat,
      saturates,
      carbohydrate,
      sugars,
      fibre,
      protein,
      salt,
    }),
  });

  if (!res.ok) {
    const errors = await res.json();
    return { errors: errors };
  }
  const data = await res.json();

  revalidatePath("/food/[slug]");
  redirect(`/food/${data.slug}`);
}
