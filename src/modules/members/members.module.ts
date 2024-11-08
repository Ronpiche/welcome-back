import { Module } from "@nestjs/common";
import { MembersService } from "@modules/members/members.service";
import { MembersController } from "@modules/members/members.controller";
import { FirestoreModule } from "@src/services/firestore/firestore.module";

@Module({
  controllers: [MembersController],
  providers: [MembersService],
  imports: [FirestoreModule],
})
export class MembersModule {}