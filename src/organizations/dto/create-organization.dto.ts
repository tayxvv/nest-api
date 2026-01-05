import { IsString, MinLength, IsBoolean, IsOptional } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(2)
  slug: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean;
}
