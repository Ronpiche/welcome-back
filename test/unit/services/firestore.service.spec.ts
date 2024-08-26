import { Firestore } from '@google-cloud/firestore';
import { FIRESTORE_COLLECTIONS } from '@src/configs/types/Firestore.types';
import { FirestoreService } from '@src/services/firestore/firestore.service';
import { HttpException, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { outputWelcomeMock, welcomeUserEntityMock } from '@test/unit/__mocks__/welcome/User.entity.mock';
import { WelcomeUser } from '@src/modules/welcome/entities/user.entity';

describe('firestoreService', () => {
  let service: FirestoreService;
  let collection: string;
  let documentId: string;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FirestoreService,
        Firestore,
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

    service = module.get<FirestoreService>(FirestoreService);
    service['firestore']['collection'] = jest.fn().mockReturnValue({
      doc: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
    });
    collection = FIRESTORE_COLLECTIONS.WELCOME_USERS;
    documentId = '789QSD123';
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getAllDocuments', () => {
    it('the firestoreDb should return an Array user, with no filters', async () => {
      service['firestore'].collection(collection).get = jest.fn().mockResolvedValue([
        {
          data: jest.fn().mockReturnValue(welcomeUserEntityMock),
        },
        {
          data: jest.fn().mockReturnValue(welcomeUserEntityMock),
        },
      ]);
      const spy = jest.spyOn(service as any, 'applyFilters');
      const res = await service.getAllDocuments(collection as FIRESTORE_COLLECTIONS);
      expect(res).toHaveLength(2);
      expect(spy).not.toHaveBeenCalled();
    });

    it('the firestoreDb should return an Array user, with an empty object filter', async () => {
      service['firestore'].collection(collection).get = jest.fn().mockResolvedValue([
        {
          data: jest.fn().mockReturnValue(welcomeUserEntityMock),
        },
        {
          data: jest.fn().mockReturnValue(welcomeUserEntityMock),
        },
      ]);
      const spy = jest.spyOn(service as any, 'applyFilters');
      const res = await service.getAllDocuments(collection as FIRESTORE_COLLECTIONS, {});
      expect(res).toHaveLength(2);
      expect(spy).toHaveBeenCalled();
    });

    it("the firestoreDb should return an Array user, with a filter '=='", async () => {
      const filter = {
        email: 'test@test.fr',
      };

      service['firestore'].collection(collection).get = jest.fn().mockResolvedValue([
        {
          data: jest.fn().mockReturnValue(welcomeUserEntityMock),
        },
      ]);
      const spy = jest.spyOn(service as any, 'applyFilters');
      const res = await service.getAllDocuments(collection as FIRESTORE_COLLECTIONS, filter);
      expect(res).toHaveLength(1);
      expect(spy).toHaveBeenCalled();
    });

    it('the firestoreDb should return an Array user, with a filter on arrivalDate', async () => {
      const filter = {
        arrivalDate: {
          $gte: '15/05/2024',
          $lte: '10/05/2024',
        },
      };

      service['firestore'].collection(collection).get = jest.fn().mockResolvedValue([
        {
          data: jest.fn().mockReturnValue(welcomeUserEntityMock),
        },
      ]);
      const spy = jest.spyOn(service as any, 'applyFilters');
      const res = await service.getAllDocuments(collection as FIRESTORE_COLLECTIONS, filter);
      expect(res).toHaveLength(1);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('getDocument', () => {
    it('the firestoreDB should return an user Object', async () => {
      service['firestore'].collection(collection).doc(documentId).get = jest.fn().mockResolvedValue({
        exists: true,
        data: jest.fn().mockReturnValue(welcomeUserEntityMock),
      });
      const res = await service.getDocument(collection as FIRESTORE_COLLECTIONS, documentId);
      expect(res).toEqual(welcomeUserEntityMock);
    });

    it('the firestoreDB should return an empty object', async () => {
      service['firestore'].collection(collection).doc(documentId).get = jest.fn().mockResolvedValue({});
      try {
        await service.getDocument(collection as FIRESTORE_COLLECTIONS, documentId);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual('Document not found in DB');
        expect(error.status).toEqual(404);
      }
    });
  });

  describe('saveDocument', () => {
    it('firestoreDb should create an user object', async () => {
      service.getDocument = jest.fn().mockResolvedValue(outputWelcomeMock);
      service['firestore']['collection'] = jest.fn().mockReturnValue({
        doc: jest.fn().mockReturnValue({
          id: documentId,
          create: jest.fn().mockResolvedValue({}),
        }),
      });
      const res = await service.saveDocument(collection as FIRESTORE_COLLECTIONS, {});
      expect(res).toBeDefined();
    });

    it('firestoreDb should throw an FirestoreError already exists', async () => {
      const error = new Error('error') as any;
      error.code = 6;
      service['firestore']['collection'] = jest.fn().mockReturnValue({
        doc: jest.fn().mockReturnValue({
          id: documentId,
          create: jest.fn().mockRejectedValue(error),
        }),
      });
      try {
        await service.saveDocument(collection as FIRESTORE_COLLECTIONS, {});
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual('Document already exists.');
        expect(error.status).toEqual(409);
      }
    });

    it('firestoreDb should throw an InternalServerError', async () => {
      service['firestore']['collection'] = jest.fn().mockReturnValue({
        doc: jest.fn().mockReturnValue({
          id: documentId,
          create: jest.fn().mockRejectedValue(new InternalServerErrorException('internal server error')),
        }),
      });
      try {
        await service.saveDocument(collection as FIRESTORE_COLLECTIONS, {});
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('internal server error');
        expect(error.status).toEqual(500);
      }
    });
  });

  describe('updateManyDocuments', () => {
    beforeEach(() => {
      service['firestore'].batch = jest.fn().mockReturnValue({
        update: jest.fn(),
        commit: jest.fn().mockResolvedValue({}),
      });
    });
    it('firestoreDb should update 2 documents with filter', async () => {
      const filter = {
        email: 'test@test.fr',
      };
      service['firestore']['collection'] = jest.fn().mockReturnValue({
        doc: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        get: jest.fn().mockResolvedValue([
          {
            id: documentId,
          },
          {
            id: `${documentId}-89`,
          },
        ]),
      });
      expect(await service.updateManyDocuments(collection as FIRESTORE_COLLECTIONS, filter, {})).toBeUndefined();
    });

    it('firestoreDb should throw an error', async () => {
      const filter = {
        email: 'test@test.fr',
      };
      service['firestore']['collection'] = jest.fn().mockReturnValue({
        doc: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        get: jest.fn().mockResolvedValue([
          {
            id: documentId,
          },
          {
            id: `${documentId}-89`,
          },
        ]),
      });
      service['firestore'].batch = jest.fn().mockReturnValue({
        update: jest.fn(),
        commit: jest.fn().mockRejectedValue(new InternalServerErrorException()),
      });
      try {
        await service.updateManyDocuments(collection as FIRESTORE_COLLECTIONS, filter, {});
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('Internal Server Error');
        expect(error.status).toEqual(500);
      }
    });
  });

  describe('getByEmail', () => {
    it('firestoreDb should return an WelcomeUser object', async () => {
      const mockDoc = { data: () => welcomeUserEntityMock };
      const documentsSnapshot: any = {
        size: 1,
        forEach: (callback: (doc: any) => void) => {
          callback(mockDoc);
        },
      };
      service['firestore'].collection(collection).where('email', '==', 'test@test.fr').get = jest
        .fn()
        .mockResolvedValue(documentsSnapshot);
      const res: WelcomeUser = (await service.getByEmail(
        collection as FIRESTORE_COLLECTIONS,
        'test@est.fr',
      )) as WelcomeUser;
      expect(res).toBeDefined();
      expect(res._id).toEqual('16156-585263');
    });

    it('should throw NotFoundException if user not found', async () => {
      const documentsSnapshot = {
        size: 0,
        forEach: jest.fn(),
      };

      service['firestore'].collection(collection).where('email', '==', 'test@test.fr').get = jest
        .fn()
        .mockResolvedValue(documentsSnapshot as any);

      try {
        await service.getByEmail('collection' as FIRESTORE_COLLECTIONS, 'test@example.com');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual('User not found in DB');
        expect(error.status).toEqual(404);
      }
    });

    it('should throw HttpException if multiple users found', async () => {
      const documentsSnapshot = {
        size: 2,
        forEach: jest.fn(),
      };

      service['firestore'].collection(collection).where('email', '==', 'test@test.fr').get = jest
        .fn()
        .mockResolvedValue(documentsSnapshot as any);

      try {
        await service.getByEmail('collection' as FIRESTORE_COLLECTIONS, 'test@example.com');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual('Multiple users found');
        expect(error.status).toEqual(400);
      }
    });
  });
});
