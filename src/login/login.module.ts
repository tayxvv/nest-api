import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
@Module({
  controllers: [LoginController],
  providers: [LoginService],
  imports: [PrismaModule, AuthModule],
})
export class LoginModule {}
