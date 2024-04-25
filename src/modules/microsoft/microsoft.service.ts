import axios, { AxiosRequestConfig } from 'axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AuthError, ClientCredentialRequest, ConfidentialClientApplication, LogLevel } from '@azure/msal-node';
import { CacheService } from '@modules/shared/cache/cache.service';
import MOCK_RESPONSE from '@mocks/data.json';
import { MicrosoftUserDto } from './dto/microsoft.dto';
import { MsUser } from './types/microsoft.types';
import { formatUser, isDaveoUser } from './microsoft.utils';

@Injectable()
export class MicrosoftService {
  private readonly msalInstance: ConfidentialClientApplication;
  private axiosConfig: AxiosRequestConfig;

  constructor(
    private readonly logger: Logger,
    private readonly cacheService: CacheService,
  ) {
    this.msalInstance = new ConfidentialClientApplication({
      auth: {
        clientId: process.env.MS_CLIENT_ID,
        authority: `${process.env.MS_CLOUD_INSTANCE}/${process.env.MS_TENANT_ID}`,
        clientSecret: process.env.MS_CLIENT_SECRET,
      },
      system: {
        loggerOptions: {
          loggerCallback(_, message, __) {
            console.log(message);
          },
          piiLoggingEnabled: false,
          logLevel: LogLevel.Verbose,
        },
      },
    });

    this.setupAxiosConfig();
  }

  private async setupAxiosConfig() {
    try {
      const clientCredentialRequest: ClientCredentialRequest = {
        scopes: [`${process.env.GRAPH_API_ENDPOINT}/.default`],
      };

      let accessToken = '';

      // avoid calling microsoft in development mode
      if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
        accessToken = MOCK_RESPONSE.token.accessToken;
      } else {
        accessToken = (await this.msalInstance.acquireTokenByClientCredential(clientCredentialRequest)).accessToken;
      }

      this.axiosConfig = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          ConsistencyLevel: 'eventual',
        },
      };
    } catch (error: unknown) {
      this.handleAxiosConfigError(error);
    }
  }

  private handleAxiosConfigError(error: unknown) {
    if (error instanceof AuthError) {
      this.logger.error(error);
      throw new HttpException('MSAL authentication error', HttpStatus.INTERNAL_SERVER_ERROR);
    } else {
      this.logger.error(error);
      throw new HttpException('Failed to setup Axios config', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async getAllUsersPages(url: string, result: MsUser[] = []): Promise<MsUser[]> {
    try {
      const cachedUsers = this.cacheService.get(url);

      if (cachedUsers) {
        return cachedUsers as MsUser[];
      }

      const response = await axios.get(url, this.axiosConfig);
      const users: MsUser[] = (response.data.value as MicrosoftUserDto[]).filter(isDaveoUser).map(formatUser);

      result = result.concat(users);

      const nextPageUrl: string | undefined = response.data['@odata.nextLink'];
      if (nextPageUrl) {
        return this.getAllUsersPages(nextPageUrl, result);
      }

      this.cacheService.set(url, result);
      return result;
    } catch (error) {
      this.logger.error(error);
      throw new Error('Failed to retrieve users');
    }
  }

  async getUsers(): Promise<MsUser[]> {
    try {
      const endpoint = process.env.GRAPH_USERS_ENDPOINT;
      const filter = `endsWith(mail,'@daveo.fr')`;
      const url = `${endpoint}/?$count=true&$top=999&$filter=${filter}`;

      return this.getAllUsersPages(url);
    } catch (error) {
      this.logger.error(error);
      throw new Error('Failed to get users');
    }
  }

  async getUserById(id: string): Promise<MsUser> {
    try {
      const cachedUser = this.cacheService.get(id);
      if (cachedUser) {
        return cachedUser as MsUser;
      }

      const response = await axios.get(`${process.env.GRAPH_USERS_ENDPOINT}/${id}`, this.axiosConfig);
      const user: MicrosoftUserDto = response.data;

      if (user.mail && user.mail.endsWith('@daveo.fr')) {
        const formattedUser = formatUser(user);
        this.cacheService.set(id, formattedUser, 1200);

        return formattedUser;
      }

      throw new HttpException('User not found in Daveo directory', HttpStatus.NOT_FOUND);
    } catch (error) {
      if (error.response && error.response.status === HttpStatus.NOT_FOUND) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      this.logger.error(error);
      throw new Error('Failed to retrieve user');
    }
  }

  async getUserByEmail(email: string): Promise<MsUser | null> {
    try {
      const cachedUserByEmail = this.cacheService.get(email);
      if (cachedUserByEmail) {
        return cachedUserByEmail as MsUser;
      }

      const response = await axios.get(
        `${process.env.GRAPH_USERS_ENDPOINT}?$filter=mail eq '${email}'`,
        this.axiosConfig,
      );

      const user: MicrosoftUserDto = response.data.value[0];
      if (user) {
        const formattedUser = formatUser(user);
        this.cacheService.set(email, formattedUser, 1200);
        return formattedUser;
      }
      return null;
    } catch (error) {
      this.logger.error(error);
      throw new Error('Failed to retrieve user by email');
    }
  }
}
