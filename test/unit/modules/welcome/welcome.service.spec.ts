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
import { StepService } from '@modules/step/step.service';
import { StepServiceMock } from '../../../unit/__mocks__/step/step.service.mock';
import { Timestamp } from '@google-cloud/firestore';
import { WelcomeUser } from '@modules/welcome/entities/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { MailerServiceMock } from '../../../unit/__mocks__/mailer.service.mock';
import { FIRESTORE_COLLECTIONS } from '@src/configs/types/Firestore.types';

describe('UsersService', () => {
  let service: WelcomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WelcomeService,
        {
          provide: MailerService,
          useClass: MailerServiceMock,
        },
        {
          provide: StepService,
          useClass: StepServiceMock,
        },
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
        expect(error.status).toEqual(400);
      }
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
    it('should updated an user object', async () => {
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

  describe('getNewlyUnlockedSteps', () => {
    it('should return unlocked steps (no step)', async () => {
      const user = new WelcomeUser({ steps: [] });
      expect(service.getNewlyUnlockedSteps(user, new Date('2024-06-01'))).toStrictEqual([]);
    });

    it('should return unlocked steps (some steps)', async () => {
      const user = new WelcomeUser({
        steps: [
          {
            _id: '0',
            unlockEmailSentAt: Timestamp.fromDate(new Date('2024-05-01')),
            unlockDate: Timestamp.fromDate(new Date('2024-05-01')),
          },
          { _id: '1', unlockDate: Timestamp.fromDate(new Date('2024-05-15')) },
          { _id: '2', unlockDate: Timestamp.fromDate(new Date('2024-06-01')) },
          { _id: '3', unlockDate: Timestamp.fromDate(new Date('2024-06-15')) },
        ],
      });
      expect(service.getNewlyUnlockedSteps(user, new Date('2024-06-01'))).toStrictEqual(['1', '2']);
    });
  });

  describe('run', () => {
    it('should send emails to newcommers with unlocked steps (no user)', async () => {
      const result = await service.run(new Date('2024-06-01'));
      expect(result).toStrictEqual([]);
    });

    it('should send emails to newcommers with unlocked steps (some users)', async () => {
      const users = [
        {
          _id: '0',
          firstName: 'aaa',
          lastName: 'bbb',
          referentRH: {
            firstName: 'rhf',
            lastName: 'rhl',
          },
          steps: [
            {
              _id: '0',
              unlockEmailSentAt: Timestamp.fromDate(new Date('2024-05-01')),
              unlockDate: Timestamp.fromDate(new Date('2024-05-01')),
            },
            { _id: '1', unlockDate: Timestamp.fromDate(new Date('2024-05-15')) },
            { _id: '2', unlockDate: Timestamp.fromDate(new Date('2024-06-01')) },
            { _id: '3', unlockDate: Timestamp.fromDate(new Date('2024-06-15')) },
          ],
        },
        {
          _id: '1',
          firstName: 'ccc',
          lastName: 'ddd',
          referentRH: {
            firstName: 'rhf',
            lastName: 'rhl',
          },
          steps: [
            { _id: '0', unlockDate: Timestamp.fromDate(new Date('2024-05-01')) },
            { _id: '1', unlockDate: Timestamp.fromDate(new Date('2024-05-15')) },
            { _id: '2', unlockDate: Timestamp.fromDate(new Date('2024-06-01')) },
            { _id: '3', unlockDate: Timestamp.fromDate(new Date('2024-06-15')) },
          ],
        },
        {
          _id: '2',
          firstName: 'eee',
          lastName: 'fff',
          referentRH: {
            firstName: 'rhf',
            lastName: 'rhl',
          },
          steps: [
            { _id: '0', unlockDate: Timestamp.fromDate(new Date('2024-06-15')) },
            { _id: '1', unlockDate: Timestamp.fromDate(new Date('2024-07-01')) },
            { _id: '2', unlockDate: Timestamp.fromDate(new Date('2024-07-15')) },
            { _id: '3', unlockDate: Timestamp.fromDate(new Date('2024-08-01')) },
          ],
        },
      ];
      const steps = [
        { _id: '0', cutAt: 0.25, unlockEmail: { subject: 'Test', body: '1234' }, maxDays: 90, minDays: 30 },
        { _id: '1', cutAt: 0.5, unlockEmail: { subject: 'Test', body: '1234' }, maxDays: 90, minDays: 30 },
        { _id: '2', cutAt: 0.7, unlockEmail: { subject: 'Test', body: '1234' }, maxDays: 90, minDays: 30 },
      ];
      service['firestoreService']['getAllDocuments'] = jest.fn().mockResolvedValue(users);
      service['stepService']['findAll'] = jest.fn().mockResolvedValue(steps);
      const result = await service.run(new Date('2024-06-01'));
      expect(result).toStrictEqual([
        { status: 'fulfilled', value: { _id: '0' } },
        { status: 'fulfilled', value: { _id: '1' } },
      ]);
    });

    it('should return rejected when emails cannot be send', async () => {
      const users = [
        {
          _id: '0',
          firstName: 'aaa',
          lastName: 'bbb',
          referentRH: {
            firstName: 'rhf',
            lastName: 'rhl',
          },
          steps: [
            {
              _id: '0',
              unlockEmailSentAt: Timestamp.fromDate(new Date('2024-05-01')),
              unlockDate: Timestamp.fromDate(new Date('2024-05-01')),
            },
            { _id: '1', unlockDate: Timestamp.fromDate(new Date('2024-05-15')) },
            { _id: '2', unlockDate: Timestamp.fromDate(new Date('2024-06-01')) },
            { _id: '3', unlockDate: Timestamp.fromDate(new Date('2024-06-15')) },
          ],
        },
        {
          _id: '1',
          firstName: 'ccc',
          lastName: 'ddd',
          referentRH: {
            firstName: 'rhf',
            lastName: 'rhl',
          },
          steps: [
            { _id: '0', unlockDate: Timestamp.fromDate(new Date('2024-05-01')) },
            { _id: '1', unlockDate: Timestamp.fromDate(new Date('2024-05-15')) },
            { _id: '2', unlockDate: Timestamp.fromDate(new Date('2024-06-01')) },
            { _id: '3', unlockDate: Timestamp.fromDate(new Date('2024-06-15')) },
          ],
        },
        {
          _id: '2',
          firstName: 'eee',
          lastName: 'fff',
          referentRH: {
            firstName: 'rhf',
            lastName: 'rhl',
          },
          steps: [
            { _id: '0', unlockDate: Timestamp.fromDate(new Date('2024-06-15')) },
            { _id: '1', unlockDate: Timestamp.fromDate(new Date('2024-07-01')) },
            { _id: '2', unlockDate: Timestamp.fromDate(new Date('2024-07-15')) },
            { _id: '3', unlockDate: Timestamp.fromDate(new Date('2024-08-01')) },
          ],
        },
      ];
      const steps = [
        { _id: '0', cutAt: 0.25, unlockEmail: { subject: 'Test', body: '1234' }, maxDays: 90, minDays: 30 },
        { _id: '1', cutAt: 0.5, unlockEmail: { subject: 'Test', body: '1234' }, maxDays: 90, minDays: 30 },
        { _id: '2', cutAt: 0.7, unlockEmail: { subject: 'Test', body: '1234' }, maxDays: 90, minDays: 30 },
      ];
      service['mailerService']['sendMail'] = jest.fn().mockRejectedValue(new Error('Internal Server Error'));
      service['firestoreService']['getAllDocuments'] = jest.fn().mockResolvedValue(users);
      service['stepService']['findAll'] = jest.fn().mockResolvedValue(steps);
      const result = await service.run(new Date('2024-06-01'));
      expect(result).toStrictEqual([
        { status: 'rejected', reason: { _id: '0', message: 'Internal Server Error' } },
        { status: 'rejected', reason: { _id: '1', message: 'Internal Server Error' } },
      ]);
    });
  });

  describe('completeStep', () => {
    it('should complete user step and send emails', async () => {
      const date = new Date();
      const user = {
        _id: '1',
        firstName: 'aaa',
        lastName: 'bbb',
        email: 'aaa.bbb@localhost',
        referentRH: {
          firstName: 'ccc',
          lastName: 'ddd',
          email: 'ccc.ddd@localhost',
        },
        steps: [{ _id: '1' }, { _id: '2' }, { _id: '3' }, { _id: '4' }],
      };
      const step = {
        _id: '2',
        completionEmail: { subject: 'Test', body: '1234' },
        completionEmailManager: { subject: 'Test2', body: '12345' },
      };
      service.findOne = jest.fn().mockResolvedValue(user);
      service['firestoreService']['updateDocument'] = jest.fn();
      service['stepService']['findOne'] = jest.fn().mockResolvedValue(step);
      await service.completeStep('1', '2', date);
      expect(service['firestoreService']['updateDocument']).toHaveBeenCalledWith(
        FIRESTORE_COLLECTIONS.WELCOME_USERS,
        '1',
        {
          steps: [{ _id: '1' }, { _id: '2', completedAt: Timestamp.fromDate(date) }, { _id: '3' }, { _id: '4' }],
        },
      );
      expect(service['mailerService'].sendMail).toHaveBeenNthCalledWith(1, {
        to: user.referentRH.email,
        subject: step.completionEmailManager.subject,
        html: `<p>${step.completionEmailManager.body}</p>\n`,
      });
      expect(service['mailerService'].sendMail).toHaveBeenNthCalledWith(2, {
        to: user.email,
        subject: step.completionEmail.subject,
        html: `<p>${step.completionEmail.body}</p>\n`,
      });
    });
  });
});
