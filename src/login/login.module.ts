import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  controllers: [LoginController],
  providers: [LoginService],
  imports: [PrismaModule],
})
export class LoginModule {}
