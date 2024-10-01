import { Controller, Get, Query, Res, StreamableFile } from "@nestjs/common";
import { CloudStorageService } from "./cloud-storage.service";
import { Response } from "express";
import { IsPublic } from "@src/decorators/isPublic";

@Controller("static-content")
export class CloudStorageController {
  constructor(private readonly cloudStorageService: CloudStorageService) {}

  @Get()
  @IsPublic(true)
  async getFile(
    @Query("filename") filename: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const file = await this.cloudStorageService.getContent(filename);
    res.set("Content-Type", this.cloudStorageService.getExtension(filename));

    return new StreamableFile(file);
  }
}