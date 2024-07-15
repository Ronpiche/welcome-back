import { Response } from 'express';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { EmailController } from '@modules/email/email.controller';
import { EmailService } from '@modules/email/email.service';
import { EmailServiceMock } from '../../../unit/__mocks__/email/email.service.mock';
import { AccessGuard } from '../../../../src/middleware/AuthGuard';
import { JwtCognito } from '../../../../src/modules/cognito/jwtCognito.service';
import { ConfigService } from '@nestjs/config';
import { CognitoServiceMock } from '../../../unit/__mocks__/cognito/cognito.service.mock';
import { LoggerMock } from '../../../unit/__mocks__/logger.mock';

describe('Email controller', () => {
  let controller: EmailController;
  const response: Partial<Response> = {
    status: jest.fn().mockImplementation().mockReturnValue(200),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailController],
      providers: [
        JwtService,
        ConfigService,
        AccessGuard,
        { provide: JwtCognito, useClass: CognitoServiceMock },
        { provide: EmailService, useClass: EmailServiceMock },
        { provide: Logger, useClass: LoggerMock },
      ],
    }).compile();

    controller = module.get<EmailController>(EmailController);
  });

  describe('run', () => {
    it('should launch the task and return the result (OK)', async () => {
      const data = await controller.run(response as Response);
      expect(data).toEqual([{ status: 'fulfilled', value: { _id: 1 } }]);
    });

    it('should launch the task and return the result (KO)', async () => {
      controller['emailService']['run'] = jest
        .fn()
        .mockResolvedValue([{ status: 'rejected', reason: { _id: 1, error: 'unknown' } }]);
      const data = await controller.run(response as Response);
      expect(data).toEqual([{ status: 'rejected', reason: { _id: 1, error: 'unknown' } }]);
    });
  });
});
