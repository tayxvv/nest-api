/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET') || 'dev_secret';
    const cleanSecret = secret.replace(/^["']|["']$/g, '');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: cleanSecret,
    });
  }

  validate(payload: any) {
    if (!payload?.sub) throw new UnauthorizedException();

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
