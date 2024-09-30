import { SignInDto } from "@modules/authentification/dto/input/signIn.dto";
import { SignupDto } from "@modules/authentification/dto/input/signup.dto";
import { AuthentificationUserOutputDto } from "@modules/authentification/dto/output/authentificationUserOutput.dto";
import { BadRequestException, Injectable } from "@nestjs/common";
import { GipService } from "@src/services/gip/gip.service";

@Injectable()
export class AuthentificationService {
  constructor(private readonly gipService: GipService) {}

  async signIn(signInDto: SignInDto): Promise<AuthentificationUserOutputDto> {
    const { email, password } = signInDto;

    return this.gipService.signInGIP(email, password);
  }

  async signUp(signUpDto: SignupDto): Promise<void> {
    const { email, password, copy_password } = signUpDto;
    if (copy_password !== password) {
      throw new BadRequestException("These passwords are not the same");
    }
    await this.gipService.signUpGIP(email, password);
  }
}