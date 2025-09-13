import { validate } from 'class-validator';
import { RegisterDto } from './register.dto';
import { Role } from '@prisma/client';

describe('RegisterDto', () => {
  it('should pass validation with valid data', async () => {
    const dto = new RegisterDto();
    dto.email = 'test@example.com';
    dto.password = 'Password123!';
    dto.name = 'John Doe';
    dto.role = Role.ARTIST;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation with invalid email', async () => {
    const dto = new RegisterDto();
    dto.email = 'invalid-email';
    dto.password = 'Password123!';
    dto.name = 'John Doe';
    dto.role = Role.ARTIST;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('email');
  });

  it('should fail validation with weak password', async () => {
    const dto = new RegisterDto();
    dto.email = 'test@example.com';
    dto.password = '123'; // Trop court et trop faible
    dto.name = 'John Doe';
    dto.role = Role.ARTIST;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('password');
  });

  it('should fail validation with invalid role', async () => {
    const dto = new RegisterDto();
    dto.email = 'test@example.com';
    dto.password = 'Password123!';
    dto.name = 'John Doe';
    dto.role = 'INVALID_ROLE' as Role;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('role');
  });

  it('should fail validation with empty name', async () => {
    const dto = new RegisterDto();
    dto.email = 'test@example.com';
    dto.password = 'Password123!';
    dto.name = '';
    dto.role = Role.VENUE;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('name');
  });
});
