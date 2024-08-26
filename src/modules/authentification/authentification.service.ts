import { BadRequestException, Injectable } from '@nestjs/common';
import { SignInDto } from './dto/input/signIn.dto';
import { GipService } from '../../services/gip/gip.service';
import { SignupDto } from './dto/input/signup.dto';
import { UserCredential, User } from 'firebase/auth';

@Injectable()
export class AuthentificationService {
  constructor(private readonly gipService: GipService) {}

  async signIn(signInDto: SignInDto): Promise<User> {
    const { email, password } = signInDto;
    const userCredential: UserCredential = await this.gipService.signInGIP(email, password);
    return userCredential.user;
  }

  async signUp(signUpDto: SignupDto): Promise<User> {
    const { email, password, copy_password } = signUpDto;
    if (copy_password !== password) {
      throw new BadRequestException('These passwords are not the same');
    }
    const userCredential: UserCredential = await this.gipService.signUpGIP(email, password);
    return userCredential.user;
  }
}
