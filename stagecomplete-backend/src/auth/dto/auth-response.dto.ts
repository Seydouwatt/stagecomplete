import { Role } from '@prisma/client';

export class ProfileDto {
  id: string;
  name: string;
  bio?: string;
  avatar?: string;
  location?: string;
  website?: string;
  socialLinks?: any;
  createdAt: Date;
  updatedAt: Date;
}

export class UserDto {
  id: string;
  email: string;
  role: Role;
  profile?: ProfileDto;
  createdAt: Date;
  updatedAt: Date;
}

export class AuthResponseDto {
  access_token: string;
  user: UserDto;
  message?: string;
}

export class AuthErrorDto {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
}
