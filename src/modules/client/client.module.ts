import { Logger, Module } from "@nestjs/common";
import { ClientController } from "@modules/client/client.controller";
import { ClientService } from "@modules/client/client.service";
import { FirestoreModule } from "@src/services/firestore/firestore.module";

@Module({
  imports: [FirestoreModule],
  controllers: [ClientController],
  providers: [Logger, ClientService],
})

export class ClientModule { }