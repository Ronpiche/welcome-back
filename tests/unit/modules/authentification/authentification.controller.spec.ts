import { Test, TestingModule } from '@nestjs/testing';
import { AuthentificationController } from '@modules/authentification/authentification.controller';
import { AuthentificationService } from '@modules/authentification/authentification.service';
import { AuthentificationServiceMock } from '@tests/unit/__mocks__/authentification/autentification.service.mock';
import {
  signUpMock,
  signInMock,
  authentificationUserOutput,
} from '@tests/unit/__mocks__/authentification/authentification.entities.mock';
import { AuthentificationUserOutputDto } from '@src/modules/authentification/dto/output/authentificationUserOutput.dto';

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
      controller['authentificationService'].signIn = jest.fn().mockResolvedValue(authentificationUserOutput);
      const res: AuthentificationUserOutputDto = await controller.signIn(signInMock);
      expect(res).toEqual(authentificationUserOutput);
    });

    it('must return a newly created user from firebase', async () => {
      controller['authentificationService'].signUp = jest.fn().mockResolvedValue(undefined);
      const res = await controller.signUp(signUpMock);
      expect(res).toBeUndefined();
    });
  });
});
