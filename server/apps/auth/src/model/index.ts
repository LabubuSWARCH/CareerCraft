export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  username: string;

  email?: string;
  full_name?: string;
  phone?: string;
  address?: string;
  profile_picture?: string;

  created_at?: string;
  updated_at?: string;
  role: UserRole;
}
