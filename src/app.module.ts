import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AccessGuard } from './middleware/AuthGuard';


@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      privateKey: { key: process.env.PV_KEY, passphrase: process.env.PF_KEY },
      signOptions: { expiresIn: '2h' },
      publicKey: process.env.PB_KEY
    }),
    AuthModule
  ],
  providers: [{
    provide: APP_GUARD,
    useClass: AccessGuard,
  }]
})
export class AppModule { }
