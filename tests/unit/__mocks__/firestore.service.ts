/* eslint-disable @typescript-eslint/no-unused-vars */
import { Filter } from '@google-cloud/firestore';
import { RoleDto } from '@modules/authorization/dto/authorization.dto';

export class FirestoreServiceMock {
  getAllDocuments = jest.fn(async (collection: string, filter?: Filter) => {
    return [
      {
        _id: 'mockedId',
      },
    ];
  });

  getDocument = jest.fn(async (collection: string, documentId: string) => {
    return {
      _id: 'mockedId',
    };
  });

  saveDocument = jest.fn(async (collection: string, data: Record<string, unknown> | RoleDto) => {
    return {
      _id: 'mockedId',
    };
  });

  updateDocument = jest.fn(async (collection: string, documentId: string, data: RoleDto | Record<string, unknown>) => {
    return {
      _id: 'mockedId',
    };
  });

  deleteDocument = jest.fn(async (collection: string, documentId: string) => {
    return;
  });

  updateManyDocuments = jest.fn(async (collection: string, filter: Filter, data: Record<string, unknown>) => {
    return;
  });

  transformToObjectAndSaveProperty = jest.fn().mockResolvedValue([]);

  getByEmail = jest.fn().mockResolvedValue({});
}

export const mockMicrosoftService = {
  getUsers: jest.fn(),
  getUserByEmail: jest.fn(),
  getUserById: jest.fn(),
};
