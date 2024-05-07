/* eslint-disable @typescript-eslint/no-unused-vars */
import { Filter } from '@google-cloud/firestore';
import { RoleDto } from '@modules/authorization/dto/authorization.dto';

export class FirestoreServiceMock {
  getAllDocuments = jest.fn(async (collection: string, filter?: Filter) => {
    return [];
  });

  getDocument = jest.fn(async (collection: string, documentId: string) => {
    return null;
  });

  saveDocument = jest.fn(async (collection: string, data: Record<string, unknown> | RoleDto) => {
    return { status: 'OK', id: 'mockedId' };
  });

  updateDocument = jest.fn(async (collection: string, documentId: string, data: RoleDto | Record<string, unknown>) => {
    return;
  });

  deleteDocument = jest.fn(async (collection: string, documentId: string) => {
    return;
  });

  updateManyDocuments = jest.fn(async (collection: string, filter: Filter, data: Record<string, unknown>) => {
    return;
  });
}

export const mockMicrosoftService = {
  getUsers: jest.fn(),
  getUserByEmail: jest.fn(),
  getUserById: jest.fn(),
};
