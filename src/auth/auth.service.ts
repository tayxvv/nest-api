import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}

  async login(user: {
    id: string;
    email: string;
    role: string;
    tenantId: string | null;
  }) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    };

    const access_token = await this.jwt.signAsync(payload);

    return { access_token };
  }
}
