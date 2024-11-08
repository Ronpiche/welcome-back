import { Injectable } from "@nestjs/common";
import { CreateAgencyDto } from "@modules/agencies/dto/create-agency.dto";
import { UpdateAgencyDto } from "@modules/agencies/dto/update-agency.dto";
import { instanceToPlain } from "class-transformer";
import { FirestoreService } from "@src/services/firestore/firestore.service";
import { Agency } from "@modules/agencies/entities/agency.entity";
import { FIRESTORE_COLLECTIONS } from "@src/configs/types/Firestore.types";

@Injectable()
export class AgenciesService {
  public constructor(private readonly firestoreService: FirestoreService) {}

  public async create(createAgencyDto: CreateAgencyDto): Promise<Agency> {
    return this.firestoreService.saveDocument(FIRESTORE_COLLECTIONS.WELCOME_AGENCIES, instanceToPlain(createAgencyDto));
  }

  public async createMany(createAgenciesDto: CreateAgencyDto[]): Promise<void> {
    await Promise.all(createAgenciesDto.map(async agency => {
      const newAgency = instanceToPlain(agency);

      return this.firestoreService.saveDocument(FIRESTORE_COLLECTIONS.WELCOME_MEMBERS, newAgency);
    }));
  }

  public async findAll(): Promise<Agency[]> {
    return this.firestoreService.getAllDocuments(FIRESTORE_COLLECTIONS.WELCOME_AGENCIES);
  }

  public async update(id: string, updateAgencyDto: UpdateAgencyDto): Promise<Agency> {
    return this.firestoreService.updateDocument(FIRESTORE_COLLECTIONS.WELCOME_AGENCIES, id, instanceToPlain(updateAgencyDto));
  }

  public async remove(id: string): Promise<void> {
    await this.firestoreService.deleteDocument(FIRESTORE_COLLECTIONS.WELCOME_AGENCIES, id);
  }
}