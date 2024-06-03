import { Firestore } from '@google-cloud/firestore';
import { FIRESTORE_COLLECTIONS } from '@modules/shared/firestore/constants';
import { FirestoreService } from '@modules/shared/firestore/firestore.service';
import { HttpException, InternalServerErrorException, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { welcomeUserEntityMock } from '../../../unit/__mocks__/welcome/User.entity.mock';

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
    collection = FIRESTORE_COLLECTIONS.welcomeUsers;
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
      const res = await service.getAllDocuments(collection);
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
      const res = await service.getAllDocuments(collection, {});
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
      const res = await service.getAllDocuments(collection, filter);
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
      const res = await service.getAllDocuments(collection, filter);
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
      const res = await service.getDocument(collection, documentId);
      expect(res).toEqual(welcomeUserEntityMock);
    });

    it('the firestoreDB should return an empty object', async () => {
      service['firestore'].collection(collection).doc(documentId).get = jest.fn().mockResolvedValue({});
      try {
        await service.getDocument(collection, documentId);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual('Document not found in DB');
        expect(error.status).toEqual(404);
      }
    });
  });

  describe('saveDocucment', () => {
    it('firestoreDb should create an user object', async () => {
      service['firestore']['collection'] = jest.fn().mockReturnValue({
        doc: jest.fn().mockReturnValue({
          id: documentId,
          create: jest.fn().mockResolvedValue({}),
        }),
      });
      const res = await service.saveDocument(collection, {});
      expect(res.id).toEqual(documentId);
      expect(res.status).toEqual('OK');
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
        await service.saveDocument(collection, {});
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
        await service.saveDocument(collection, {});
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
      expect(await service.updateManyDocuments(collection, filter, {})).toBeUndefined();
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
        await service.updateManyDocuments(collection, filter, {});
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('Internal Server Error');
        expect(error.status).toEqual(500);
      }
    });
  });
});
