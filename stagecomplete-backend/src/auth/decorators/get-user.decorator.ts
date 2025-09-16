import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthenticatedProfile {
  id: string;
  displayName: string | null;
  bio: string | null;
  avatar: string | null;
  location: string | null;
  website: string | null;
  socialLinks: Record<string, string> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: string;
  profile?: AuthenticatedProfile;
}

export const GetUser = createParamDecorator(
  <T extends keyof AuthenticatedUser | undefined>(
    data: T,
    ctx: ExecutionContext,
  ): T extends keyof AuthenticatedUser
    ? AuthenticatedUser[T]
    : AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser;

    return data
      ? (user[data] as T extends keyof AuthenticatedUser
          ? AuthenticatedUser[T]
          : never)
      : (user as T extends keyof AuthenticatedUser
          ? AuthenticatedUser[T]
          : AuthenticatedUser);
  },
);
