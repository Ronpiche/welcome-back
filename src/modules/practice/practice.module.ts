import { PracticeController } from "@modules/practice/practice.controller";
import { PracticeService } from "@modules/practice/practice.service";
import { Logger, Module } from "@nestjs/common";
import { FirestoreModule } from "@src/services/firestore/firestore.module";

@Module({
  imports: [FirestoreModule],
  controllers: [PracticeController],
  providers: [Logger, PracticeService],
})

export class PracticeModule { }