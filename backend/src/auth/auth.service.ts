import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      // Return user without the password field
      return {
        id: user.id_user,
        username: user.username,
        email: user.email,
        role: user.role,
      };
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string | number>(
        'JWT_REFRESH_EXPIRATION_TIME',
      ),
    });
    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: this.configService.get<string | number>(
          'JWT_EXPIRATION_TIME',
        ),
      }),
      refresh_token: refreshToken,
    };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      const newPayload = { email: payload.email, sub: payload.sub };
      return {
        access_token: this.jwtService.sign(newPayload, {
          expiresIn: this.configService.get<string | number>(
            'JWT_EXPIRATION_TIME',
          ),
        }),
      };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
