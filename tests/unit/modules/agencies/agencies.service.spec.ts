import { Test, TestingModule } from '@nestjs/testing';
import { AgenciesService } from '@src/modules/agencies/agencies.service';
import { FirestoreService } from '@src/services/firestore/firestore.service';
import { agencyMock, createAgencyMock } from '@tests/unit/__mocks__/agencies/agencies.entity.mock';
import { FirestoreServiceMock } from '@tests/unit/__mocks__/firestore.service';

describe('MembersService', () => {
  let service: AgenciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgenciesService,
        {
          provide: FirestoreService,
          useClass: FirestoreServiceMock,
        },
      ],
    }).compile();

    service = module.get<AgenciesService>(AgenciesService);
  });

  describe('create', () => {
    it('should create a agency', async () => {
      service['firestoreService']['saveDocument'] = jest.fn().mockResolvedValue(agencyMock);
      const create = await service.create(createAgencyMock);
      expect(create).toBeDefined();
      expect(create).toEqual(agencyMock);
    });
  });

  describe('createMany', () => {
    it('should create many agencies', async () => {
      const create = await service.createMany([createAgencyMock]);
      expect(create).toBeUndefined();
    });
  });

  describe('findAll', () => {
    it('should return a agency array', async () => {
      service['firestoreService']['getAllDocuments'] = jest.fn().mockResolvedValue([agencyMock]);
      const users = await service.findAll();
      expect(users).toEqual([agencyMock]);
    });
  });

  describe('update', () => {
    it('should update a agency', async () => {
      const documentId = '789QSD123';
      service['firestoreService']['updateDocument'] = jest.fn().mockResolvedValue(agencyMock);
      const updated = await service.update(documentId, createAgencyMock);
      expect(updated).toBeDefined();
      expect(updated).toEqual(agencyMock);
    });
  });

  describe('remove', () => {
    it('should remove a agency', async () => {
      const documentId = '789QSD123';
      service['firestoreService']['deleteDocument'] = jest.fn().mockResolvedValue(undefined);
      const res = await service.remove(documentId);
      expect(res).toBeUndefined();
    });
  });
});
