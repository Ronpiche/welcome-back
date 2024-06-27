import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { FirestoreModule } from '@modules/shared/firestore/firestore.module';
import { AuthorizationModule } from '@modules/authorization/authorization.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessGuard } from './middleware/AuthGuard';
import { WelcomeModule } from '@modules/welcome/welcome.module';
import { JwtCognito } from './modules/cognito/jwtCognito.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      global: true,
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '2h', algorithm: 'HS256' },
      }),
    }),
    FirestoreModule,
    AuthorizationModule,
    WelcomeModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessGuard,
    },
    JwtCognito,
  ],
})
export class AppModule {}
