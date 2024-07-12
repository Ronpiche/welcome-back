import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { EmailService } from '@modules/email/email.service';
import { FirestoreService } from '@modules/shared/firestore/firestore.service';
import { WelcomeUser } from '@modules/welcome/entities/user.entity';
import { FirestoreServiceMock } from '../../../unit/__mocks__/firestore.service';
import { welcomeUserEntityMock } from '../../../unit/__mocks__/welcome/User.entity.mock';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
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

    service = module.get<EmailService>(EmailService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should trigger SMTP server', async () => {
    const user = new WelcomeUser();
    user.email = 'any@localhost';
    const subject = 'Test';
    const text = 'This is a test';
    service.transporter.sendMail = jest.fn().mockImplementation((_, callback) => callback());
    await service.sendEmail(user, subject, text);
    expect(service.transporter.sendMail).toHaveReturnedTimes(1);
  });

  it('should send emails to newcommers with unlocked steps', async () => {
    service.sendEmail = jest.fn().mockReturnValue(Promise.resolve());
    service['firestoreService']['getAllDocuments'] = jest.fn().mockResolvedValue([welcomeUserEntityMock]);
    await service.run();
    expect(service.sendEmail).toHaveReturnedTimes(1);
  });
});
