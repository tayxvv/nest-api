import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    if (dto.role === 'ORG_ADMIN') {
      const tenant = await this.prisma.organizations.findUnique({
        where: {
          id: dto.tenantId,
        },
      });
      if (!tenant) {
        throw new BadRequestException('Organization not found.');
      }
      dto.tenantId = tenant.id;
    }
    const password_hash = await bcrypt.hash(dto.password, 10);

    try {
      const user = await this.prisma.users.create({
        data: {
          tenant_id: dto.tenantId ?? null,
          role: dto.role ?? 'MEMBER',
          name: dto.name,
          email: dto.email,
          password_hash,
        },
        select: {
          id: true,
          tenant_id: true,
          role: true,
          name: true,
          email: true,
          is_active: true,
          created_at: true,
          updated_at: true,
        },
      });

      return user;
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (err?.code === 'P2002') {
        throw new BadRequestException('E-mail já cadastrado.');
      }
      throw err;
    }
  }

  async findAll() {
    return this.prisma.users.findMany();
  }
}
