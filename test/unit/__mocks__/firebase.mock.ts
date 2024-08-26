import { UserCredential } from '@test/unit/__mocks__/authentification/authentification.entities.mock';

export const firebaseAuth = {
  signInWithEmailAndPassword: jest.fn().mockResolvedValue(UserCredential),
  createUserWithEmailAndPassword: jest.fn().mockResolvedValue(UserCredential),
  getAuth: jest.fn().mockReturnValue({
    authStateReady: jest.fn().mockResolvedValue(undefined),
  }),
};

export const firebaseApp = {
  initializeApp: jest.fn(),
};
