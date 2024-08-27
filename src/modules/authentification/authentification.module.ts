import { Logger, Module } from '@nestjs/common';
import { AuthentificationService } from './authentification.service';
import { AuthentificationController } from './authentification.controller';
import { GipService } from '../../services/gip/gip.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [AuthentificationController],
  providers: [AuthentificationService, GipService, ConfigService, Logger],
})
export class AuthentificationModule {}
