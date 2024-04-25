import { JwtService } from '@nestjs/jwt';

export class JwtItem {
  constructor(private readonly jwtService: JwtService) {}

  // for generate token with specific expiry time
  async _generateTokenWithValidity(payload: object, options: Record<string, string>): Promise<string> {
    return this.jwtService.signAsync(payload, {
      ...options,
      algorithm: 'RS256',
      issuer: 'hubAuth',
      expiresIn: options.expiresIn ? options.expiresIn : '12h',
    });
  }

  // verify token
  async _verifyToken(token: string): Promise<any> {
    try {
      return await this.jwtService.verify(token, {
        audience: 'sessionToken',
        publicKey: process.env.PB_KEY,
        algorithms: ['RS256'],
      });
    } catch (error) {
      return null;
    }
  }
}
