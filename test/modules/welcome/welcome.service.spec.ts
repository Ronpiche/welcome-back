import { Test, TestingModule } from '@nestjs/testing';
import { WelcomeService } from '@modules/welcome/welcome.service';
import { FirestoreService } from '../../../src/modules/shared/firestore/firestore.service';
import { FirestoreServiceMock } from '../../__mocks__/firestore.service';
import { HttpException, InternalServerErrorException, Logger } from '@nestjs/common';
import { welcomeUserEntityMock } from '../../__mocks__/welcome/User.entity.mock';

describe('UsersService', () => {
  let service: WelcomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WelcomeService,
        {
          provide: FirestoreService,
          useClass: FirestoreServiceMock,
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            debug: jest.fn(),
            warn: jest.fn(),
            info: jest.fn(),
            secure: jest.fn(),
            isLevelEnabled: jest.fn(() => false),
          },
        },
      ],
    }).compile();

    service = module.get<WelcomeService>(WelcomeService);
  });

  describe('findAll', () => {
    it('should return a user array with no filters', async () => {
      service['firestoreService']['getAllDocuments'] = jest.fn().mockResolvedValue([welcomeUserEntityMock]);
      const users = await service.findAll({});
      expect(users).toEqual([welcomeUserEntityMock]);
    });

    it('should return a no empty user array with no filters', async () => {
      service['firestoreService']['getAllDocuments'] = jest.fn().mockResolvedValue([]);
      const users = await service.findAll({});
      expect(users).toEqual([]);
    });

    it('should throw a HttpException error', async () => {
      service['firestoreService']['getAllDocuments'] = jest
        .fn()
        .mockRejectedValue(new HttpException('Error getAllDocuments', 400));
      try {
        await service.findAll({});
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual('Error getAllDocuments');
        expect(error.status).toEqual(400);
      }
    });

    it('should throw a internalServer error (500)', async () => {
      service['firestoreService']['getAllDocuments'] = jest.fn().mockRejectedValue(new Error('Internal Server Error'));
      try {
        await service.findAll({});
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual('Internal Server Error');
        expect(error.status).toEqual(500);
      }
    });
  });

  describe('findOne', () => {
    it('should return a no empty user object', async () => {
      const documentId = '789QSD123';
      service['firestoreService']['getDocument'] = jest.fn().mockResolvedValue(welcomeUserEntityMock);
      const user = await service.findOne(documentId);
      expect(user).toEqual(welcomeUserEntityMock);
    });

    it("should throw an error if the documentId doesn't exist", async () => {
      const documentId = '789QSD123';
      service['firestoreService']['getDocument'] = jest
        .fn()
        .mockRejectedValue(new HttpException('User is not registered in welcome', 404));
      try {
        await service.findOne(documentId);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual('User is not registered in welcome');
        expect(error.status).toEqual(404);
      }
    });

    it('should throw an internalServerError', async () => {
      const documentId = '789QSD123';
      service['firestoreService']['getDocument'] = jest.fn().mockRejectedValue(new Error('Internal Server Error'));
      try {
        await service.findOne(documentId);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('Internal Server Error');
        expect(error.status).toEqual(500);
      }
    });
  });

  describe('delete', () => {
    it('should deleted an user object', async () => {
      const documentId = '789QSD123';
      service['firestoreService']['deleteDocument'] = jest.fn();
      expect(await service.remove(documentId)).toBeUndefined();
    });
  });

  it('should throw an internalServerError', async () => {
    const documentId = '789QSD123';
    service['firestoreService']['getDocument'] = jest.fn().mockResolvedValue(welcomeUserEntityMock);
    service['firestoreService']['deleteDocument'] = jest.fn().mockRejectedValue(new Error('Internal Server Error'));
    try {
      await service.remove(documentId);
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerErrorException);
      expect(error.message).toEqual('Internal Server Error');
      expect(error.status).toEqual(500);
    }
  });
});
