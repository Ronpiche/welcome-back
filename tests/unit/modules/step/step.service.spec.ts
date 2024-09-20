import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, InternalServerErrorException, Logger } from '@nestjs/common';
import { StepService } from '@modules/step/step.service';
import { FirestoreService } from '@src/services/firestore/firestore.service';
import { WelcomeUser } from '@modules/welcome/entities/user.entity';
import { LoggerMock } from '@tests/unit/__mocks__/logger.mock';
import { FirestoreServiceMock } from '@tests/unit/__mocks__/firestore.service';
import { stepEntityMock } from '@tests/unit/__mocks__/step/Step.entity.mock';

describe('StepService', () => {
  let service: StepService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StepService,
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

    service = module.get<StepService>(StepService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('create', () => {
    it('should create an user object and return an object', async () => {
      service['firestoreService']['saveDocument'] = jest
        .fn()
        .mockResolvedValue({ status: 'ok', _id: stepEntityMock._id });
      const create = await service.create(stepEntityMock);
      expect(create).toBeDefined();
      expect(create).toEqual({ status: 'ok', _id: stepEntityMock._id });
    });

    it('should throw a httpException error', async () => {
      service['firestoreService']['saveDocument'] = jest
        .fn()
        .mockRejectedValue(new HttpException('exception error', 400));
      try {
        await service.create(stepEntityMock);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual('exception error');
        expect(error.status).toEqual(400);
      }
    });

    it('should throw a InternalServer error', async () => {
      service['firestoreService']['saveDocument'] = jest.fn().mockRejectedValue(new Error('error'));
      try {
        await service.create(stepEntityMock);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('Internal Server Error');
        expect(error.status).toEqual(500);
      }
    });
  });

  describe('findAll', () => {
    it('should return the list of steps', async () => {
      service['firestoreService']['getAllDocuments'] = jest.fn().mockResolvedValue([stepEntityMock]);
      const users = await service.findAll();
      expect(users).toEqual([stepEntityMock]);
    });

    it('should throw a HttpException error', async () => {
      service['firestoreService']['getAllDocuments'] = jest
        .fn()
        .mockRejectedValue(new HttpException('Error getAllDocuments', 400));
      try {
        await service.findAll();
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual('Error getAllDocuments');
        expect(error.status).toEqual(400);
      }
    });

    it('should throw a internalServer error (500)', async () => {
      service['firestoreService']['getAllDocuments'] = jest.fn().mockRejectedValue(new Error('Internal Server Error'));
      try {
        await service.findAll();
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual('Internal Server Error');
        expect(error.status).toEqual(500);
      }
    });
  });

  describe('findOne', () => {
    it('should return a no empty step object', async () => {
      service['firestoreService']['getDocument'] = jest.fn().mockResolvedValue(stepEntityMock);
      const user = await service.findOne(stepEntityMock._id);
      expect(user).toEqual(stepEntityMock);
    });

    it("should throw an error if the documentId doesn't exist", async () => {
      service['firestoreService']['getDocument'] = jest
        .fn()
        .mockRejectedValue(new HttpException('Step does not exists', 404));
      try {
        await service.findOne(stepEntityMock._id);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual('Step does not exists');
        expect(error.status).toEqual(404);
      }
    });

    it('should throw an internalServerError', async () => {
      service['firestoreService']['getDocument'] = jest.fn().mockRejectedValue(new Error('Internal Server Error'));
      try {
        await service.findOne(stepEntityMock._id);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('Internal Server Error');
        expect(error.status).toEqual(500);
      }
    });
  });

  describe('delete', () => {
    it('should delete a step object', async () => {
      expect(await service.remove(stepEntityMock._id)).toBeUndefined();
    });

    it('should throw an internalServerError', async () => {
      service['firestoreService']['deleteDocument'] = jest.fn().mockRejectedValue(new Error('Internal Server Error'));
      try {
        await service.remove(stepEntityMock._id);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('Internal Server Error');
        expect(error.status).toEqual(500);
      }
    });
  });

  describe('update', () => {
    it('should update a step object', async () => {
      service['firestoreService']['getDocument'] = jest.fn().mockResolvedValue(stepEntityMock);
      const res = await service.update(stepEntityMock._id, stepEntityMock);
      expect(res).toEqual(stepEntityMock);
    });

    it('should throw an HttpException', async () => {
      service['firestoreService']['updateDocument'] = jest
        .fn()
        .mockRejectedValue(new HttpException('HttpExceptionError', 400));
      try {
        await service.update(stepEntityMock._id, stepEntityMock);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual('HttpExceptionError');
        expect(error.status).toEqual(400);
      }
    });

    it('should throw an internalServerError', async () => {
      service['firestoreService']['updateDocument'] = jest.fn().mockRejectedValue(new Error('Internal Server Error'));
      try {
        await service.update(stepEntityMock._id, stepEntityMock);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('Internal Server Error');
        expect(error.status).toEqual(500);
      }
    });
  });

  describe('generateSteps', () => {
    it('should generate steps', async () => {
      service['firestoreService']['getAllDocuments'] = jest.fn().mockResolvedValue([stepEntityMock]);
      const user = new WelcomeUser({
        signupDate: '2024-01-02',
        arrivalDate: '2024-02-15',
      });

      const steps = await service.generateSteps(user);
      expect(steps).toStrictEqual([{ step: stepEntityMock, dt: new Date('2024-01-02') }]);
    });

    it('should throw an internalServerError', async () => {
      service['firestoreService']['getAllDocuments'] = jest.fn().mockRejectedValue(new Error('Internal Server Error'));
      const user = new WelcomeUser({
        signupDate: '2024-01-02',
        arrivalDate: '2024-06-01',
      });

      try {
        await service.generateSteps(user);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('Internal Server Error');
        expect(error.status).toEqual(500);
      }
    });
  });
});
