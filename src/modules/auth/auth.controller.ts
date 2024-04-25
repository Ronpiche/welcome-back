import { Controller, Get, Next, Req, Res, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsPublic } from '../../decorators/isPublic';
import { MsalProvider } from './msalProvider';
import { Request, Response } from 'express';

@Controller('authentication-api/api')
export class AuthController {
  constructor(
    private msalProvider: MsalProvider,
    private authService: AuthService,
  ) {}

  @Get('login')
  @IsPublic()
  async login(@Req() request: Request, @Res() res: Response, @Next() next: any) {
    this.msalProvider.login({
      scopes: ['User.Read'],
      redirectUri: process.env.REDIRECT_URI,
      successRedirect: 'https://hub.daveo.fr/',
    })(request, res, next);
  }

  @Post('callback')
  @IsPublic()
  async callback(@Req() req: Request, @Res() res: Response, @Next() next: any) {
    this.msalProvider.handleRedirect()(req, res, next);
  }

  @Get('token')
  @IsPublic()
  async getToken(@Req() req: Request, @Res() res: Response) {
    const _refreshtoken = await this.authService.checkSessionToken(req.cookies);
    res.json({ data: _refreshtoken });
  }

  @Get('test')
  @IsPublic()
  async test(@Res() res: Response) {
    res.json(process.env);
  }
}
