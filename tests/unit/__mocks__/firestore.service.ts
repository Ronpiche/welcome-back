/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Filter } from "@google-cloud/firestore";

export class FirestoreServiceMock {
  getAllDocuments = jest.fn(async(collection: string, filter?: Filter) => [
    {
      _id: "mockedId",
    },
  ]);

  getDocument = jest.fn(async(collection: string, documentId: string) => ({
    _id: "mockedId",
  }));

  saveDocument = jest.fn(async(collection: string, data: Record<string, unknown>) => ({
    _id: "mockedId",
  }));

  updateDocument = jest.fn(async(collection: string, documentId: string, data: Record<string, unknown>) => ({
    _id: "mockedId",
  }));

  deleteDocument = jest.fn(async(collection: string, documentId: string) => {
    
  });

  updateManyDocuments = jest.fn(async(collection: string, filter: Filter, data: Record<string, unknown>) => {
    
  });

  transformToObjectAndSaveProperty = jest.fn().mockResolvedValue([]);

  getByEmail = jest.fn().mockResolvedValue({});
}

export const mockMicrosoftService = {
  getUsers: jest.fn(),
  getUserByEmail: jest.fn(),
  getUserById: jest.fn(),
};