import { Global, Logger, Module } from "@nestjs/common";
import { initializeApp } from "firebase-admin/app";
import { Auth, getAuth } from "firebase-admin/auth";
import { GipService } from "@src/services/gip/gip.service";

@Global()
@Module({
  providers: [
    GipService,
    {
      provide: Auth,
      useFactory: (): Auth => getAuth(initializeApp()),
    },
    Logger,
  ],
  exports: [GipService],
})
export class GipModule {}