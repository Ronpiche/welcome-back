import { SignInDto } from '@modules/authentification/dto/input/signIn.dto';
import { SignupDto } from '@modules/authentification/dto/input/signup.dto';
import {
  AuthentificationUserOutputDto,
  GipUser,
} from '@src/modules/authentification/dto/output/authentificationUserOutput.dto';
import { GRADE, PRACTICE } from '@src/modules/welcome/types/user.enum';

export const signInMock: SignInDto = {
  email: 'test@test.fr',
  password: 'azerty@123',
};

export const signUpMock: SignupDto = {
  email: 'test@test.fr',
  password: 'azerty@123',
  copy_password: 'azerty@123',
};

export const authentificationUserOutput: AuthentificationUserOutputDto = {
  gipUser: {
    email: 'test@test.fr',
    uid: 'test-uid',
    accessToken: 'test-token',
    refreshToken: 'test-refresh-token',
  },
  welcomeUser: {
    _id: '561651-1561',
    note: '',
    signupDate: '2022-04-24 22:00:00',
    lastName: 'COBIGO',
    grade: GRADE.ASSOCIATE,
    practice: PRACTICE.PRODUCT,
    civility: 'M',
    email: 'john.doe@daveo.fr',
    agency: 'Lille',
    creationDate: new Date('2022-04-25T13:24:06.627Z'),
    referentRH: {
      _id: '114522855744701640690',
      firstName: 'Alisson',
      lastName: 'VERMETTEN',
      email: 'alisson.vermetten@daveo.fr',
    },
    arrivalDate: '2023-02-01 22:00:00',
    firstName: 'Xavier',
    satisfactionQuestions:
      "{'generalFeedback': 'oui', 'pastExperience': 'non', 'feedback': \"Non mais c'était bien, pas d'idée\", 'discoverDaveo': 'oui', 'generalAccessibility': 'oui', 'videoAccessibility': 'oui', 'displayCorrectly': 'oui', 'commentary': 'nop', 'stepDuration': 'non', 'gameUtility': 'oui', 'clearInformation': 'oui', 'knowMore': 'non', 'moreSubject': '', 'stillWantDaveo': 'oui', 'rgpdRead': True, 'rgpdAgreement': True}",
    lastUpdate: new Date('2022-05-16T08:40:24.420Z'),
    communitiesQuestions: "{'communities': ['dax'], 'answer':{'dax': 'AccompagnementEquipe'}}",
    steps: [
      { _id: '0', unlockDate: new Date(2022, 4, 25, 13, 24, 6), subStep: [{ _id: '1', isCompleted: false }] },
      { _id: '1', unlockDate: new Date(2022, 4, 25, 13, 24, 6), subStep: [{ _id: '2', isCompleted: false }] },
      { _id: '2', unlockDate: new Date(2022, 4, 25, 13, 24, 6), subStep: [{ _id: '3', isCompleted: false }] },
    ],
  },
};

export const GipUserMock: GipUser = {
  uid: 'test-uid',
  email: 'test@test.fr',
  refreshToken: 'test-refresh-token',
  accessToken: 'test-token',
};
