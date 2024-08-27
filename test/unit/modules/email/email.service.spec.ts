import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { Timestamp } from '@google-cloud/firestore';
import { EmailService } from '@modules/email/email.service';
import { MailerService } from '@nestjs-modules/mailer';
import { FirestoreService } from '@src/services/firestore/firestore.service';
import { WelcomeUser } from '@modules/welcome/entities/user.entity';
import { LoggerMock } from '@test/unit/__mocks__/logger.mock';
import { MailerServiceMock } from '@test/unit/__mocks__/mailer.service.mock';
import { FirestoreServiceMock } from '@test/unit/__mocks__/firestore.service';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: MailerService,
          useClass: MailerServiceMock,
        },
        {
          provide: FirestoreService,
          useClass: FirestoreServiceMock,
        },
        {
          provide: Logger,
          useClass: LoggerMock,
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('sendEmail', () => {
    it('should success if email is sent', async () => {
      const user = new WelcomeUser();
      user._id = 'aaa';
      user.email = 'any@localhost';
      const subject = 'Test';
      const text = 'This is a test';
      await expect(service.sendEmail(user, subject, text)).resolves.toBeTruthy();
    });

    it('should throw if email is not sent', async () => {
      service['mailerService']['sendMail'] = jest.fn(() => {
        throw new Error();
      });
      const user = new WelcomeUser();
      user._id = 'aaa';
      user.email = 'any@localhost';
      const subject = 'Test';
      const text = 'This is a test';
      await expect(service.sendEmail(user, subject, text)).rejects.toThrow();
    });
  });

  describe('getNewlyUnlockedSteps', () => {
    it('should return unlocked steps (no step)', async () => {
      const user = new WelcomeUser();
      expect(service.getNewlyUnlockedSteps(user, new Date('2024-06-01'))).toStrictEqual([]);
    });

    it('should return unlocked steps (some steps)', async () => {
      const user = new WelcomeUser();
      user.steps = [
        {
          _id: 0,
          emailSentAt: Timestamp.fromDate(new Date('2024-05-01')),
          unlockDate: Timestamp.fromDate(new Date('2024-05-01')),
        },
        { _id: 1, unlockDate: Timestamp.fromDate(new Date('2024-05-15')) },
        { _id: 2, unlockDate: Timestamp.fromDate(new Date('2024-06-01')) },
        { _id: 3, unlockDate: Timestamp.fromDate(new Date('2024-06-15')) },
      ];
      expect(service.getNewlyUnlockedSteps(user, new Date('2024-06-01'))).toStrictEqual([1, 2]);
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
          steps: [
            {
              _id: 0,
              emailSentAt: Timestamp.fromDate(new Date('2024-05-01')),
              unlockDate: Timestamp.fromDate(new Date('2024-05-01')),
            },
            { _id: 1, unlockDate: Timestamp.fromDate(new Date('2024-05-15')) },
            { _id: 2, unlockDate: Timestamp.fromDate(new Date('2024-06-01')) },
            { _id: 3, unlockDate: Timestamp.fromDate(new Date('2024-06-15')) },
          ],
        },
        {
          _id: '1',
          steps: [
            { _id: 0, unlockDate: Timestamp.fromDate(new Date('2024-05-01')) },
            { _id: 1, unlockDate: Timestamp.fromDate(new Date('2024-05-15')) },
            { _id: 2, unlockDate: Timestamp.fromDate(new Date('2024-06-01')) },
            { _id: 3, unlockDate: Timestamp.fromDate(new Date('2024-06-15')) },
          ],
        },
        {
          _id: '2',
          steps: [
            { _id: 0, unlockDate: Timestamp.fromDate(new Date('2024-06-15')) },
            { _id: 1, unlockDate: Timestamp.fromDate(new Date('2024-07-01')) },
            { _id: 2, unlockDate: Timestamp.fromDate(new Date('2024-07-15')) },
            { _id: 3, unlockDate: Timestamp.fromDate(new Date('2024-08-01')) },
          ],
        },
      ];
      service['firestoreService']['getAllDocuments'] = jest.fn().mockResolvedValue(users);
      const result = await service.run(new Date('2024-06-01'));
      expect(result).toStrictEqual([
        { status: 'fulfilled', value: { _id: '0' } },
        { status: 'fulfilled', value: { _id: '1' } },
      ]);
    });
  });
});
