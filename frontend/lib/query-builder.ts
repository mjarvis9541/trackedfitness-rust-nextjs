type Props = {
  url: string;
  searchParams: {
    page?: string;
    search?: string;
    brand?: string;
    order?: string;
    size?: string;
  };
};

export default function queryBuilder({ url, searchParams }: Props) {
  let paramCount = 0;
  let params = [`?`];

  if (searchParams.page) {
    if (paramCount >= 1) params.push(`&`);
    paramCount += 1;
    params.push(`page=${searchParams.page}`);
  }
  if (searchParams.search) {
    if (paramCount >= 1) params.push(`&`);
    paramCount += 1;
    params.push(`search=${searchParams.search}`);
  }
  if (searchParams.brand) {
    if (paramCount >= 1) params.push(`&`);
    paramCount += 1;
    params.push(`brand=${searchParams.brand}`);
  }
  if (searchParams.order) {
    if (paramCount >= 1) params.push(`&`);
    paramCount += 1;
    params.push(`order=${searchParams.order}`);
  }
  if (searchParams.size) {
    if (paramCount >= 1) params.push(`&`);
    paramCount += 1;
    params.push(`size=${searchParams.size}`);
  }
  if (paramCount >= 1) {
    url += params.join("");
  }

  return url;
}
