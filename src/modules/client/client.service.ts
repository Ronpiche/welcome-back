import { Injectable } from "@nestjs/common";
import { instanceToPlain } from "class-transformer";
import { CreateClientDto } from "@modules/client/dto/create-client.dto";
import { UpdateClientDto } from "@modules/client/dto/update-client.dto";
import { Client } from "@modules/client/entities/client.entity";
import { FirestoreService } from "@src/services/firestore/firestore.service";
import { FIRESTORE_COLLECTIONS } from "@src/configs/types/Firestore.types";

@Injectable()
export class ClientService {
  public constructor(private readonly firestoreService: FirestoreService) {}

  public async create(createClientDto: CreateClientDto): Promise<Client> {
    return this.firestoreService.saveDocument(FIRESTORE_COLLECTIONS.CLIENTS, instanceToPlain(createClientDto));
  }

  public async findAll(): Promise<Client[]> {
    return this.firestoreService.getAllDocuments<Client>(FIRESTORE_COLLECTIONS.CLIENTS);
  }

  public async findOne(id: string): Promise<Client> {
    return this.firestoreService.getDocument<Client>(FIRESTORE_COLLECTIONS.CLIENTS, id);
  }

  public async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
    await this.findOne(id);

    return this.firestoreService.updateDocument(FIRESTORE_COLLECTIONS.CLIENTS, id, instanceToPlain(updateClientDto));
  }

  public async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.firestoreService.deleteDocument(FIRESTORE_COLLECTIONS.CLIENTS, id);
  }
}