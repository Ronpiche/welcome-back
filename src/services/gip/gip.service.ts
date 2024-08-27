import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FirebaseConfig } from '@src/configs/types/Firestore.types';
import { FirebaseApp, initializeApp } from 'firebase/app';
import {
  Auth,
  UserCredential,
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';

@Injectable()
export class GipService {
  private app: FirebaseApp;
  private auth: Auth;
  private firebaseConfig: FirebaseConfig;
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {
    this.firebaseConfig = {
      apiKey: this.configService.get('API_KEY'),
      authDomain: this.configService.get('AUTH_DOMAIN'),
    };
    this.app = initializeApp(this.firebaseConfig);
    this.auth = getAuth(this.app);
  }

  async signInGIP(email: string, password: string): Promise<UserCredential> {
    try {
      await this.auth.authStateReady();
      return await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      this.logger.error(error.message);
      throw new UnauthorizedException(error.message);
    }
  }

  async signUpGIP(email: string, password: string): Promise<UserCredential> {
    try {
      await this.auth.authStateReady();
      return await createUserWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      this.logger.error(error.message);
      throw new BadRequestException(error.message);
    }
  }
}
