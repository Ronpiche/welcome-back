import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn()
          }
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should generate session token', async () => {
    // Mocking axios.get
    const mockResponse = {
      data: {
        givenName: 'John',
        surname: 'Doe',
        mail: 'john.doe@example.com',
        jobTitle: 'Developer',
        id: '12345'
      }
    };
    mockedAxios.get.mockImplementation(() => Promise.resolve(mockResponse));
    //jest.spyOn(service['axios'], 'get').mockResolvedValue(mockResponse);

    // Mocking _generateTokenWithValidity method
    jest.spyOn(service['jwtItem'], '_generateTokenWithValidity').mockResolvedValue('mockedToken');

    const accessToken = 'mockedAccessToken';
    const token = await service.generateSessionToken(accessToken);

    expect(token).toEqual('mockedToken');
  });

  it('should check session token', async () => {
    // Mocking _verifyToken method
    jest.spyOn(service['jwtItem'], '_verifyToken').mockResolvedValue({
      jwtid: 'mockedJWTID',
      role: 'user',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      exp: Math.floor(Date.now() / 1000) + 3600, // Token expires in an hour
      picture: 'https://example.com/picture.jpg',
      sub: '12345'
    });

    // Mocking _generateTokenWithValidity method
    jest.spyOn(service['jwtItem'], '_generateTokenWithValidity').mockResolvedValue('mockedRefreshToken');

    const cookies = { dht: 'mockedEncodedToken' };
    const refreshToken = await service.checkSessionToken(cookies);

    expect(refreshToken).toEqual('mockedRefreshToken');
  });
});
