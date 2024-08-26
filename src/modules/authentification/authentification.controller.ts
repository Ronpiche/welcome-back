import { Body, ClassSerializerInterceptor, Controller, HttpCode, Post, UseInterceptors } from '@nestjs/common';
import { AuthentificationService } from './authentification.service';
import { SignInDto } from './dto/input/signIn.dto';
import { plainToInstance } from 'class-transformer';
import { UserOutputDto } from './dto/output/userOutput.dto';
import { SignupDto } from './dto/input/signup.dto';
import { User } from 'firebase/auth';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsPublic } from '@src/decorators/isPublic';

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
  @ApiOkResponse({ type: UserOutputDto })
  async signIn(@Body() signInDto: SignInDto): Promise<UserOutputDto> {
    const gipUser: User = await this.authentificationService.signIn(signInDto);
    return plainToInstance(UserOutputDto, gipUser, {
      excludeExtraneousValues: true,
    });
  }

  @Post('signup')
  @IsPublic(true)
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(201)
  @ApiOperation({
    summary: 'signup user',
    description: 'return a newly user created from firebase',
  })
  @ApiBody({ type: SignupDto })
  @ApiOkResponse({ type: UserOutputDto })
  async signUp(@Body() signUpDto: SignupDto): Promise<UserOutputDto> {
    const gipUser: User = await this.authentificationService.signUp(signUpDto);
    return plainToInstance(UserOutputDto, gipUser, {
      excludeExtraneousValues: true,
    });
  }
}
