import Filter from "@/components/Filter";

export default async function FilterWrapper({
  promise,
}: {
  promise: Promise<BrandSelect[]>;
}) {
  const brand = await promise;
  return (
    <Filter
      label="Brand"
      filterParam="brand"
      options={brand?.map((brand: BrandSelect) => ({
        value: brand.slug,
        label: brand.name_with_count,
      }))}
    />
  );
}
