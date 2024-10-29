import { SetMetadata } from "@nestjs/common";
import type { CustomDecorator } from "@nestjs/common";

export const IS_PUBLIC_METADATA_SYMBOL = "isPublic";

export const IsPublic = (args: boolean): CustomDecorator => SetMetadata(IS_PUBLIC_METADATA_SYMBOL, args);