import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { CreateInviteDto } from './dto/create-invite.dto';
import { randomBytes, createHmac } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
@Injectable()
export class OrganizationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

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

  async findAll(user: {
    id: string;
    email: string;
    role: string;
    tenantId: string;
  }) {
    if (user.role === 'ADMIN') {
      return this.prisma.organizations.findMany();
    }
    if (user.tenantId) {
      return this.prisma.organizations.findMany({
        where: {
          id: user.tenantId,
        },
      });
    }

    return [];
  }

  async createInvite(
    orgId: string,
    dto: CreateInviteDto,
    user: { id: string; email: string; role: string; tenantId: string },
  ) {
    const organization = await this.prisma.organizations.findUnique({
      where: {
        id: orgId,
      },
    });

    if (!organization) {
      throw new BadRequestException('Organization not found.');
    }

    const { token, tokenHash } = this.generateInviteToken();

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

    const appUrl =
      this.configService.get<string>('APP_URL') || 'http://localhost:3000';
    const inviteUrl = `${appUrl}/invites/accept?token=${token}`;

    const previewUrl = await this.mailService.sendInviteEmail({
      to: dto.email,
      orgName: organization.name,
      inviteUrl,
    });

    await this.prisma.organization_invites.create({
      data: {
        email: dto.email,
        role: dto.role ?? 'MEMBER',
        org_id: orgId,
        created_by: user.id,
        token_hash: tokenHash,
        expired_at: expiresAt,
        status: 'PENDING',
      },
    });

    return previewUrl;
  }

  generateInviteToken() {
    const secret = this.configService.get<string>('JWT_SECRET') || 'dev_secret';
    const cleanSecret = secret.replace(/^["']|["']$/g, '');
    const token = randomBytes(32).toString('hex');

    const tokenHash = createHmac('sha256', cleanSecret)
      .update(token)
      .digest('hex');

    return { token, tokenHash };
  }
}
