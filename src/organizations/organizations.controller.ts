import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { CreateInviteDto } from './dto/create-invite.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../users/user.decorator';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() dto: CreateOrganizationDto) {
    return this.organizationsService.create(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(
    @User() user: { id: string; email: string; role: string; tenantId: string },
  ) {
    return this.organizationsService.findAll(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':org_id/invites')
  createInvite(
    @Param('org_id', new ParseUUIDPipe()) orgId: string,
    @Body() dto: CreateInviteDto,
    @User() user: { id: string; email: string; role: string; tenantId: string },
  ) {
    return this.organizationsService.createInvite(orgId, dto, user);
  }
}
