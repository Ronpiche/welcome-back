import { Module } from "@nestjs/common";
import { MembersService } from "./members.service";
import { MembersController } from "./members.controller";
import { FirestoreModule } from "@src/services/firestore/firestore.module";

@Module({
  controllers: [MembersController],
  providers: [MembersService],
  imports: [FirestoreModule],
})
export class MembersModule {}