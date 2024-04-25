import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { JwtItem } from './jwt';

@Injectable()
export class AuthService {
  private jwtItem: JwtItem;

  constructor(private _jwt: JwtService) {
    this.jwtItem = new JwtItem(this._jwt);
  }

  async generateSessionToken(accessToken: string): Promise<string> {
    try {
      const options = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      // Get user email, jobTitle, given name and family name information
      const response = await axios.get(process.env.GRAPH_ME_ENDPOINT, options);
      const { givenName: firstName, surname: lastName, mail: email, jobTitle: role, id: sub } = response.data;
      // User photo
      const picture: string =
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKj58CU04K4aHerw7U7yzdUscWykwEi3-eGukCONbr-Q&s';

      const payload: object = { email, picture, firstName, lastName, role };
      const token: string = await this.jwtItem._generateTokenWithValidity(payload, {
        subject: sub,
        audience: 'sessionToken',
      });
      return token;
    } catch (error) {
      console.error('Error creating token: ' + error.message);
    }
  }

  async checkSessionToken(cookies: Record<string, string>): Promise<string> {
    try {
      const decodedToken = await this.jwtItem._verifyToken(cookies.dht);
      const { jwtid = '' } = decodedToken;
      if (process.env.REVOKED_TOKEN_ID && process.env.REVOKED_TOKEN_ID.split(',').includes(jwtid)) {
        throw new Error('revoked token');
      }
      const { role, firstName, lastName, email, exp: expiresIn, picture, sub: subject } = decodedToken;
      const payload = { role, firstName, lastName, email, picture };
      const _refreshtoken = await this.jwtItem._generateTokenWithValidity(payload, { expiresIn, subject });
      return _refreshtoken;
    } catch (error) {
      console.error('Error check session token: ' + error.message);
    }
  }
}
