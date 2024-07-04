type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
  last_login: string;
  login_count: number;
};

type UserListResult = {
  count: number;
  results: User[];
};

type UserFormInput = {
  name: string;
  username: string;
  password: string;
  email: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
};
