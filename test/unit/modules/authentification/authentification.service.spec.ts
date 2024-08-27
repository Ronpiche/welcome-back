import { Test, TestingModule } from '@nestjs/testing';
import { AuthentificationService } from '@modules/authentification/authentification.service';
import { GipService } from '@src/services/gip/gip.service';
import { GipServiceMock } from '@test/unit/__mocks__/gip.service.mock';
import {
  UserCredential,
  signInMock,
  signUpMock,
} from '@test/unit/__mocks__/authentification/authentification.entities.mock';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('AuthentificationService', () => {
  let service: AuthentificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthentificationService, { provide: GipService, useClass: GipServiceMock }],
    }).compile();

    service = module.get<AuthentificationService>(AuthentificationService);
  });

  describe('signinService', () => {
    it('should return an user credential from firebase', async () => {
      service['gipService'].signInGIP = jest.fn().mockResolvedValue({ user: UserCredential });
      const user = await service.signIn(signInMock);
      expect(user).toEqual(UserCredential);
    });

    it('should throw an error, if gipService return an error', async () => {
      service['gipService'].signInGIP = jest.fn().mockRejectedValue(new UnauthorizedException());
      try {
        await service.signIn(signInMock);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });

  describe('signupService', () => {
    it('should return a newly created user from firebase', async () => {
      service['gipService'].signUpGIP = jest.fn().mockResolvedValue({ user: UserCredential });
      const user = await service.signUp(signUpMock);
      expect(user).toEqual(UserCredential);
    });

    it('should throw an error, if gipService return an error', async () => {
      service['gipService'].signUpGIP = jest.fn().mockRejectedValue(new BadRequestException());
      try {
        await service.signUp(signUpMock);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should throw an error, if these password are not the same', async () => {
      service['gipService'].signUpGIP = jest.fn();
      signUpMock.copy_password = 'test@1234';
      try {
        await service.signUp(signUpMock);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('These passwords are not the same');
      }
    });
  });
});
