import { AuthorizationService } from '@modules/authorization/authorization.service';
import { Test } from '@nestjs/testing';
import { FirestoreService } from '@modules/shared/firestore/firestore.service';
import { INestApplication, Logger, UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { FirestoreServiceMock } from '../../__mocks__/firestore.service';
import { AuthorizationController } from '@modules/authorization/authorization.controller';
import { MicrosoftService } from '@modules/microsoft/microsoft.service';

describe('AuthorizationController', () => {
  const mockMicrosoftService = {
    getUsers: jest.fn(),
    getUserByEmail: jest.fn(),
    getUserById: jest.fn(),
  };

  let authorizationController: AuthorizationController;
  let authorizationService: AuthorizationService;

  let app: INestApplication;

  beforeAll(async () => {
    const providers = [
      AuthorizationService,
      {
        provide: FirestoreService,
        useClass: FirestoreServiceMock,
      },
      {
        provide: MicrosoftService,
        useValue: mockMicrosoftService,
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
    ];

    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [AuthorizationController],
      providers,
    }).compile();
    app = moduleRef.createNestApplication();

    authorizationController = moduleRef.get<AuthorizationController>(AuthorizationController);
    authorizationService = moduleRef.get<AuthorizationService>(AuthorizationService);

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        disableErrorMessages: false,
        validationError: { target: false, value: true },
        whitelist: true,
        exceptionFactory: (errors: ValidationError[]) => new UnprocessableEntityException(errors),
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('ROLES', () => {
    it('should get all roles from a user', async () => {
      expect(await authorizationController.getRoles()).toEqual([]);
    });
  });
});
