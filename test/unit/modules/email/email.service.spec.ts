import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from '@modules/email/email.service';
import { EMAIL_FROM } from '@modules/email/constants';
import { FirestoreService } from '@modules/shared/firestore/firestore.service';
import { FirestoreServiceMock } from '../../../unit/__mocks__/firestore.service';
import { Logger } from '@nestjs/common';

process.env.EMAIL_SERVICE = 'localhost';

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
    const to = 'any@localhost';
    const subject = 'Test';
    const text = 'This is a test';
    service.transporter.sendMail = jest.fn().mockReturnValue(Promise.resolve());
    await service.sendEmail(to, subject, text);
    expect(service.transporter.sendMail).toHaveReturnedTimes(1);
    expect(service.transporter.sendMail).toHaveBeenCalledWith({ from: EMAIL_FROM, to, subject, text });
  });
});
