import { Test, TestingModule } from '@nestjs/testing';
import { WelcomeService } from '../../../src/modules/welcome/welcome.service';
import { FirestoreService } from '../../../src/modules/shared/firestore/firestore.service';
import { FirestoreServiceMock } from '../../__mocks__/firestore.service';
import { Logger } from '@nestjs/common';

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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
