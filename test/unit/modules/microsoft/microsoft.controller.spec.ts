import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { MicrosoftController } from '@modules/microsoft/microsoft.controller';
import { MicrosoftService } from '@modules/microsoft/microsoft.service';
import { mockMicrosoftService } from '../../../unit/__mocks__/firestore.service';

describe('MicrosoftController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [MicrosoftController],
      providers: [
        {
          provide: MicrosoftService,
          useValue: mockMicrosoftService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /microsoft/users', async () => {
    const expectedResponse = [{ id: '1', name: 'John Doe' }];

    // Mock the service method
    mockMicrosoftService.getUsers.mockResolvedValue(expectedResponse);

    const response = await request(app.getHttpServer()).get('/microsoft/users').expect(HttpStatus.OK);

    expect(response.body).toEqual(expectedResponse);
  });

  it('GET /microsoft/users/:id', async () => {
    const userId = '1';
    const expectedResponse = { id: userId, name: 'John Doe' };

    // Mock the service method
    mockMicrosoftService.getUserById.mockResolvedValue(expectedResponse);

    const response = await request(app.getHttpServer()).get(`/microsoft/users/${userId}`).expect(HttpStatus.OK);

    expect(response.body).toEqual(expectedResponse);
  });

  it('GET /microsoft/users with email query', async () => {
    const userEmail = 'john.doe@daveo.fr';
    const expectedResponse = [{ id: '1', name: 'John Doe' }];

    // Mock the service method
    mockMicrosoftService.getUserByEmail.mockResolvedValue(expectedResponse);

    const response = await request(app.getHttpServer())
      .get(`/microsoft/users?email=${userEmail}`)
      .expect(HttpStatus.OK);

    expect(response.body).toEqual(expectedResponse);
  });
});
