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
  @IsIn(['MEMBER', 'ADMIN', 'ORG_ADMIN'])
  role?: 'MEMBER' | 'ADMIN' | 'ORG_ADMIN' | null | undefined;

  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
