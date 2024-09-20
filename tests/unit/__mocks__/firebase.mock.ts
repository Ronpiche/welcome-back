import { GipUserMock } from '@tests/unit/__mocks__/authentification/authentification.entities.mock';

export const firebaseAuth = {
  signInWithEmailAndPassword: jest.fn().mockResolvedValue({ user: GipUserMock }),
  createUserWithEmailAndPassword: jest.fn().mockResolvedValue({ user: GipUserMock }),
  getAuth: jest.fn().mockReturnValue({
    authStateReady: jest.fn().mockResolvedValue(undefined),
  }),
};

export const firebaseApp = {
  initializeApp: jest.fn(),
};
