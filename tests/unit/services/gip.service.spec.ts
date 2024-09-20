import { Test, TestingModule } from '@nestjs/testing';
import { GipService } from '@src/services/gip/gip.service';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { firebaseAuth, firebaseApp } from '@tests/unit/__mocks__/firebase.mock';
import {
  authentificationUserOutput,
  GipUserMock,
} from '@tests/unit/__mocks__/authentification/authentification.entities.mock';
import { FirestoreService } from '@src/services/firestore/firestore.service';
import { FirestoreServiceMock } from '@tests/unit/__mocks__/firestore.service';
import { outputWelcomeMock } from '@tests/unit/__mocks__/welcome/User.entity.mock';
import { AuthentificationUserOutputDto } from '@src/modules/authentification/dto/output/authentificationUserOutput.dto';

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
        { provide: FirestoreService, useClass: FirestoreServiceMock },
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
    it('should initialize Firebase configuration correctly', () => {
      expect(service['firebaseConfig']).toHaveProperty('apiKey', service['configService'].get('API_KEY'));
      expect(service['firebaseConfig']).toHaveProperty('authDomain', service['configService'].get('AUTH_DOMAIN'));
      expect(service['firebaseConfig']).not.toStrictEqual({});
      expect(service['firebaseConfig']).toStrictEqual({
        apiKey: service['configService'].get('API_KEY'),
        authDomain: service['configService'].get('AUTH_DOMAIN'),
      });
    });

    it('should return user authentication information', async () => {
      const email = 'test@test.fr';
      const password = 'Azerty@123';
      service['auth'].authStateReady = jest.fn().mockResolvedValue(undefined);
      service['firestoreService'].getByEmail = jest.fn().mockResolvedValue(outputWelcomeMock);
      const signIn: AuthentificationUserOutputDto = await service.signInGIP(email, password);
      expect(signIn.gipUser).toEqual(authentificationUserOutput.gipUser);
    });

    it('should throw BadRequestException if user is not found', async () => {
      const email = 'test@test.fr';
      const password = 'Azerty@123';
      firebaseAuth.signInWithEmailAndPassword = jest.fn().mockRejectedValue(new BadRequestException('User not found'));
      try {
        await service.signInGIP(email, password);
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('User not found');
      }
    });

    it('should throw InternalServerErrorException if authStateReady fails', async () => {
      const email = 'test@test.fr';
      const password = 'Azerty@123';
      firebaseAuth.signInWithEmailAndPassword = jest.fn().mockResolvedValue(GipUserMock);
      service['auth'].authStateReady = jest
        .fn()
        .mockRejectedValue(new InternalServerErrorException('Error authStateReady'));
      try {
        await service.signInGIP(email, password);
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('Error authStateReady');
      }
    });

    it('should throw NotFoundException if user is not found in Firestore', async () => {
      const email = 'test@test.fr';
      const password = 'Azerty@123';
      firebaseAuth.signInWithEmailAndPassword = jest.fn().mockResolvedValue(GipUserMock);
      service['auth'].authStateReady = jest.fn().mockResolvedValue(undefined);
      service['firestoreService'].getByEmail = jest.fn().mockRejectedValue(new NotFoundException('User not found'));
      try {
        await service.signInGIP(email, password);
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('User not found');
      }
    });
  });
  describe('signupGIP', () => {
    it('should return authentication information for newly created user', async () => {
      const email = 'test@test.fr';
      const password = 'Azerty@123';
      service['auth'].authStateReady = jest.fn().mockResolvedValue(undefined);
      service['firestoreService'].getByEmail = jest.fn().mockResolvedValue(outputWelcomeMock);
      const user = await service.signUpGIP(email, password);
      expect(user).toBeUndefined();
    });

    it('should throw BadRequestException if user creation fails', async () => {
      const email = 'test@test.fr';
      const password = 'Azerty@123';
      firebaseAuth.createUserWithEmailAndPassword = jest.fn().mockRejectedValue(new BadRequestException('error'));
      try {
        await service.signUpGIP(email, password);
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('error');
      }
    });

    it('should throw InternalServerErrorException if authStateReady fails', async () => {
      const email = 'test@test.fr';
      const password = 'Azerty@123';
      firebaseAuth.createUserWithEmailAndPassword = jest.fn().mockResolvedValue(GipUserMock);
      service['auth'].authStateReady = jest
        .fn()
        .mockRejectedValue(new InternalServerErrorException('Error authStateReady'));
      try {
        await service.signUpGIP(email, password);
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('Error authStateReady');
      }
    });

    it('should throw NotFoundException if user is not found in Firestore', async () => {
      const email = 'test@test.fr';
      const password = 'Azerty@123';
      firebaseAuth.createUserWithEmailAndPassword = jest.fn().mockResolvedValue(GipUserMock);
      service['auth'].authStateReady = jest.fn().mockResolvedValue(undefined);
      service['firestoreService'].getByEmail = jest.fn().mockRejectedValue(new NotFoundException('User not found'));
      try {
        await service.signUpGIP(email, password);
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('User not found');
      }
    });
  });
});
