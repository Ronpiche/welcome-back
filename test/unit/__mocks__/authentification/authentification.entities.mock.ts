import { SignInDto } from '@modules/authentification/dto/input/signIn.dto';
import { SignupDto } from '@modules/authentification/dto/input/signup.dto';
import { UserOutputDto } from '@modules/authentification/dto/output/userOutput.dto';

export const signInMock: SignInDto = {
  email: 'test@test.fr',
  password: 'azerty@123',
};

export const signUpMock: SignupDto = {
  email: 'test@test.fr',
  password: 'azerty@123',
  copy_password: 'azerty@123',
};

export const userOutputDtoMock: UserOutputDto = {
  email: 'test@test.fr',
  uid: 'test-uid',
  accessToken: 'test-token',
  refreshToken: 'test-refresh-token',
};

export const UserCredential = {
  uid: 'test-uid',
  email: 'test@test.fr',
  emailVerified: false,
  isAnonymous: false,
  metadata: undefined,
  providerData: [],
  refreshToken: 'test-refresh-token',
  accessToken: 'test-token',
  tenantId: '',
  displayName: '',
  phoneNumber: '',
  photoURL: '',
  providerId: '',
};
