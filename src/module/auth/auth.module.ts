import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MsalProvider } from './msalProvider';

@Module({
  controllers: [AuthController],
  providers: [AuthService, MsalProvider]
})
export class AuthModule { }
