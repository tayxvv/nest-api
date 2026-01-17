import { IsString, MinLength, IsIn } from 'class-validator';

export class CreateInviteDto {
  @IsString()
  @MinLength(5)
  email: string;

  @IsIn(['MEMBER', 'ADMIN', 'ORG_ADMIN'])
  role?: 'MEMBER' | 'ADMIN' | 'ORG_ADMIN' | null | undefined;
}
