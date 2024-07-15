import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { EmailService } from '@modules/email/email.service';
import { MailerService } from '@nestjs-modules/mailer';
import { FirestoreService } from '@modules/shared/firestore/firestore.service';
import { WelcomeUser } from '@modules/welcome/entities/user.entity';
import { LoggerMock } from '../../../unit/__mocks__/logger.mock';
import { MailerServiceMock } from '../../../unit/__mocks__/mailer.service.mock';
import { FirestoreServiceMock } from '../../../unit/__mocks__/firestore.service';
import { welcomeUserEntityMock } from '../../../unit/__mocks__/welcome/User.entity.mock';

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

  it('should trigger SMTP server', async () => {
    const user = new WelcomeUser();
    user._id = 'aaa';
    user.email = 'any@localhost';
    const subject = 'Test';
    const text = 'This is a test';
    const result = await service.sendEmail(user, subject, text);
    expect(result).toStrictEqual({ _id: 'aaa' });
  });

  it('should send emails to newcommers with unlocked steps', async () => {
    service['firestoreService']['getAllDocuments'] = jest.fn().mockResolvedValue([welcomeUserEntityMock]);
    const result = await service.run();
    expect(result).toStrictEqual([{ status: 'fulfilled', value: { _id: '16156-585263' } }]);
  });
});
