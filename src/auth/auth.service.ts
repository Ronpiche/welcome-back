import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) {}

    signIn(payload: Object, options: JwtSignOptions): string {
        return this.jwtService.sign(payload, {
            algorithm: 'RS256',
            issuer: 'hubAuth',
            ...options
        });
    }
}