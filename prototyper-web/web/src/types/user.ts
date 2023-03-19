import { ID, WithCreatedAndUpdatedAt } from './api';

export interface User extends WithCreatedAndUpdatedAt {
  id: ID;
  username: string;
  email: string;
  provider?: string;
  confirmed?: boolean;
  blocked?: boolean;
  role?: Role;
}

export type SimpleUser = Pick<User, 'id' | 'username' | 'email'>;

export interface Role extends WithCreatedAndUpdatedAt {
  id: ID;
  name: string;
  description?: string;
  type?: string;

  permissions?: Permissions[];
  users?: User[];
}

export interface Permissions extends WithCreatedAndUpdatedAt {
  action: string;
  role?: Role;
}

export interface UserWithToken {
  jwt: string;
  user: User;
}

export type Me = Omit<User, 'provider' | keyof WithCreatedAndUpdatedAt>;
