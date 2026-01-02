/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsUUID,
  IsIn,
} from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsUUID()
  tenantId?: string;

  @IsOptional()
  @IsIn(['MEMBER', 'ADMIN'])
  role?: 'MEMBER' | 'ADMIN';

  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
