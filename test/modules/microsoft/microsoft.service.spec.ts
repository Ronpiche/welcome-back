import { Test } from '@nestjs/testing';
import { MicrosoftService } from '@modules/microsoft/microsoft.service';
import { CacheService } from '@modules/shared/cache/cache.service';
import { Logger } from '@nestjs/common';
import MOCK_RESPONSE from '@/../mocks/data.json';
import { ConfigModule } from '@nestjs/config';
import axios from 'axios';

describe('Microsoft Service', () => {
  let microsoftService: MicrosoftService;

  const loggerService = {
    log: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    verbose: jest.fn(),
    fatal: jest.fn(),
    locaInstance: jest.fn(() => ''),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        MicrosoftService,
        CacheService,
        {
          provide: Logger,
          useValue: loggerService,
        },
      ],
      imports: [ConfigModule.forRoot()],
    }).compile();

    microsoftService = moduleRef.get<MicrosoftService>(MicrosoftService);
  });

  it('should be defined', () => {
    expect(microsoftService).toBeDefined();
  });

  describe('getUsers', () => {
    it('should handle error when failed to get users', async () => {
      jest.spyOn(axios, 'get').mockRejectedValueOnce(new Error());

      await expect(microsoftService.getUsers()).rejects.toThrow('Failed to retrieve users');
    });

    it('should get users with @daveo.fr email', async () => {
      const axiosResponse = { data: MOCK_RESPONSE.microsoft.users };
      jest.spyOn(axios, 'get').mockResolvedValueOnce(axiosResponse);

      const users = await microsoftService.getUsers();

      expect(users).toEqual([
        {
          _id: 'f21cb6de-8d8a-47b5-bf23-546abf502001',
          email: 'john.doe@daveo.fr',
          firstName: 'John',
          lastName: 'Doe',
        },
        {
          _id: 'ca6d7d9f-abb1-47f0-8b88-2e4b8fbd9cc9',
          email: 'jane.smith@daveo.fr',
          firstName: 'Jane',
          lastName: 'Smith',
        },
        {
          _id: 'fba5ff05-8188-4cfa-b7d3-8c5d86c83d2f',
          email: 'david.brown@daveo.fr',
          firstName: 'David',
          lastName: 'Brown',
        },
      ]);
    });
  });

  describe('getUserById', () => {
    it('should get a user by id', async () => {
      const axiosResponse = { data: MOCK_RESPONSE.microsoft.users.value[0] };
      jest.spyOn(axios, 'get').mockResolvedValueOnce(axiosResponse);

      const user = await microsoftService.getUserById('f21cb6de-8d8a-47b5-bf23-546abf502001');

      expect(user).toEqual({
        _id: 'f21cb6de-8d8a-47b5-bf23-546abf502001',
        email: 'john.doe@daveo.fr',
        firstName: 'John',
        lastName: 'Doe',
      });
    });

    it('should throw an error if user is not found', async () => {
      jest.spyOn(axios, 'get').mockRejectedValueOnce({ response: { status: 404 } });
      await expect(microsoftService.getUserById('nonexistent-id')).rejects.toThrow('User not found');
    });
  });

  describe('getUserByEmail', () => {
    it('should get a user by email', async () => {
      const axiosResponse = { data: { value: [MOCK_RESPONSE.microsoft.users.value[0]] } };
      jest.spyOn(axios, 'get').mockResolvedValueOnce(axiosResponse);

      const user = await microsoftService.getUserByEmail('john.doe@daveo.fr');

      expect(user).toEqual({
        _id: 'f21cb6de-8d8a-47b5-bf23-546abf502001',
        email: 'john.doe@daveo.fr',
        firstName: 'John',
        lastName: 'Doe',
      });
    });

    it('should return null if user is not found by email', async () => {
      const axiosResponse = { data: { value: [] } };
      jest.spyOn(axios, 'get').mockResolvedValueOnce(axiosResponse);

      const user = await microsoftService.getUserByEmail('nonexistent-email@daveo.fr');

      expect(user).toBeNull();
    });
  });

  // Add more test cases for other methods as needed
});
