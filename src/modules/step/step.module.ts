import { Logger, Module } from '@nestjs/common';
import { StepService } from './step.service';
import { StepController } from './step.controller';
import { FirestoreModule } from '@src/services/firestore/firestore.module';
import { JwtCognito } from '../cognito/jwtCognito.service';

@Module({
  imports: [FirestoreModule],
  controllers: [StepController],
  providers: [Logger, StepService, JwtCognito],
})
export class StepModule {}
