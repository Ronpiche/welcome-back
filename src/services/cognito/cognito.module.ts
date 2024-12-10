import { Global, Logger, Module } from "@nestjs/common";
import { CognitoService } from "@src/services/cognito/cognito.service";

@Global()
@Module({
  providers: [
    CognitoService,
    Logger,
  ],
  exports: [CognitoService],
})
export class CognitoModule { }