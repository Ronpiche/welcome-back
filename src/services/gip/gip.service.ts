import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FirebaseConfig, FIRESTORE_COLLECTIONS } from "@src/configs/types/Firestore.types";
import {
  AuthentificationUserOutputDto,
  GipUser,
} from "@src/modules/authentification/dto/output/authentificationUserOutput.dto";
import { WelcomeUserDto } from "@src/modules/welcome/dto/output/welcome-user.dto";
import { FirestoreService } from "@src/services/firestore/firestore.service";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

@Injectable()
export class GipService {
  private readonly app: FirebaseApp;

  private readonly auth: Auth;

  private readonly firebaseConfig: FirebaseConfig;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
    private readonly firestoreService: FirestoreService,
  ) {
    this.firebaseConfig = {
      apiKey: this.configService.get("API_KEY"),
      authDomain: this.configService.get("AUTH_DOMAIN"),
    };
    this.app = initializeApp(this.firebaseConfig);
    this.auth = getAuth(this.app);
  }

  async signInGIP(email: string, password: string): Promise<AuthentificationUserOutputDto> {
    try {
      await this.auth.authStateReady();
      const promises = [
        signInWithEmailAndPassword(this.auth, email, password),
        this.firestoreService.getByEmail(FIRESTORE_COLLECTIONS.WELCOME_USERS, email),
      ];
      const results = await Promise.allSettled(promises);
      let gipUser: GipUser;
      let welcomeUser: WelcomeUserDto;
      for (const res of results) {
        if (res.status === "rejected") {
          throw res.reason;
        } else if ("user" in res.value) {
          gipUser = plainToInstance(GipUser, res.value.user, { excludeExtraneousValues: true });
        } else {
          welcomeUser = plainToInstance(WelcomeUserDto, instanceToPlain(res.value), {
            excludeExtraneousValues: true,
          });
        }
      }
      return { gipUser, welcomeUser };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async signUpGIP(email: string, password: string): Promise<void> {
    try {
      await this.auth.authStateReady();
      await this.firestoreService.getByEmail(FIRESTORE_COLLECTIONS.WELCOME_USERS, email);
      await createUserWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }
}