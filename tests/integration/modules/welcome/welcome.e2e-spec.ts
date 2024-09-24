import { GRADE } from '@modules/welcome/types/user.enum';
import { HttpException, INestApplication, InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { FirestoreService } from '@src/services/firestore/firestore.service';
import request from 'supertest';

let moduleFixture: TestingModule;
let app: INestApplication;
let repo: FirestoreService;
const id: string = 'test-integration';
let http: any;
const user: Record<string, any> = {
  email: 'email-test-integration@test.fr',
  firstName: 'test',
  lastName: 'integration',
  arrivalDate: 1717200000,
  signupDate: 1715866214,
  referentRH: {
    _id: '16516515',
    firstName: 'test',
    lastName: 'test2',
    email: 'test-rh@test.fr',
  },
  civility: 'M',
  agency: 'Lille',
  grade: GRADE.ASSOCIATE,
};
describe('testing welcome', () => {
  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    http = app.getHttpServer();
    repo = moduleFixture.get<FirestoreService>(FirestoreService);
  }, 30000);

  afterEach(() => {
    delete repo.deleteDocument;
    delete repo.getAllDocuments;
    delete repo.getDocument;
    delete repo.saveDocument;
    delete repo.updateDocument;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('create user', () => {
    it('api/welcome/users (POST) - should create one user', async () => {
      const res = await request(http).post(`/welcome/users`).send(user);
      expect(res.body.id).toEqual(id);
      expect(res.status).toEqual(201);
    });

    it('api/welcome/users (POST) - should throw exception, because the user exist', async () => {
      try {
        await request(http).post(`/welcome/users`).send(user);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual('Document already exists.');
        expect(error.status).toEqual(409);
      }
    });

    it('api/welcome/users (POST) - should throw exception, because the server is down', async () => {
      repo.saveDocument = jest.fn().mockRejectedValue(new Error());
      try {
        await request(http).post(`/welcome/users`).send(user);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('Internal Server Error');
        expect(error.status).toEqual(500);
      }
    });
  });

  describe('find all users', () => {
    it('api/welcome/users (GET) - should return all users with the previously created id', async () => {
      const res = await request(http).get('/welcome/users');
      expect(res.body.find((user: any) => user._id === id)).toBeTruthy();
      expect(res.status).toEqual(200);
    });

    it('api/welcome/users (GET) - should return an empty array', async () => {
      const res = await request(http).get(
        '/welcome/users?arrivalDate[startDate]=30/05/2024&arrivalDate[endDate]=01/06/2024',
      );
      expect(res.body).toHaveLength(0);
      expect(res.status).toEqual(200);
    });

    it('api/welcome/users (GET) - should throw an exception', async () => {
      repo.getAllDocuments = jest.fn().mockRejectedValue(new HttpException('Error', 400));
      try {
        await request(http).get('/welcome/users');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual('Error');
        expect(error.status).toEqual(400);
      }
    });

    it('api/welcome/users (GET) - should throw an internal server exception', async () => {
      repo.getAllDocuments = jest.fn().mockRejectedValue(new Error('Internal server exeption'));
      try {
        await request(http).get('/welcome/users');
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('Internal Server Error');
        expect(error.status).toEqual(500);
      }
    });
  });

  describe('find one user', () => {
    it('api/welcome/users (GET) - should return the user with the previously created id', async () => {
      const res = await request(http).get(`/welcome/users/${id}`);
      expect(res.body).toHaveProperty('_id');
      expect(res.body._id).toEqual(id);
      expect(res.status).toEqual(200);
    });

    it('api/welcome/users (GET) - should throw an excepion, because the id not found', async () => {
      try {
        await request(http).get(`/welcome/users/test`);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual('User is not registered in welcome');
        expect(error.status).toEqual(404);
      }
    });

    it('api/welcome/users (GET) - should throw an excepion, because teh server is down', async () => {
      repo.getDocument = jest.fn().mockRejectedValue(new Error('error'));
      try {
        await request(http).get(`/welcome/users/test`);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('Internal Server Error');
        expect(error.status).toEqual(500);
      }
    });
  });

  describe('update one user', () => {
    it('api/welcome/users (PUT) - should return the user with the updated properties', async () => {
      const res = await request(http)
        .put(`/welcome/users/${id}`)
        .send({ lastName: 'integration-update', firstName: 'test-update' });
      expect(res.body._id).toEqual(id);
      expect(res.body.firstName).toEqual('test-update');
      expect(res.body.lastName).toEqual('integration-update');
      expect(res.status).toEqual(200);
    });

    it('api/welcome/users (PUT) - should throw an exception, because the document is not found in Firestore DB', async () => {
      try {
        await request(http)
          .put(`/welcome/users/test`)
          .send({ lastName: 'integration-update', firstName: 'test-update' });
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual('Document not found in DB');
        expect(error.status).toEqual(404);
      }
    });

    it('api/welcome/users (PUT) - should throw an exception, because the server is down', async () => {
      repo.updateDocument = jest.fn().mockRejectedValue(new Error('error'));
      try {
        await request(http)
          .put(`/welcome/users/test`)
          .send({ lastName: 'integration-update', firstName: 'test-update' });
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('Internal Server Error');
        expect(error.status).toEqual(500);
      }
    });
  });

  describe('delete one user', () => {
    it('api/welcome/users (DELETE) - should throw an exception, because the server is down', async () => {
      repo.deleteDocument = jest.fn().mockRejectedValue(new Error('error'));
      try {
        await request(http).delete(`/welcome/users/${id}`);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('Internal Server Error');
        expect(error.status).toEqual(500);
      }
    });

    it('api/welcome/users (DELETE) - should delete the user with the previously created id', async () => {
      const res = await request(http).delete(`/welcome/users/${id}`);
      expect(res.text).toEqual('User deleted');
    });
  });
});
