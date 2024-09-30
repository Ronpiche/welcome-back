import { Logger, Module } from "@nestjs/common";
import { FirestoreService } from "./firestore.service";
import { Firestore } from "@google-cloud/firestore";
@Module({
  providers: [
    FirestoreService,
    Logger,
    {
      provide: Firestore,
      useFactory: () => {
        const base64EncodedServiceAccount = process.env.SERVICE_ACCOUNT_BASE64;
        const decodedServiceAccount = Buffer.from(base64EncodedServiceAccount, "base64").toString("utf-8");
        const credentials: any = JSON.parse(decodedServiceAccount);

        const { project_id, private_key, client_email } = credentials;

        return new Firestore({
          projectId: project_id,
          ssl: true,
          credentials: {
            client_email,
            private_key,
          },
        });
      },
    },
  ],
  exports: [FirestoreService],
})
export class FirestoreModule {}