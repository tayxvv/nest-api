import { Body, Controller, Post, UseGuards, Get } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
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
}
