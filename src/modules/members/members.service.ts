import { Injectable } from "@nestjs/common";
import { CreateMemberDto } from "@src/modules/members/dto/create-member.dto";
import { UpdateMemberDto } from "@src/modules/members/dto/update-member.dto";
import { FirestoreService } from "@src/services/firestore/firestore.service";
import { instanceToPlain } from "class-transformer";
import { v4 as uuidv4 } from "uuid";
import { FIRESTORE_COLLECTIONS } from "@src/configs/types/Firestore.types";
import { Member } from "@src/modules/members/entities/member.entity";

@Injectable()
export class MembersService {
  constructor(private readonly firestoreService: FirestoreService) {}

  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    const memberDto: Record<string, any> = instanceToPlain(createMemberDto);
    memberDto._id = uuidv4();

    return this.firestoreService.saveDocument(FIRESTORE_COLLECTIONS.WELCOME_MEMBERS, memberDto);
  }

  async createMany(createMemberDto: CreateMemberDto[]): Promise<void> {
    const membersDto = instanceToPlain(createMemberDto);
    membersDto.map(async(member: any) => {
      const memberDto: Record<string, any> = instanceToPlain(member);
      memberDto._id = uuidv4();
      await this.firestoreService.saveDocument(FIRESTORE_COLLECTIONS.WELCOME_MEMBERS, memberDto);
    });
  }

  async findAll(): Promise<Member[]> {
    return this.firestoreService.getAllDocuments(FIRESTORE_COLLECTIONS.WELCOME_MEMBERS);
  }

  async update(id: string, updateMemberDto: UpdateMemberDto): Promise<Member> {
    const updatedMember: Record<string, any> = instanceToPlain(updateMemberDto);

    return this.firestoreService.updateDocument(FIRESTORE_COLLECTIONS.WELCOME_MEMBERS, id, updatedMember);
  }

  async remove(id: string): Promise<void> {
    await this.firestoreService.deleteDocument(FIRESTORE_COLLECTIONS.WELCOME_MEMBERS, id);
  }
}