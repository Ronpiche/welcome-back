import { Logger, Module } from '@nestjs/common';
import { CacheService } from '@modules/shared/cache/cache.service';
import { MicrosoftController } from './microsoft.controller';
import { MicrosoftService } from './microsoft.service';

@Module({
  imports: [],
  controllers: [MicrosoftController],
  providers: [MicrosoftService, Logger, CacheService],
})
export class MicrosoftModule {}
