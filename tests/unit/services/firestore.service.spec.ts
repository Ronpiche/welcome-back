import { ConflictException, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { Filter, Firestore } from "@google-cloud/firestore";
import type { DocumentReference, DocumentSnapshot, QueryDocumentSnapshot } from "@google-cloud/firestore";
import { FirestoreErrorCode } from "@src/configs/types/Firestore.types";
import type { FIRESTORE_COLLECTIONS } from "@src/configs/types/Firestore.types";
import { FirestoreService } from "@src/services/firestore/firestore.service";
import { NoErrorThrownError, getError } from "@tests/unit/utils";

const collection = "tests" as FIRESTORE_COLLECTIONS;
const documents = [
  { _id: "1", test: "a" },
  { _id: "2", test: "b" },
];

describe("FirestoreService", () => {
  let service: FirestoreService;

  beforeEach(async() => {
    const module = await Test.createTestingModule({
      providers: [
        FirestoreService,
        {
          provide: Firestore,
          useValue: {
            batch: jest.fn().mockReturnValue({
              commit: jest.fn().mockResolvedValue(undefined),
              update: jest.fn().mockReturnThis(),
            }),
            collection: jest.fn().mockReturnValue({
              doc: jest.fn().mockReturnValue({
                get: jest.fn().mockResolvedValue({
                  exists: true,
                  data: jest.fn().mockReturnValue(documents[0]),
                }),
                create: jest.fn().mockResolvedValue(undefined),
                update: jest.fn().mockResolvedValue(undefined),
                delete: jest.fn().mockResolvedValue(undefined),
              }),
              get: jest.fn().mockResolvedValue({
                forEach: jest.fn().mockImplementation((callback: (doc: Partial<QueryDocumentSnapshot>) => void) => documents.map(d => callback({ data: jest.fn().mockReturnValue(d) }))),
              }),
              where: jest.fn().mockReturnThis(),
              add: jest.fn().mockResolvedValue(documents[0]._id),
            }),
            recursiveDelete: jest.fn(),
          },
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

    service = module.get<FirestoreService>(FirestoreService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("getDoc", () => {
    it("should return a document reference when getDoc is called.", () => {
      const docId = "1";
      const docRef = {} as DocumentReference;
      const spy = jest.spyOn(service["firestore"].collection(collection), "doc").mockReturnValue(docRef);
      const getDoc = service.getDoc(collection, docId);
      expect(spy).toHaveBeenCalledWith(docId);
      expect(getDoc).toBe(docRef);
    });
  });

  describe("getAllDocuments", () => {
    it("should return an array when no filters.", async() => {
      const getAllDocuments = await service.getAllDocuments(collection);
      expect(getAllDocuments).toStrictEqual(documents);
    });

    it("should return an array when filters.", async() => {
      const getAllDocuments = await service.getAllDocuments(collection, Filter.where("_id", ">", 0));
      expect(getAllDocuments).toStrictEqual(documents);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestore"].collection(collection), "get").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.getAllDocuments(collection));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe("getDocument", () => {
    it("should return not found when documentId exists.", async() => {
      const getDocument = await service.getDocument(collection, "1");
      expect(getDocument).toStrictEqual(documents[0]);
    });

    it("should return not found when documentId does not exists.", async() => {
      jest.spyOn(service["firestore"].collection(collection).doc(documents[0]._id), "get").mockImplementation().mockResolvedValue({ exists: false } as DocumentSnapshot);
      const error: NotFoundException = await getError(async() => service.getDocument(collection, documents[0]._id));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(NotFoundException);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestore"].collection(collection).doc(documents[0]._id), "get").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.getDocument(collection, documents[0]._id));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe("saveDocument", () => {
    it("should create when saveDocument called (with _id field).", async() => {
      const saveDocument = await service.saveDocument(collection, documents[0]);
      expect(saveDocument).toStrictEqual(documents[0]);
    });

    it("should create when saveDocument called (without _id field).", async() => {
      const saveDocument = await service.saveDocument(collection, { test: documents[0].test });
      expect(saveDocument).toStrictEqual(documents[0]);
    });

    it("should throw a ConflictException when document already exists.", async() => {
      jest.spyOn(service["firestore"].collection(collection).doc(documents[0]._id), "create").mockImplementation().mockRejectedValue(Object.assign(new Error(), { code: FirestoreErrorCode.ALREADY_EXISTS }));
      const error: ConflictException = await getError(async() => service.saveDocument(collection, documents[0]));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(ConflictException);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestore"].collection(collection).doc(documents[0]._id), "create").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.saveDocument(collection, documents[0]));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe("updateDocument", () => {
    it("should update when updateDocument is called.", async() => {
      const updateDocument = await service.updateDocument(collection, documents[0]._id, documents[0]);
      expect(updateDocument).toStrictEqual(documents[0]);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestore"].collection(collection).doc(documents[0]._id), "update").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.updateDocument(collection, documents[0]._id, documents[0]));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe("deleteDocument", () => {
    it("should delete when deleteDocument is called.", async() => {
      const spy = jest.spyOn(service["firestore"].collection(collection).doc(documents[0]._id), "delete");
      await service.deleteDocument(collection, documents[0]._id);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestore"].collection(collection).doc(documents[0]._id), "delete").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.deleteDocument(collection, documents[0]._id));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe("deleteRecursive", () => {
    it("should delete when deleteRecursive is called.", async() => {
      const spy = jest.spyOn(service["firestore"], "recursiveDelete");
      await service.deleteRecursive({} as DocumentReference);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestore"], "recursiveDelete").mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.deleteRecursive({} as DocumentReference));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe("updateManyDocuments", () => {
    it("should update many documents when updateManyDocuments is called.", async() => {
      const spy = jest.spyOn(service["firestore"].batch(), "update");
      await service.updateManyDocuments(collection, { test: "1" }, { test: "2" });
      expect(spy).toHaveBeenCalledTimes(documents.length);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestore"].collection(collection), "get").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.updateManyDocuments(collection, { test: "1" }, { test: "2" }));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });
});