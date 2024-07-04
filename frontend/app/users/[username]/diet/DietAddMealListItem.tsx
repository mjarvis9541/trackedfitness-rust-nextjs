"use client";

import { dietAddMeal } from "@/app/actions";
import ServerFormButton from "@/components/ServerFormButton";
import Link from "next/link";
import { useState } from "react";

export default function DietAddMealListItem({
  date,
  meal,
  mealOfDay,
  username,
}: {
  date: string;
  meal: Meal;
  mealOfDay: MealOfDay;
  username: string;
}) {
  const [error, setError] = useState([]);
  const handleSubmit = async () => {
    const data = await dietAddMeal({
      date,
      username,
      meal_id: meal.id,
      meal_of_day_id: mealOfDay.id,
    });
    if (data?.errors) return setError(data.errors);
    setError([]);
  };

  return (
    <form className="group contents" action={handleSubmit}>
      <Link
        href={`/users/${username}/meals/${meal.id}`}
        className="col-span-3 flex items-center p-2 group-hover:bg-amber-200"
      >
        {meal.name}
      </Link>
      <div className="flex items-center justify-end p-2 group-hover:bg-amber-200">
        {meal.food_count}
      </div>
      <div className="flex items-center justify-end p-2 group-hover:bg-amber-200">
        {meal.energy}kcal
      </div>
      <div className="flex items-center justify-end p-2 group-hover:bg-amber-200">
        {Number(meal.protein).toFixed(1)}g
      </div>
      <div className="flex items-center justify-end p-2 group-hover:bg-amber-200">
        {Number(meal.carbohydrate).toFixed(1)}g
      </div>
      <div className="flex items-center justify-end p-2 group-hover:bg-amber-200">
        {Number(meal.fat).toFixed(1)}g
      </div>
      <div className="flex items-center justify-end p-2 group-hover:bg-amber-200">
        {Number(meal.saturates).toFixed(1)}g
      </div>
      <div className="flex items-center justify-end p-2 group-hover:bg-amber-200">
        {Number(meal.sugars).toFixed(1)}g
      </div>
      <div className="flex items-center justify-end p-2 group-hover:bg-amber-200">
        {Number(meal.fibre).toFixed(1)}g
      </div>
      <div className="flex items-center justify-end p-2 group-hover:bg-amber-200">
        {Number(meal.salt).toFixed(2)}g
      </div>
      <div className="flex items-center justify-end p-1 group-hover:bg-amber-200">
        <ServerFormButton label="Add" />
      </div>
    </form>
  );
}
