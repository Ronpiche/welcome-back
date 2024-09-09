import { Logger, Module } from '@nestjs/common';
import { AuthentificationService } from './authentification.service';
import { AuthentificationController } from './authentification.controller';
import { GipService } from '../../services/gip/gip.service';
import { ConfigService } from '@nestjs/config';
import { FirestoreService } from '@src/services/firestore/firestore.service';
import { Firestore } from '@google-cloud/firestore';

@Module({
  controllers: [AuthentificationController],
  providers: [AuthentificationService, GipService, ConfigService, Logger, FirestoreService, Firestore],
})
export class AuthentificationModule {}
