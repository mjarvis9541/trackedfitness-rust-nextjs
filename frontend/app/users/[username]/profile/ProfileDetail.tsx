import { formatShortDate, formatShortDateTime } from "@/lib/format-date";
import { formatISO } from "date-fns";
import Link from "next/link";

export default async function ProfileDetail({
  promise,
  username,
}: {
  promise: Promise<Profile>;
  username: string;
}) {
  const profile = await promise;
  if (!profile)
    return (
      <Link
        href={`/users/${username}/profile/create`}
        className="text-blue-500 hover:underline"
      >
        Create Profile
      </Link>
    );
  return (
    <>
      <table className="w-full border-collapse border">
        <tbody>
          <tr>
            <th className="w-1/2 border p-2 text-left">Fitness Goal</th>
            <td className="w-1/2 border p-2 text-right">
              {profile.fitness_goal}
            </td>
          </tr>
          <tr>
            <th className="border p-2 text-left">Activity Level</th>
            <td className="border p-2 text-right">{profile.activity_level}</td>
          </tr>
          <tr>
            <th className="border p-2 text-left">Sex</th>
            <td className="border p-2 text-right">{profile.sex}</td>
          </tr>
          <tr>
            <th className="border p-2 text-left">Height</th>
            <td className="border p-2 text-right">
              {Number(profile.height).toFixed(0)}cm
            </td>
          </tr>
          <tr>
            <th className="border p-2 text-left">Weight</th>
            <td className="border p-2 text-right">
              {profile.weight ? (
                <>
                  {Number(profile.weight).toFixed(2)}kg <br />
                  <Link
                    href={`/users/${profile.username}/progress/${profile.weight_updated_at}`}
                    className="text-xs text-blue-500 hover:underline"
                  >
                    As of {formatShortDate(profile.weight_updated_at)}
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href={{
                      pathname: `/users/${profile.username}/progress/create`,
                      query: {
                        date: formatISO(new Date(), { representation: "date" }),
                      },
                    }}
                    className="text-sm text-blue-500"
                  >
                    Add weight
                  </Link>
                </>
              )}
            </td>
          </tr>
          <tr>
            <th className="border p-2 text-left">Age</th>
            <td className="border p-2 text-right">{profile.age}</td>
          </tr>
          <tr>
            <th className="border p-2 text-left">Date of Birth</th>
            <td className="border p-2 text-right">
              {formatShortDate(profile.date_of_birth)}
            </td>
          </tr>
          <tr>
            <th className="border p-2 text-left">Body Mass Index (BMI)</th>
            <td className="border p-2 text-right">{profile.bmi}</td>
          </tr>
          <tr>
            <th className="border p-2 text-left">Basal Metabolic Rate (BMR)</th>
            <td className="border p-2 text-right">
              {Number(profile.bmr).toFixed(0)}kcal
            </td>
          </tr>
          <tr>
            <th className="border p-2 text-left">
              Total Daily Energy Expenditure (TDEE)
            </th>
            <td className="border p-2 text-right">
              {Number(profile.tdee).toFixed(0)}kcal
            </td>
          </tr>
          <tr>
            <th className="border p-2 text-left">Target Calories</th>
            <td className="border p-2 text-right">
              {Number(profile.target_calories).toFixed(0)}kcal
            </td>
          </tr>
          <tr>
            <th className="w-1/4 border p-2 text-left">Created at</th>
            <td className="w-3/4 border p-2 text-right">
              {formatShortDateTime(profile.created_at)}
            </td>
          </tr>
          <tr>
            <th className="w-1/4 border p-2 text-left">Updated at</th>
            <td className="w-3/4 border p-2 text-right">
              {profile.updated_at
                ? formatShortDateTime(profile.updated_at)
                : "-"}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="mt-4 flex gap-4">
        <Link
          href={`/users/${username}/profile/edit`}
          className="text-blue-500 hover:underline"
        >
          Edit
        </Link>
        <Link
          href={`/users/${username}/profile/delete`}
          className="text-blue-500 hover:underline"
        >
          Delete
        </Link>
      </div>
    </>
  );
}
