export class CognitoServiceMock {
  verifyJwt = jest.fn().mockResolvedValue('jwt.token');
}
