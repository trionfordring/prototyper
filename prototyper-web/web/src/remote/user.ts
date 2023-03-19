import { mutate } from 'swr';

import { fetcher, setAuthorization } from './fetcher';
import { useRemote } from './useRemote';

import { Me, Role, User, UserWithToken } from '@/types/user';
import { fragment } from '@/utils/fragments';
import { graphql } from '@/utils/graphql';
import { ID } from '@/types/api';
import { HOST } from '@/env';
import { responseFragment } from './fragments';

const FragmentMeRole = fragment`
fragment MeRole on UsersPermissionsMeRole {
  id
  name
  description
  type
}
`;

const FragmentMe = fragment`
fragment Me on UsersPermissionsMe {
  id
  username
  email
  confirmed
  blocked
  role {
    ...${FragmentMeRole}
  }
}
`;

const RegisterDocument = graphql<{
  register: UserWithToken;
}>()`
mutation Register($username: String!, $email: String!, $password: String!) {
  register(input:{
    username: $username
    email: $email
    password: $password
  }){
    jwt
    user {
      ...${FragmentMe}
    }
  }
}
`;

const LoginDoucument = graphql<{
  login: UserWithToken;
}>()`
mutation Login($identifier: String!, $password: String!, $provider: String) {
  login(input: {
    identifier: $identifier
    password: $password
    provider: $provider
  }) {
    jwt
    user {
      ...${FragmentMe}
    }
  }
}
`;

const MeDocument = graphql<{
  me: Me;
}>()`
query Me{
  me {
    ...${FragmentMe}
  }
}
`;
const FragmentRoleEntity = fragment`
fragment MeRole on UsersPermissionsRoleEntityResponse {
  data {
    id
    attributes {
      name
      description
      type
      createdAt
      updatedAt
    }
  }
}
`;

export const FragmentSimpleUser = fragment`
fragment simpleUser on UsersPermissionsUser {
  username
  email
}
`;

export const FragmentSimpleUserEntity = responseFragment(
  'UsersPermissionsUser',
  FragmentSimpleUser
);

export const FragmentUser = fragment`
fragment user on UsersPermissionsUser {
  ...${FragmentSimpleUser}
  role {
    ...${FragmentRoleEntity}
  }
}
`;

const UserByIdDocument = graphql<{
  usersPermissionsUser: {
    data: {
      id: ID;
      attributes: Omit<User, 'role' | 'id'> & {
        role: {
          data: {
            id: ID;
            attributes: Omit<Role, 'id'>;
          };
        };
      };
    };
  };
}>()`
query User($id: ID!) {
  usersPermissionsUser(id: $id) {
    data {
      id
      attributes {
        ...${FragmentUser}
      }
    }
  }
}
`;

export function useUserById(id?: string) {
  const { data: userData, ...other } = useRemote(
    id
      ? [
          UserByIdDocument,
          {
            id,
          },
        ]
      : null
  );
  let user: User | undefined;
  if (userData) {
    const {
      usersPermissionsUser: {
        data: {
          id: userId,
          attributes: {
            role: {
              data: { id: roleId, attributes: roleInfo },
            },
            ...userInfo
          },
        },
      },
    } = userData;
    user = {
      id: userId,
      ...userInfo,
      role: {
        id: roleId,
        ...roleInfo,
      },
    };
  }
  return {
    ...other,
    user,
  };
}

export async function register(params: {
  username: string;
  email: string;
  password: string;
}): Promise<User> {
  try {
    const {
      register: { jwt, user },
    } = await fetcher([RegisterDocument, params]);
    setAuthorization(jwt);
    await mutate(MeDocument, user);
    return user;
  } catch (e) {
    setAuthorization();
    throw e;
  }
}

export async function login(params: {
  identifier: string;
  password: string;
  provider?: string;
}) {
  try {
    const {
      login: { jwt, user },
    } = await fetcher([LoginDoucument, params]);
    setAuthorization(jwt);
    await mutate(MeDocument, user);
    return user;
  } catch (e) {
    setAuthorization();
    throw e;
  }
}

export async function oauthLogin(params: {
  provider: string;
  accessToken: string;
}) {
  const response = await fetch(
    `${HOST}/api/auth/${
      params.provider
    }/callback?access_token=${encodeURIComponent(params.accessToken)}`
  );
  const data = await response.json();
  console.log('oauth登录', data);
}

export function useMe() {
  const { data, ...other } = useRemote(MeDocument);
  let hasLoggedin = Boolean(data || other.error);

  return {
    ...other,
    me: data?.me,
    hasLoggedin: hasLoggedin,
    async logout() {
      if (!hasLoggedin) return false;
      setAuthorization();
      await other.mutate(undefined, { revalidate: false });
      console.log('用户已登出');
      return true;
    },
    login,
    register,
  };
}
