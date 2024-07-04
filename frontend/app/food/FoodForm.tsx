"use client";

import ServerError from "@/components/ServerError";
import ServerFormButton from "@/components/ServerFormButton";
import ServerFormInput from "@/components/ServerFormInput";
import ServerFormSelect from "@/components/ServerFormSelect";
import { servingOptions } from "@/lib/constants";
import { MutableRefObject, useRef, useState } from "react";

export default function FoodForm({
  action,
  brandSelect,
  initial,
}: {
  action: any;
  brandSelect: BrandSelect[];
  initial?: Food;
}) {
  let serving;
  switch (initial?.data_measurement) {
    case "srv":
      serving = "1srv";
      break;
    case "g":
      serving = "100g";
      break;
    case "ml":
      serving = "100ml";
      break;
  }
  const form = useRef() as MutableRefObject<HTMLFormElement>;
  const [error, setError] = useState([]);

  const handleSubmit = async (formData: FormData) => {
    if (initial) formData.append("slug", initial.slug);

    const data = await action(formData);
    if (data?.errors) return setError(data.errors);
    setError([]);
    form.current.reset();
  };

  return (
    <form action={handleSubmit} ref={form}>
      <ServerError error={error} field="detail" />
      <ServerFormInput name="name" error={error} defaultValue={initial?.name} />
      <ServerFormSelect
        name="brand"
        options={brandSelect.map((brand) => ({
          label: brand.name_with_count,
          value: brand.id,
        }))}
        error={error}
        defaultValue={initial?.brand_id}
      />
      <ServerFormSelect
        name="serving"
        options={servingOptions}
        error={error}
        defaultValue={serving}
      />
      <ServerFormInput
        name="energy"
        label="Energy (kcal)"
        defaultValue={initial?.energy}
        error={error}
      />
      <ServerFormInput
        name="fat"
        label="Fat (g)"
        defaultValue={initial?.fat}
        error={error}
      />
      <ServerFormInput
        name="saturates"
        label="Saturates (g)"
        defaultValue={initial?.saturates}
        error={error}
      />
      <ServerFormInput
        name="carbohydrate"
        label="Carbohydrate (g)"
        defaultValue={initial?.carbohydrate}
        error={error}
      />
      <ServerFormInput
        name="sugars"
        label="Sugars (g)"
        defaultValue={initial?.sugars}
        error={error}
      />
      <ServerFormInput
        name="fibre"
        label="Fibre (g)"
        defaultValue={initial?.fibre}
        error={error}
      />
      <ServerFormInput
        name="protein"
        label="Protein (g)"
        defaultValue={initial?.protein}
        error={error}
      />
      <ServerFormInput
        name="salt"
        label="Salt (g)"
        defaultValue={initial?.salt}
        error={error}
      />

      <ServerFormButton />
    </form>
  );
}
