import { Injectable } from "@nestjs/common";
import { CreateMemberDto } from "@modules/members/dto/create-member.dto";
import { UpdateMemberDto } from "@modules/members/dto/update-member.dto";
import { FirestoreService } from "@src/services/firestore/firestore.service";
import { instanceToPlain } from "class-transformer";
import { FIRESTORE_COLLECTIONS } from "@src/configs/types/Firestore.types";
import { Member } from "@modules/members/entities/member.entity";

@Injectable()
export class MembersService {
  public constructor(private readonly firestoreService: FirestoreService) { }

  public async create(createMemberDto: CreateMemberDto): Promise<Member> {
    const member = instanceToPlain(createMemberDto);

    return this.firestoreService.saveDocument(FIRESTORE_COLLECTIONS.WELCOME_MEMBERS, member);
  }

  public async createMany(createMemberDto: CreateMemberDto[]): Promise<void> {
    await Promise.all(createMemberDto.map(async member => {
      const newMember = instanceToPlain(member);

      return this.firestoreService.saveDocument(FIRESTORE_COLLECTIONS.WELCOME_MEMBERS, newMember);
    }));
  }

  public async findAll(): Promise<Member[]> {
    return this.firestoreService.getAllDocuments(FIRESTORE_COLLECTIONS.WELCOME_MEMBERS);
  }

  public async update(id: string, updateMemberDto: UpdateMemberDto): Promise<Member> {
    const updatedMember = instanceToPlain(updateMemberDto);

    return this.firestoreService.updateDocument(FIRESTORE_COLLECTIONS.WELCOME_MEMBERS, id, updatedMember);
  }

  public async remove(id: string): Promise<void> {
    await this.firestoreService.deleteDocument(FIRESTORE_COLLECTIONS.WELCOME_MEMBERS, id);
  }
}