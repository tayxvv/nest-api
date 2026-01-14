import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrganizationDto) {
    const slugOrganization = await this.findSlugOrganization(dto.slug);
    if (slugOrganization) {
      throw new BadRequestException('Slug already exists.');
    }
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

  async findSlugOrganization(slug: string) {
    return this.prisma.organizations.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
      },
    });
  }

  async findAll(tenantId: string | null) {
    if (tenantId) {
      return this.prisma.organizations.findMany({
        where: {
          id: tenantId,
        },
      });
    }
    return this.prisma.organizations.findMany();
  }
}
