import { WelcomeController } from '@modules/welcome/welcome.controller';
import { WelcomeService } from '@modules/welcome/welcome.service';
import { Test, TestingModule } from '@nestjs/testing';
import { WelcomeServiceMock } from '../../__mocks__/welcome/welcome.service.mock';
import {
  outputWelcomeMock,
  inputUpdateWelcomeMock,
  outputUpdateWelcomeMock,
  inputWelcomeMock,
} from '../../__mocks__/welcome/User.entity.mock';
import { AccessGuard } from '../../../src/middleware/AuthGuard';
import { FindAllUsersPipe } from '@modules/welcome/pipes/find-all-users.pipe';
import { JwtService } from '@nestjs/jwt';
import { ArgumentsHost, BadRequestException, HttpException, Logger } from '@nestjs/common';
import { CreateUserExceptionFilter } from '@modules/welcome/filters/create-user-filter';

describe('Welcome controller', () => {
  let controller: WelcomeController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WelcomeController],
      providers: [
        JwtService,
        AccessGuard,
        FindAllUsersPipe,
        { provide: WelcomeService, useClass: WelcomeServiceMock },
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

    controller = module.get<WelcomeController>(WelcomeController);
  });

  describe('create', () => {
    it('should create an user, and return on object', async () => {
      const data = await controller.create(inputWelcomeMock);
      expect(data.status).toBeDefined();
      expect(data.id).toBeDefined();
      expect(data).toEqual({ status: 'ok', id: '789QSD123' });
    });
  });

  describe('findAll', () => {
    it('should return a array object with no filters', async () => {
      const users = await controller.findAll({});
      expect(users).toBeDefined();
      expect(users).toEqual([outputWelcomeMock]);
    });

    it('should testing the create-user filter', async () => {
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const argumentsHost = {
        switchToHttp: jest.fn().mockReturnValue({
          getResponse: jest.fn().mockReturnValue(response),
        }),
      };
      const spyJson = jest.spyOn(response, 'json');
      const spyStatus = jest.spyOn(response, 'status');
      const filter = new CreateUserExceptionFilter();
      filter.catch(new HttpException('error', 400), argumentsHost as unknown as ArgumentsHost);
      expect(spyJson).toHaveBeenCalled();
      expect(spyStatus).toHaveBeenCalled();
    });

    it('should return a array object with filters', async () => {
      const arrivalDate = {
        startDate: '14/05/2024',
        endDate: '14/05/2024',
      };
      const logger = new Logger();
      const pipe = new FindAllUsersPipe(logger);
      const filter = pipe.transform(arrivalDate);
      const users = await controller.findAll(filter);
      expect(users).toBeDefined();
      expect(users).toEqual([outputWelcomeMock]);
    });

    it("should throw a BadRequestException error 'Invalid arrivalDate startDate'", async () => {
      const arrivalDate = {
        startDate: '14/05/202',
        endDate: '14/05/2024',
      };
      const logger = new Logger();
      const pipe = new FindAllUsersPipe(logger);
      try {
        pipe.transform(arrivalDate);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('Invalid arrivalDate startDate');
        expect(error.status).toEqual(400);
      }
    });

    it("should throw a BadRequestException error 'Invalid arrivalDate endDate'", async () => {
      const arrivalDate = {
        startDate: '14/05/2024',
        endDate: '14/05/202',
      };
      const logger = new Logger();
      const pipe = new FindAllUsersPipe(logger);
      try {
        pipe.transform(arrivalDate);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('Invalid arrivalDate endDate');
        expect(error.status).toEqual(400);
      }
    });
  });

  describe('FindOne', () => {
    it('should return an user object', async () => {
      const documentId = '789QSD123';
      const user = await controller.findOne(documentId);
      expect(user).toBeDefined();
      expect(user).toEqual(outputWelcomeMock);
    });
  });

  describe('remove', () => {
    it('should delete an user object', async () => {
      const documentId = '789QSD123';
      const res = await controller.remove(documentId);
      expect(res).toBeDefined();
      expect(res).toEqual('User deleted');
    });
  });

  describe('update', () => {
    it('should update an user object', async () => {
      const documentId = '789QSD123';
      const res = await controller.update(documentId, inputUpdateWelcomeMock);
      expect(res).toBeDefined();
      expect(res).toEqual(outputUpdateWelcomeMock);
      expect(res.lastName).toEqual(outputUpdateWelcomeMock.lastName);
    });
  });
});
