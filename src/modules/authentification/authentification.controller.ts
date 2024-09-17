import { Body, ClassSerializerInterceptor, Controller, HttpCode, Post, UseInterceptors } from '@nestjs/common';
import { AuthentificationService } from './authentification.service';
import { SignInDto } from './dto/input/signIn.dto';
import { SignupDto } from './dto/input/signup.dto';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsPublic } from '@src/decorators/isPublic';
import { AuthentificationUserOutputDto } from './dto/output/authentificationUserOutput.dto';

@ApiTags('Authentification')
@Controller('authentification')
export class AuthentificationController {
  constructor(private readonly authentificationService: AuthentificationService) {}

  @Post('signin')
  @IsPublic(true)
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  @ApiOperation({
    summary: 'signin user',
    description: 'return a user from firebase',
  })
  @ApiBody({ type: SignInDto })
  @ApiOkResponse({ type: AuthentificationUserOutputDto, description: 'OK', status: 200 })
  async signIn(@Body() signInDto: SignInDto): Promise<AuthentificationUserOutputDto> {
    return await this.authentificationService.signIn(signInDto);
  }

  @Post('signup')
  @IsPublic(true)
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(201)
  @ApiOperation({
    summary: 'signup user',
  })
  @ApiBody({ type: SignupDto })
  @ApiOkResponse({ description: 'Created', status: 201 })
  async signUp(@Body() signUpDto: SignupDto): Promise<void> {
    await this.authentificationService.signUp(signUpDto);
  }
}
