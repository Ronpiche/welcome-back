// firestore.module.ts

import { Logger, Module } from '@nestjs/common';
import { FirestoreService } from './firestore.service';
import { Firestore } from '@google-cloud/firestore';

@Module({
  providers: [
    FirestoreService,
    Logger,
    {
      provide: Firestore,
      useFactory: () => {
        return new Firestore({
          projectId: process.env.PROJECT_ID,
          credentials: {
            client_email: process.env.PROJECT_CLIENT_EMAIL,
            private_key: process.env.PROJECT_PRIVATE_KEY.replace(/\\n/g, '\n'),
          },
        });
      },
    },
  ],
  exports: [FirestoreService],
})
export class FirestoreModule {}
