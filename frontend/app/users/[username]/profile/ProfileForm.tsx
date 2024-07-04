"use client";

import ServerError from "@/components/ServerError";
import ServerFormButton from "@/components/ServerFormButton";
import ServerFormInput from "@/components/ServerFormInput";
import ServerFormSelect from "@/components/ServerFormSelect";
import { activityLevelOptions, goalOptions, sexOptions } from "@/lib/constants";
import { useState } from "react";

export default function ProfileForm({
  action,
  profile,
  username,
}: {
  action: any;
  profile?: Profile;
  username: string;
}) {
  const [error, setError] = useState([]);

  const handleSubmit = async (formData: FormData) => {
    formData.append("username", username);
    const data = await action(formData);
    if (data?.errors) return setError(data.errors);
    setError([]);
  };

  return (
    <form action={handleSubmit}>
      <ServerError error={error} field="detail" />
      <ServerFormSelect
        label="Fitness Goal"
        defaultValue={profile?.fitness_goal}
        error={error}
        options={goalOptions}
        name="fitness_goal"
      />
      <ServerFormSelect
        label="Activity Level"
        defaultValue={profile?.activity_level}
        options={activityLevelOptions}
        error={error}
        name="activity_level"
      />
      <ServerFormSelect
        name="sex"
        options={sexOptions}
        defaultValue={profile?.sex}
        error={error}
      />
      <ServerFormInput
        defaultValue={profile?.height}
        error={error}
        type="number"
        label="Height (cm)"
        name="height"
        step={1}
      />
      <ServerFormInput
        defaultValue={profile?.weight}
        error={error}
        label="Weight (kg)"
        type="number"
        name="weight"
        step={0.01}
      />
      <ServerFormInput
        defaultValue={profile?.date_of_birth}
        error={error}
        type="date"
        label="Date of Birth"
        name="date_of_birth"
      />
      <ServerFormButton />
    </form>
  );
}
