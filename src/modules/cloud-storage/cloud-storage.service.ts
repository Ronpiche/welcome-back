import { Storage } from "@google-cloud/storage";
import { BadRequestException, Injectable } from "@nestjs/common";
import { getImageFullExtension } from "./cloud-storage.helper";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class CloudStorageService {
  private readonly storage: Storage;

  private readonly bucket: string;

  constructor(private readonly config: ConfigService) {
    this.storage = new Storage();
    this.bucket = config.get("NAME_BUCKET_STATIC_CONTENT");
  }

  async getContent(filename: string): Promise<Buffer> {
    try {
      const file = this.storage.bucket(this.bucket).file(filename);
      const [fileContent] = await file.download();

      return fileContent;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  getExtension(filename: string): string {
    const filenameSplit: string[] = filename.split(".");

    return getImageFullExtension(filenameSplit[1]);
  }
}