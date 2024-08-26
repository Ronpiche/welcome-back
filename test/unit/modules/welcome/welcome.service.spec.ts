import { Test, TestingModule } from '@nestjs/testing';
import { WelcomeService } from '@modules/welcome/welcome.service';
import { FirestoreService } from '@src/services/firestore/firestore.service';
import { FirestoreServiceMock } from '@test/unit/__mocks__/firestore.service';
import { HttpException, InternalServerErrorException, Logger } from '@nestjs/common';
import {
  inputUpdateWelcomeMock,
  inputWelcomeMock,
  welcomeUserEntityMock,
} from '@test/unit/__mocks__/welcome/User.entity.mock';
import { verifyPublicHoliday } from '@modules/welcome/welcome.utils';

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

  describe('createUser', () => {
    it('should create an user object and return an object', async () => {
      service['firestoreService']['saveDocument'] = jest.fn().mockResolvedValue({ status: 'ok', id: '789QSD123' });
      const create = await service.createUser(inputWelcomeMock);
      expect(create).toBeDefined();
      expect(create).toEqual({ status: 'ok', id: '789QSD123' });
    });

    it('should throw a httpException error', async () => {
      service['firestoreService']['saveDocument'] = jest
        .fn()
        .mockRejectedValue(new HttpException('exception error', 400));
      try {
        await service.createUser(inputWelcomeMock);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual('exception error');
        expect(error.status).toEqual(400);
      }
    });

    it('should throw a InternalServer error', async () => {
      service['firestoreService']['saveDocument'] = jest.fn().mockRejectedValue(new Error('error'));
      try {
        await service.createUser(inputWelcomeMock);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('Internal Server Error');
        expect(error.status).toEqual(500);
      }
    });

    it('should throw an error, because the arrivalDate is invalid', async () => {
      inputWelcomeMock.arrivalDate = '-1';
      try {
        await service.createUser(inputWelcomeMock);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual('Invalid end date');
        expect(error.status).toEqual(400);
      }
    });

    describe('Testing holiday function', () => {
      it('Should shift of one day the date, because is it a public holiday', async () => {
        const datesArray = verifyPublicHoliday([new Date('2024-05-08T08:14:08Z'), new Date('2024-09-05T08:14:08Z')]);
        expect(datesArray.map((d) => d.toISOString()).includes('2024-05-10T08:14:08.000Z')).toBeTruthy();
        expect(datesArray.map((d) => d.toISOString()).includes('2024-09-05T08:14:08.000Z')).toBeTruthy();
      });

      it('Should shift of tuesday, because monday is a public holiday, and the date is a saturday', async () => {
        const datesArray = verifyPublicHoliday([new Date('2024-05-23T08:14:08Z'), new Date('2024-11-09T08:14:08Z')]);
        expect(datesArray.map((d) => d.toISOString()).includes('2024-05-23T08:14:08.000Z')).toBeTruthy();
        expect(datesArray.map((d) => d.toISOString()).includes('2024-11-12T08:14:08.000Z')).toBeTruthy();
      });

      it('Should shift of Monday, because the date is a saturday', async () => {
        const datesArray = verifyPublicHoliday([new Date('2024-05-11T08:14:08Z'), new Date('2024-09-05T08:14:08Z')]);
        expect(datesArray.map((d) => d.toISOString()).includes('2024-05-13T08:14:08.000Z')).toBeTruthy();
        expect(datesArray.map((d) => d.toISOString()).includes('2024-09-05T08:14:08.000Z')).toBeTruthy();
      });

      it('Should shift of Monday, because the date is a sunday', async () => {
        const datesArray = verifyPublicHoliday([new Date('2024-05-12T08:14:08Z'), new Date('2024-09-05T08:14:08Z')]);
        expect(datesArray.map((d) => d.toISOString()).includes('2024-05-13T08:14:08.000Z')).toBeTruthy();
        expect(datesArray.map((d) => d.toISOString()).includes('2024-09-05T08:14:08.000Z')).toBeTruthy();
      });
    });
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

  describe('update', () => {
    it('should ypdated an user object', async () => {
      const documentId = '789QSD123';
      service['firestoreService']['updateDocument'] = jest.fn();
      service['firestoreService']['getDocument'] = jest.fn().mockResolvedValue(welcomeUserEntityMock);
      const res = await service.update(documentId, inputUpdateWelcomeMock);
      expect(res).toEqual(welcomeUserEntityMock);
    });
  });

  it('should throw an HttpException', async () => {
    const documentId = '789QSD123';
    service['firestoreService']['getDocument'] = jest.fn().mockResolvedValue(welcomeUserEntityMock);
    service['firestoreService']['updateDocument'] = jest
      .fn()
      .mockRejectedValue(new HttpException('HttpExceptionError', 400));
    try {
      await service.update(documentId, inputUpdateWelcomeMock);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual('HttpExceptionError');
      expect(error.status).toEqual(400);
    }
  });

  it('should throw an internalServerError', async () => {
    const documentId = '789QSD123';
    service['firestoreService']['getDocument'] = jest.fn().mockResolvedValue(welcomeUserEntityMock);
    service['firestoreService']['updateDocument'] = jest.fn().mockRejectedValue(new Error('Internal Server Error'));
    try {
      await service.update(documentId, inputUpdateWelcomeMock);
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerErrorException);
      expect(error.message).toEqual('Internal Server Error');
      expect(error.status).toEqual(500);
    }
  });

  describe('transformAppGames', () => {
    it('should return an array', async () => {
      const res = await service.transformDbOjectStringsToArray('appGame');
      expect(res).toBeDefined();
      expect(res).toEqual({ status: 'success' });
    });
  });
});
