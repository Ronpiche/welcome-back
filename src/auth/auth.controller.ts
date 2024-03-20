import { Controller, Get, HttpException, HttpStatus, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtItem } from './jwt';
import { JwtService } from '@nestjs/jwt';
import { IsPublic } from 'src/decorators/isPublic';

@Controller('auth')
export class AuthController {
    private jwtItem: JwtItem;

    constructor(private readonly authService: AuthService,
        private _jwt: JwtService) {
        this.jwtItem = new JwtItem(this._jwt);
    }

    @Get('login')
    async login(@Request() request: any) {
      
    }

    @Get('token')
    async getToken(@Request() request: any) {
        let { role, firstName, lastName, email, exp, picture, sub } = request.decodedToken;
        let payload = { role, firstName, lastName, email, picture };
        const _refreshtoken = await this.jwtItem._generateTokenWithValidity(payload, exp, sub)
        return _refreshtoken;
    }

}
