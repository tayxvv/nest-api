import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrganizationDto) {
    const organization = await this.prisma.organizations.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        status: dto.status ?? true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        created_at: true,
        updated_at: true,
      },
    });

    return organization;
  }
}
