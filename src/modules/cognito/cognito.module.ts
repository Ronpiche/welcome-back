import { Logger, Module } from '@nestjs/common';
import { FirestoreModule } from '@src/services/firestore/firestore.module';
import { JwtCognito } from './jwtCognito.service';

@Module({
  imports: [FirestoreModule],
  providers: [Logger, JwtCognito],
  controllers: [],
})
export class CognitoModule {}
