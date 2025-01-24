import { Logger, Module } from "@nestjs/common";
import { FirestoreService } from "@src/services/firestore/firestore.service";
import { Firestore } from "@google-cloud/firestore";

@Module({
  providers: [
    FirestoreService,
    Logger,
    {
      provide: Firestore,
      useFactory: (): Firestore => new Firestore(),
    },
  ],
  exports: [FirestoreService],
})

export class FirestoreModule {}