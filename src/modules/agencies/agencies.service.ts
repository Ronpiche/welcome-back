import { Injectable } from "@nestjs/common";
import { CreateAgencyDto } from "./dto/create-agency.dto";
import { UpdateAgencyDto } from "./dto/update-agency.dto";
import { instanceToPlain } from "class-transformer";
import { FirestoreService } from "@src/services/firestore/firestore.service";
import { Agency } from "./entities/agency.entity";
import { FIRESTORE_COLLECTIONS } from "@src/configs/types/Firestore.types";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class AgenciesService {
  constructor(private readonly firestoreService: FirestoreService) {}

  async create(createAgencyDto: CreateAgencyDto): Promise<Agency> {
    const agencyDto: Record<string, any> = instanceToPlain(createAgencyDto);
    agencyDto._id = uuidv4();

    return this.firestoreService.saveDocument(FIRESTORE_COLLECTIONS.WELCOME_AGENCIES, agencyDto);
  }

  async createMany(createAgenciesDto: CreateAgencyDto[]): Promise<void> {
    const agenciesDto = instanceToPlain(createAgenciesDto);
    agenciesDto.map(async agency => {
      const agencyDto: Record<string, any> = instanceToPlain(agency);
      agencyDto._id = uuidv4();
      await this.firestoreService.saveDocument(FIRESTORE_COLLECTIONS.WELCOME_AGENCIES, agencyDto);
    });
  }

  async findAll(): Promise<Agency[]> {
    return this.firestoreService.getAllDocuments(FIRESTORE_COLLECTIONS.WELCOME_AGENCIES);
  }

  async update(id: string, updateAgencyDto: UpdateAgencyDto): Promise<Agency> {
    const updatedAgency: Record<string, any> = instanceToPlain(updateAgencyDto);

    return this.firestoreService.updateDocument(FIRESTORE_COLLECTIONS.WELCOME_AGENCIES, id, updatedAgency);
  }

  async remove(id: string): Promise<void> {
    await this.firestoreService.deleteDocument(FIRESTORE_COLLECTIONS.WELCOME_AGENCIES, id);
  }
}