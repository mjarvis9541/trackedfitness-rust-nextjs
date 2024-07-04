type Brand = {
  id: string;
  name: string;
  slug: string;
  food_count: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  created_by_id: string;
  updated_by_id: string;
};

type BrandListResult = {
  count: number;
  results: Brand[];
};

type BrandSelect = {
  id: string;
  slug: string;
  name_with_count: string;
};

type BrandFormDeleteInput = {
  slug: string;
  token?: string;
};

type BrandFormInput = {
  id?: string;
  slug?: string;
  name: string;
};
