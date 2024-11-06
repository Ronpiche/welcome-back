import { Global, Logger, Module } from "@nestjs/common";
import { GipService } from "@src/services/gip/gip.service";
import { initializeApp } from "firebase-admin/app";
import { Auth, getAuth } from "firebase-admin/auth";

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
  controllers: [],
  exports: [GipService],
})
export class GipModule {}