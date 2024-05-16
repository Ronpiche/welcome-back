import { Test, TestingModule } from '@nestjs/testing';
import { WelcomeService } from '@modules/welcome/welcome.service';
import { FirestoreService } from '../../../src/modules/shared/firestore/firestore.service';
import { FirestoreServiceMock } from '../../__mocks__/firestore.service';
import { HttpException, Logger } from '@nestjs/common';
import { welcomeUserEntityMock } from '../../__mocks__/welcome/User.entity.mock';

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

  it("findAll - should return a user array with no filters", async () => {
    service['firestoreService']['getAllDocuments'] = jest.fn().mockResolvedValue([welcomeUserEntityMock])
    let users = await service.findAll({});
    expect(users).toEqual([welcomeUserEntityMock]);
  })

  it("findAll - should return a no empty user array with no filters", async () => {
    service['firestoreService']['getAllDocuments'] = jest.fn().mockResolvedValue([]);
    let users = await service.findAll({})
    expect(users).toEqual([]);
  })

  it("findAll - should throw a HttpException error", async () => {
    service['firestoreService']['getAllDocuments'] = jest.fn().mockRejectedValue(new HttpException("Error getAllDocuments",400));
    try {
      await service.findAll({})
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual("Error getAllDocuments")
      expect(error.status).toEqual(400);
    }
  })

  it("findAll - should throw a internalServer error (500)", async () => {
    service['firestoreService']['getAllDocuments'] = jest.fn().mockRejectedValue(new Error("Internal Server Error"));
    try {
      await service.findAll({})
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.message).toEqual("Internal Server Error")
      expect(error.status).toEqual(500);
    }
  })
});
