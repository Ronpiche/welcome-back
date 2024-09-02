import { Test, TestingModule } from '@nestjs/testing';
import { MembersService } from '@src/modules/members/members.service';
import { FirestoreService } from '@src/services/firestore/firestore.service';
import { FirestoreServiceMock } from '@test/unit/__mocks__/firestore.service';
import { createMemberMock, MemberMock } from '@test/unit/__mocks__/members/members.entity.mock';

describe('MembersService', () => {
  let service: MembersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembersService,
        {
          provide: FirestoreService,
          useClass: FirestoreServiceMock,
        },
      ],
    }).compile();

    service = module.get<MembersService>(MembersService);
  });

  describe('create', () => {
    it('should create a member', async () => {
      service['firestoreService']['saveDocument'] = jest.fn().mockResolvedValue(MemberMock);
      const create = await service.create(createMemberMock);
      expect(create).toBeDefined();
      expect(create).toEqual(MemberMock);
    });
  });

  describe('createMany', () => {
    it('should create many members', async () => {
      const create = await service.createMany([createMemberMock]);
      expect(create).toBeUndefined();
    });
  });

  describe('findAll', () => {
    it('should return a Member array', async () => {
      service['firestoreService']['getAllDocuments'] = jest.fn().mockResolvedValue([MemberMock]);
      const users = await service.findAll();
      expect(users).toEqual([MemberMock]);
    });
  });

  describe('update', () => {
    it('should update a member', async () => {
      const documentId = '789QSD123';
      service['firestoreService']['updateDocument'] = jest.fn().mockResolvedValue(MemberMock);
      const updated = await service.update(documentId, createMemberMock);
      expect(updated).toBeDefined();
      expect(updated).toEqual(MemberMock);
    });
  });

  describe('remove', () => {
    it('should remove a member', async () => {
      const documentId = '789QSD123';
      service['firestoreService']['deleteDocument'] = jest.fn().mockResolvedValue(undefined);
      const res = await service.remove(documentId);
      expect(res).toBeUndefined();
    });
  });
});
