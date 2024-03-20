import { JwtService } from '@nestjs/jwt';

export class JwtItem {
    constructor(private readonly jwtService: JwtService) { }

    // for generate token it will take secret and time from app.module that 
    // that we have imported in imports JwtModule.register
    async _generateTokenGlobal(payload: any): Promise<string> {
        return this.jwtService.signAsync(payload);
    }

    // for generate token with specific expiry time
    async _generateTokenWithValidity(
        payload: any,
        expiresIn: string | number,
        subject?: string
    ): Promise<string> {
        return this.jwtService.signAsync(payload, {
            algorithm: 'RS256',
            issuer: 'hubAuth',
            expiresIn,
            subject: subject ? subject : null
        });
    }

    // verify token
    async _verifyToken(token: string): Promise<any> {
        try {
            return await this.jwtService.verify(token);
        } catch (error) {
            return null;
        }
    }
}