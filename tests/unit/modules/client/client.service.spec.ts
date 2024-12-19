import { InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { NoErrorThrownError, getError } from "@tests/unit/utils";
import { ClientService } from "@modules/client/client.service";
import { FirestoreService } from "@src/services/firestore/firestore.service";
import { createFakeCreateClientDto } from "@tests/unit/factories/dtos/create-client.dto.factory";
import { createFakeClient } from "@tests/unit/factories/entities/client.entity.factory";

const client = createFakeClient();
const createClientDto = createFakeCreateClientDto();

describe("ClientService", () => {
  let service: ClientService;

  beforeEach(async() => {
    const module = await Test.createTestingModule({
      providers: [
        ClientService,
        {
          provide: FirestoreService,
          useValue: {
            getAllDocuments: jest.fn().mockResolvedValue([client]),
            getDocument: jest.fn().mockResolvedValue(client),
            saveDocument: jest.fn().mockResolvedValue(client),
            updateDocument: jest.fn().mockResolvedValue(client),
            deleteDocument: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<ClientService>(ClientService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("create", () => {
    it("should create a client when create is called.", async() => {
      const create = await service.create(createClientDto);
      expect(create).toStrictEqual(client);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestoreService"], "saveDocument").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.create(createClientDto));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe("findAll", () => {
    it("should return a client array when findAll is called.", async() => {
      const findAll = await service.findAll();
      expect(findAll).toStrictEqual([client]);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestoreService"], "getAllDocuments").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.findAll());
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe("findOne", () => {
    it("should return a client when findOne is called.", async() => {
      const findOne = await service.findOne(client._id);
      expect(findOne).toStrictEqual(client);
    });

    it("should throw a NotFound when client does not exists.", async() => {
      jest.spyOn(service["firestoreService"], "getDocument").mockImplementation().mockRejectedValue(new NotFoundException());
      const error: InternalServerErrorException = await getError(async() => service.findOne(client._id));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(NotFoundException);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestoreService"], "getDocument").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.findOne(client._id));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe("remove", () => {
    it("should delete a client when remove is called.", async() => {
      const spy = jest.spyOn(service["firestoreService"], "deleteDocument");
      await service.remove(client._id);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestoreService"], "deleteDocument").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.remove(client._id));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });

  describe("update", () => {
    it("should update a client when update is called.", async() => {
      const update = await service.update(client._id, createClientDto);
      expect(update).toStrictEqual(client);
    });

    it("should throw an InternalServerError when database fails.", async() => {
      jest.spyOn(service["firestoreService"], "updateDocument").mockImplementation().mockRejectedValue(new InternalServerErrorException());
      const error: InternalServerErrorException = await getError(async() => service.update(client._id, createClientDto));
      expect(error).not.toBeInstanceOf(NoErrorThrownError);
      expect(error).toBeInstanceOf(InternalServerErrorException);
    });
  });
});