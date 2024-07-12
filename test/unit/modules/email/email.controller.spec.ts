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
    it('should launch the check for unlocked steps', async () => {
      const data = await controller.run({} as Response);
      expect(data).toEqual([{ status: 'fulfilled', value: { _id: 1 } }]);
    });
  });
});
