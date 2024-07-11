import { Module, Logger } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { FirestoreModule } from '../shared/firestore/firestore.module';
import { JwtCognito } from '../cognito/jwtCognito.service';

@Module({
  imports: [FirestoreModule],
  controllers: [EmailController],
  providers: [Logger, EmailService, JwtCognito],
})
export class EmailModule {}
