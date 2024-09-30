import { SetMetadata } from "@nestjs/common";

export const IsPublic = (args: boolean) => SetMetadata("public", args);