import { Test, TestingModule } from '@nestjs/testing';
import { GipService } from '@src/services/gip/gip.service';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, Logger, UnauthorizedException } from '@nestjs/common';
import { firebaseAuth, firebaseApp } from '@test/unit/__mocks__/firebase.mock';
import { UserCredential } from '@test/unit/__mocks__/authentification/authentification.entities.mock';

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: () => firebaseAuth.signInWithEmailAndPassword(),
  createUserWithEmailAndPassword: () => firebaseAuth.createUserWithEmailAndPassword(),
  getAuth: () => firebaseAuth.getAuth(),
}));

jest.mock('firebase/app', () => ({
  initializeApp: () => firebaseApp.initializeApp(),
}));

describe('GipService', () => {
  let service: GipService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GipService,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => {
              if (['API_KEY', 'AUTH_DOMAIN'].includes(key)) {
                return 'api-key';
              }
              return null;
            },
          },
        },
        Logger,
      ],
    }).compile();

    service = module.get<GipService>(GipService);
  });
  describe('signinGIP', () => {
    it('testing the properties for initialize firebase app', () => {
      expect(service['firebaseConfig']).toHaveProperty('apiKey', service['configService'].get('API_KEY'));
      expect(service['firebaseConfig']).toHaveProperty('authDomain', service['configService'].get('AUTH_DOMAIN'));
      expect(service['firebaseConfig']).not.toStrictEqual({});
      expect(service['firebaseConfig']).toStrictEqual({
        apiKey: service['configService'].get('API_KEY'),
        authDomain: service['configService'].get('AUTH_DOMAIN'),
      });
    });

    it('should be return an user credential from firebase', async () => {
      const email = 'test@test.fr';
      const password = 'Azerty@123';
      service['auth'].authStateReady = jest.fn().mockResolvedValue(undefined);
      const user = await service.signInGIP(email, password);
      expect(user).toEqual(UserCredential);
    });

    it('should be throw an error', async () => {
      const email = 'test@test.fr';
      const password = 'Azerty@123';
      firebaseAuth.signInWithEmailAndPassword = jest
        .fn()
        .mockRejectedValue(new Error('Error signInWithEmailAndPassword'));
      try {
        await service.signInGIP(email, password);
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toEqual('Error signInWithEmailAndPassword');
      }
    });

    it('should be throw an error', async () => {
      const email = 'test@test.fr';
      const password = 'Azerty@123';
      firebaseAuth.signInWithEmailAndPassword = jest.fn().mockRejectedValue(UserCredential);
      service['auth'].authStateReady = jest.fn().mockRejectedValue(new Error('Error authStateReady'));
      try {
        await service.signInGIP(email, password);
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toEqual('Error authStateReady');
      }
    });
  });
  describe('signupGIP', () => {
    it('should be return an user credential from firebase', async () => {
      const email = 'test@test.fr';
      const password = 'Azerty@123';
      service['auth'].authStateReady = jest.fn().mockResolvedValue(undefined);
      const user = await service.signUpGIP(email, password);
      expect(user).toEqual(UserCredential);
    });

    it('should be throw an error', async () => {
      const email = 'test@test.fr';
      const password = 'Azerty@123';
      firebaseAuth.createUserWithEmailAndPassword = jest.fn().mockRejectedValue(new Error('error'));
      try {
        await service.signUpGIP(email, password);
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('error');
      }
    });

    it('should be throw an error', async () => {
      const email = 'test@test.fr';
      const password = 'Azerty@123';
      firebaseAuth.createUserWithEmailAndPassword = jest.fn().mockResolvedValue(UserCredential);
      service['auth'].authStateReady = jest.fn().mockRejectedValue(new Error('Error authStateReady'));
      try {
        await service.signUpGIP(email, password);
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('Error authStateReady');
      }
    });
  });
});
