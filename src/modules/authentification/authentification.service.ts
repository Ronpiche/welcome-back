import { BadRequestException, Injectable } from '@nestjs/common';
import { SignInDto } from './dto/input/signIn.dto';
import { GipService } from '../../services/gip/gip.service';
import { SignupDto } from './dto/input/signup.dto';
import { AuthentificationUserOutputDto } from './dto/output/authentificationUserOutput.dto';

@Injectable()
export class AuthentificationService {
  constructor(private readonly gipService: GipService) {}

  async signIn(signInDto: SignInDto): Promise<AuthentificationUserOutputDto> {
    const { email, password } = signInDto;
    return await this.gipService.signInGIP(email, password);
  }

  async signUp(signUpDto: SignupDto): Promise<void> {
    const { email, password, copy_password } = signUpDto;
    if (copy_password !== password) {
      throw new BadRequestException('These passwords are not the same');
    }
    await this.gipService.signUpGIP(email, password);
  }
}
