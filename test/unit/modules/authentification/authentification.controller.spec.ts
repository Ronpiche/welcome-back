import { Test, TestingModule } from '@nestjs/testing';
import { AuthentificationController } from '@modules/authentification/authentification.controller';
import { AuthentificationService } from '@modules/authentification/authentification.service';
import { AuthentificationServiceMock } from '@test/unit/__mocks__/authentification/autentification.service.mock';
import {
  UserCredential,
  signUpMock,
  signInMock,
  userOutputDtoMock,
} from '@test/unit/__mocks__/authentification/authentification.entities.mock';
import { UserOutputDto } from '@modules/authentification/dto/output/userOutput.dto';

describe('AuthentificationController', () => {
  let controller: AuthentificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthentificationController],
      providers: [
        {
          provide: AuthentificationService,
          useClass: AuthentificationServiceMock,
        },
      ],
    }).compile();

    controller = module.get<AuthentificationController>(AuthentificationController);
  });

  describe('authentificationController', () => {
    it('should be return an user from firebase', async () => {
      controller['authentificationService'].signIn = jest.fn().mockResolvedValue(UserCredential);
      const res: UserOutputDto = await controller.signIn(signInMock);
      expect(res).toEqual(userOutputDtoMock);
    });

    it('must return a newly created user from firebase', async () => {
      controller['authentificationService'].signUp = jest.fn().mockResolvedValue(UserCredential);
      const res: UserOutputDto = await controller.signUp(signUpMock);
      expect(res).toEqual(userOutputDtoMock);
    });
  });
});
