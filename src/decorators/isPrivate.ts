import { SetMetadata } from '@nestjs/common';

export const IsPrivate = () => SetMetadata('isPublic', false);