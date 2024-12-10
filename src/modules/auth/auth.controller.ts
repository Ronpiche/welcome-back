import { AuthService } from "@modules/auth/auth.service";
import { BadRequestException, Body, Controller, Get, HttpRedirectResponse, HttpStatus, Post, Redirect, Session } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { IsPublic } from "@src/decorators/isPublic";
import { TokenSet } from "openid-client";

@ApiTags("Auth")
@Controller("auth")
@ApiBearerAuth()
export class AuthController {
  public constructor(private readonly authService: AuthService) { }

  @Get("login")
  @IsPublic(true)
  @ApiOperation({ summary: "Login", description: "Redirect to login url" })
  @Redirect()
  public async login(@Session() session: Record<string, unknown>): Promise<HttpRedirectResponse> {
    const { authorizationUrl, nonce, state } = await this.authService.getAuthorizationUrl();
    Object.assign(session, { oidcNonce: nonce, oidcState: state });

    return { url: authorizationUrl, statusCode: HttpStatus.TEMPORARY_REDIRECT };
  }

  @Post("callback")
  @IsPublic(true)
  @ApiOperation({ summary: "Callback", description: "Return tokens" })
  public async callback(@Body() body: { code: string; state?: string }, @Session() session: Record<string, unknown>): Promise<TokenSet> {
    if (typeof session.oidcNonce !== "string" || session.oidcState !== body.state) {
      throw new BadRequestException();
    }
    return this.authService.handleCallback(body.code, session.oidcNonce, session.oidcState);
  }

  @Post("refresh")
  @IsPublic(true)
  @ApiOperation({ summary: "Refresh", description: "Refresh tokens" })
  public async refresh(@Body() body: { token: string }): Promise<TokenSet> {
    return this.authService.refresh(body.token);
  }
}