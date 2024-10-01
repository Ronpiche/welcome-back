import { Module } from "@nestjs/common";
import { CloudStorageService } from "./cloud-storage.service";
import { CloudStorageController } from "./cloud-storage.controller";
import { ConfigService } from "@nestjs/config";

@Module({
  controllers: [CloudStorageController],
  providers: [CloudStorageService, ConfigService],
})
export class CloudStorageModule {}