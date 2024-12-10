import { Storage } from "@google-cloud/storage";
import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class CloudStorageService {
  private readonly storage: Storage;

  private readonly bucket: string;

  public constructor(private readonly configService: ConfigService) {
    this.storage = new Storage();
    this.bucket = this.configService.get("NAME_BUCKET_STATIC_CONTENT");
  }

  public async getContent(filename: string): Promise<Buffer> {
    try {
      const file = this.storage.bucket(this.bucket).file(filename);
      const [fileContent] = await file.download();

      return fileContent;
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
    }
  }

  public getExtension(filename: string): string {
    const filenameSplit: string[] = filename.split(".");
    const extension = filenameSplit[1];

    return extension === "svg" ? `image/${extension}+xml` : `image/${extension}`;
  }
}