"use server";

import { API } from "@/lib/constants";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function actionDelete(
  url: string,
  redirectTo: string,
  revalidate: string
) {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/${url}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) return { errors: await res.json() };
  revalidatePath(revalidate);
  redirect(redirectTo);
}

export async function actionDeleteIdRange(
  url: string,
  username: string,
  revalidate: string,
  idRange: string[]
) {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/${url}`, {
    cache: "no-store",
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ username: username, id_range: idRange }),
  });
  if (!res.ok) {
    const errors = await res.json();
    return { errors: errors };
  }
  revalidatePath(revalidate);
}

export async function actionDeleteDateRange(
  url: string,
  username: string,
  revalidate: string,
  dateRange: string[]
) {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/${url}`, {
    cache: "no-store",
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ username: username, date_range: dateRange }),
  });
  if (!res.ok) {
    const errors = await res.json();
    return { errors: errors };
  }
  revalidatePath(revalidate);
}

export async function dietAddMeal({
  date,
  meal_id,
  meal_of_day_id,
  username,
}: any) {
  const token = cookies().get("token")?.value;
  const res = await fetch(`${API}/diet/create-from-meal`, {
    cache: "no-store",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ date, meal_id, meal_of_day_id, username }),
  });
  if (!res.ok) {
    const errors = await res.json();
    return { errors: errors };
  }
  revalidatePath("/users/[username]/diet");
  redirect(`/users/${username}/diet/${date}`);
}

export async function dietAddFood({
  date,
  food_id,
  meal_of_day_id,
  username,
  data_measurement,
  quantity,
}: any) {
  const token = cookies().get("token")?.value;
  if (data_measurement !== "srv") {
    quantity *= 0.01;
  }
  const res = await fetch(`${API}/diet`, {
    cache: "no-store",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ date, food_id, quantity, meal_of_day_id, username }),
  });
  if (!res.ok) {
    const errors = await res.json();
    return { errors: errors };
  }
  revalidatePath("/users/[username]/diet");
  redirect(`/users/${username}/diet/${date}`);
}

export async function createDietFromFood({
  date,
  food_id,
  meal_of_day_id,
  data_measurement,
  quantity,
}: any) {
  const username = cookies().get("username")?.value;
  const token = cookies().get("token")?.value;

  if (data_measurement !== "srv") {
    quantity *= 0.01;
  }
  const res = await fetch(`${API}/diet`, {
    cache: "no-store",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ date, food_id, quantity, meal_of_day_id, username }),
  });
  if (!res.ok) {
    const errors = await res.json();
    return { errors: errors };
  }
  revalidatePath("/users/[username]/diet");
  redirect(`/users/${username}/diet/${date}`);
}

export async function updateDiet(formData: FormData) {
  const username = cookies().get("username")?.value;
  const token = cookies().get("token")?.value;
  const date = formData.get("date");
  const diet_id = formData.get("diet_id");
  const data_measurement = formData.get("data_measurement");
  const meal_of_day_id = formData.get("meal_of_day_id");
  let quantity = Number(formData.get("quantity"));

  if (data_measurement !== "srv") {
    quantity *= 0.01;
  }
  const res = await fetch(`${API}/diet/${diet_id}`, {
    cache: "no-store",
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ date, meal_of_day_id, quantity }),
  });
  if (!res.ok) {
    const errors = await res.json();
    return { errors: errors };
  }
  const data = await res.json();

  revalidatePath("/users/[username]/diet");
  redirect(`/users/${username}/diet/${data.date}`);
}

export async function updateUser(formData: FormData) {
  const token = cookies().get("token")?.value;
  const name = formData.get("name");
  const username = formData.get("username");
  const password = formData.get("password");
  const email = formData.get("email");
  const id = formData.get("id");

  const res = await fetch(`${API}/users/${id}`, {
    cache: "no-store",
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, email, username, password }),
  });
  if (!res.ok) {
    const errors = await res.json();
    return { errors: errors };
  }
  const data = await res.json();
  console.log(data);
  revalidatePath("/users/[username]");
  redirect(`/users/${data.username}`);
}

export async function dietCopyFrom(formData: FormData) {
  const token = cookies().get("token")?.value;
  const from_date = formData.get("from_date");
  const to_date = formData.get("to_date");
  const from_meal = formData.get("from_meal");
  const to_meal = formData.get("to_meal");
  const from_username = formData.get("from_username");
  const to_username = formData.get("to_username");

  const res = await fetch(`${API}/diet/copy-from`, {
    cache: "no-store",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      from_date,
      to_date,
      from_meal,
      to_meal,
      from_username,
      to_username,
    }),
  });
  if (!res.ok) return { errors: await res.json() };

  revalidatePath("/users/[username]/diet");
  redirect(`/users/${to_username}/diet/${to_date}`);
}

export async function updateProgress(formData: FormData) {
  const token = cookies().get("token")?.value;
  const id = formData.get("id");
  const date = formData.get("date");
  const username = formData.get("username");
  const weight_kg = formData.get("weight_kg");
  const energy_burnt = Number(formData.get("energy_burnt"));
  const notes = formData.get("notes");

  const res = await fetch(`${API}/progress/${id}`, {
    cache: "no-store",
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      date,
      username,
      weight_kg,
      energy_burnt,
      notes,
    }),
  });
  if (!res.ok) return { errors: await res.json() };
  const data = await res.json();
  revalidatePath("/users/[username]/progress/[date]");
  redirect(`/users/${username}/progress/${data.date}`);
}

export async function createProgress(formData: FormData) {
  const token = cookies().get("token")?.value;
  const date = formData.get("date");
  const username = formData.get("username");
  const weight_kg = formData.get("weight_kg");
  const energy_burnt = Number(formData.get("energy_burnt"));
  const notes = formData.get("notes");

  const res = await fetch(`${API}/progress`, {
    cache: "no-store",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      date,
      username,
      weight_kg,
      energy_burnt,
      notes,
    }),
  });
  if (!res.ok) return { errors: await res.json() };
  const data = await res.json();
  revalidatePath("/users/[username]/progress/[date]");
  redirect(`/users/${username}/progress/${data.date}`);
}

export async function createMeal(formData: FormData) {
  const token = cookies().get("token")?.value;
  const username = formData.get("username");
  const name = formData.get("name");

  const res = await fetch(`${API}/meals`, {
    cache: "no-store",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ username, name }),
  });
  if (!res.ok) return { errors: await res.json() };
  const data = await res.json();
  revalidatePath("/users/[username]/meals/[id]");
  return;
}

export async function updateMeal(formData: FormData) {
  const token = cookies().get("token")?.value;
  const id = formData.get("id");
  const username = formData.get("username");
  const name = formData.get("name");

  const res = await fetch(`${API}/meals/${id}`, {
    cache: "no-store",
    method: "put",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ username, name }),
  });
  if (!res.ok) return { errors: await res.json() };
  const data = await res.json();
  revalidatePath("/users/[username]/meals/[id]");
  redirect(`/users/${username}/meals/${data.id}`);
}

export async function createMealItemFromFood({
  meal_id,
  food_id,
  data_measurement,
  quantity,
}: any) {
  const username = cookies().get("username")?.value;
  const token = cookies().get("token")?.value;
  if (data_measurement !== "srv") {
    quantity *= 0.01;
  }
  const res = await fetch(`${API}/meal-food`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ meal_id, food_id, quantity, username }),
  });
  if (!res.ok) {
    const errors = await res.json();
    return { errors: errors };
  }
  const data = await res.json();
  revalidatePath("/users/[username]/diet");
  redirect(`/users/${username}/meals/${meal_id}`);
}

export async function mealAddFood(formData: FormData) {
  const token = cookies().get("token")?.value;
  const username = formData.get("username");
  const meal_id = formData.get("mealId");
  const food_id = formData.get("foodId");
  const data_measurement = formData.get("data_measurement");

  let quantity = Number(formData.get("quantity"));
  if (data_measurement !== "srv") {
    quantity *= 0.01;
  }

  const res = await fetch(`${API}/meal-food`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ username, meal_id, food_id, quantity }),
  });
  if (!res.ok) return { errors: await res.json() };
  const data = await res.json();
  revalidatePath("/users/[username]/meals/[id]");
  // redirect(`/users/${username}/meals/${meal_id}`);
}

export async function createDietTarget(formData: FormData) {
  const token = cookies().get("token")?.value;
  const date = formData.get("date");
  const username = formData.get("username");
  const weight = formData.get("weight");
  const protein_per_kg = formData.get("protein_per_kg");
  const carbohydrate_per_kg = formData.get("carbohydrate_per_kg");
  const fat_per_kg = formData.get("fat_per_kg");

  const res = await fetch(`${API}/diet-targets`, {
    cache: "no-store",
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      date,
      username,
      weight,
      protein_per_kg,
      carbohydrate_per_kg,
      fat_per_kg,
    }),
  });
  if (!res.ok) return { errors: await res.json() };
  const data = await res.json();
  revalidatePath("/users/[username]/diet-target");
  redirect(`/users/${username}/diet-targets/${data.date}`);
}

export async function updateDietTarget(formData: FormData) {
  const token = cookies().get("token")?.value;
  const id = formData.get("id");
  const date = formData.get("date");
  const username = formData.get("username");
  const weight = formData.get("weight");
  const protein_per_kg = formData.get("protein_per_kg");
  const carbohydrate_per_kg = formData.get("carbohydrate_per_kg");
  const fat_per_kg = formData.get("fat_per_kg");

  const res = await fetch(`${API}/diet-targets/${id}`, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      date,
      username,
      weight,
      protein_per_kg,
      carbohydrate_per_kg,
      fat_per_kg,
    }),
  });
  if (!res.ok) return { errors: await res.json() };
  const data = await res.json();
  revalidatePath("/users/[username]/diet-targets");
  redirect(`/users/${username}`);
}

export async function updateMealFood(formData: FormData) {
  const token = cookies().get("token")?.value;
  const id = formData.get("id");
  const username = formData.get("username");
  const meal_id = formData.get("meal_id");
  const food_id = formData.get("food_id");
  const data_measurement = formData.get("data_measurement");

  let quantity = Number(formData.get("quantity"));
  if (data_measurement !== "srv") {
    quantity *= 0.01;
  }

  const res = await fetch(`${API}/meal-food/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      username,
      meal_id,
      food_id,
      quantity,
    }),
  });
  if (!res.ok) return { errors: await res.json() };
  const data = await res.json();
  revalidatePath("/users/[username]/meals/[id]/[itemId]");
  redirect(`/users/${username}/meals/${data.meal_id}`);
}

export async function updateProfile(formData: FormData) {
  const token = cookies().get("token")?.value;
  const username = formData.get("username");
  const sex = formData.get("sex");
  const fitness_goal = formData.get("fitness_goal");
  const activity_level = formData.get("activity_level");
  const height = formData.get("height");
  const weight = formData.get("weight");
  const date_of_birth = formData.get("date_of_birth");

  const res = await fetch(`${API}/profiles/${username}`, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      username,
      sex,
      fitness_goal,
      activity_level,
      height,
      weight,
      date_of_birth,
    }),
  });
  if (!res.ok) return { errors: await res.json() };
  const data = await res.json();
  revalidatePath("/users/[username]");
  redirect(`/users/${username}`);
}

export async function createProfile(formData: FormData) {
  const token = cookies().get("token")?.value;
  const username = formData.get("username");
  const sex = formData.get("sex");
  const fitness_goal = formData.get("fitness_goal");
  const activity_level = formData.get("activity_level");
  const height = formData.get("height");
  const weight = formData.get("weight");
  const date_of_birth = formData.get("date_of_birth");

  const res = await fetch(`${API}/profiles`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      username,
      sex,
      fitness_goal,
      activity_level,
      height,
      weight,
      date_of_birth,
    }),
  });
  if (!res.ok) return { errors: await res.json() };
  const data = await res.json();
  revalidatePath("/users/[username]");
  redirect(`/users/${username}`);
}
