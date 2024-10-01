import { Module } from "@nestjs/common";
import { ContentService } from "./content.service";
import { ContentController } from "./content.controller";
import { FirestoreModule } from "@src/services/firestore/firestore.module";

@Module({
  controllers: [ContentController],
  providers: [ContentService],
  imports: [FirestoreModule],
})
export class ContentModule {}