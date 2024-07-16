import { Timestamp } from '@google-cloud/firestore';
import { CreateUserDto } from '@modules/welcome/dto/input/create-user.dto';
import { WelcomeUserDto } from '../../../../src/modules/welcome/dto/output/welcome-user.dto';
import { WelcomeUser } from '../../../../src/modules/welcome/entities/user.entity';
import { GRADE, PRACTICE } from '@modules/welcome/types/user.enum';

export const welcomeUserEntityMock: WelcomeUser = {
  _id: '16156-585263',
  appGames: { scoreTetris: 3000, scoreDemineur: 8050, scoreTrexGame: 777 },
  note: '',
  email: 'test@test.fr',
  signupDate: '2022-04-24 22:00:00',
  lastName: 'COBIGO',
  civility: 'M',
  agency: 'Lille',
  personnalProject:
    "Ayant un attrait pour la logique en général je me suis orienté vers le développement informatique.\nLors de mes différents projets, j'ai pu faire évoluer mes compétences .Net et sur différent framework Front tel que Angular ou VueJs. J'ai eu l'occasion de travaillé sur des TMA comme sur des projets naissants, les deux aspects m'ont permis de me donner une vision plus globale du cycle de vie d'une application.\nDu à mon attrait pour la logique, j'ai une tendance à m'occuper plus du back que du front mais les deux restent intéressant et pouvoir créer l'affichage a un coté assez satisfaisant\n",
  hiringProcessEvaluation: '4.0',
  creationDate: Timestamp.fromDate(new Date('2022-04-25 13:24:06.627')),
  referentRH: {
    _id: '114522855744701640690',
    firstName: 'Alisson',
    lastName: 'VERMETTEN',
    email: 'alisson.vermetten@daveo.fr',
  },
  arrivalDate: '2023-02-01 22:00:00',
  lastUpdate: Timestamp.fromDate(new Date('2023-02-01 22:00:00')),
  grade: GRADE.PRACTIONNER,
  practice: PRACTICE.PRODUCT,
  firstName: 'Xavier',
  satisfactionQuestions: {},
  communitiesQuestions: {},
  steps: [
    { _id: 0, unlockDate: Timestamp.fromDate(new Date(2022, 4, 25, 13, 24, 6)) },
    { _id: 1, unlockDate: Timestamp.fromDate(new Date(2022, 4, 25, 13, 24, 6)) },
    { _id: 2, unlockDate: Timestamp.fromDate(new Date(2022, 4, 25, 13, 24, 6)) },
  ],
};

export const outputWelcomeMock: WelcomeUserDto = {
  _id: '561651-1561',
  appGames: { scoreTetris: 3000, scoreDemineur: 8050, scoreTrexGame: 777 },
  note: '',
  signupDate: '2022-04-24 22:00:00',
  lastName: 'COBIGO',
  grade: GRADE.ASSOCIATE,
  practice: PRACTICE.PRODUCT,
  civility: 'M',
  email: 'john.doe@daveo.fr',
  agency: 'Lille',
  personnalProject:
    "Ayant un attrait pour la logique en général je me suis orienté vers le développement informatique.\nLors de mes différents projets, j'ai pu faire évoluer mes compétences .Net et sur différent framework Front tel que Angular ou VueJs. J'ai eu l'occasion de travaillé sur des TMA comme sur des projets naissants, les deux aspects m'ont permis de me donner une vision plus globale du cycle de vie d'une application.\nDu à mon attrait pour la logique, j'ai une tendance à m'occuper plus du back que du front mais les deux restent intéressant et pouvoir créer l'affichage a un coté assez satisfaisant\n",
  hiringProcessEvaluation: '4.0',
  creationDate: '2022-04-25 13:24:06.627',
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
  lastUpdate: '2022-05-16 08:40:24.420',
  communitiesQuestions: "{'communities': ['dax'], 'answer':{'dax': 'AccompagnementEquipe'}}",
  currentPage: '7',
};

export const outputUpdateWelcomeMock: WelcomeUserDto = {
  _id: '561651-1561',
  appGames: { scoreTetris: 3000, scoreDemineur: 8050, scoreTrexGame: 777 },
  note: '',
  signupDate: '2022-04-24 22:00:00',
  lastName: 'testtest',
  grade: GRADE.ASSOCIATE,
  practice: PRACTICE.PRODUCT,
  civility: 'M',
  email: 'john.doe@daveo.fr',
  agency: 'Lille',
  personnalProject:
    "Ayant un attrait pour la logique en général je me suis orienté vers le développement informatique.\nLors de mes différents projets, j'ai pu faire évoluer mes compétences .Net et sur différent framework Front tel que Angular ou VueJs. J'ai eu l'occasion de travaillé sur des TMA comme sur des projets naissants, les deux aspects m'ont permis de me donner une vision plus globale du cycle de vie d'une application.\nDu à mon attrait pour la logique, j'ai une tendance à m'occuper plus du back que du front mais les deux restent intéressant et pouvoir créer l'affichage a un coté assez satisfaisant\n",
  hiringProcessEvaluation: '4.0',
  creationDate: '2022-04-25 13:24:06.627',
  referentRH: {
    _id: '114522855744701640690',
    firstName: 'Alisson',
    lastName: 'VERMETTEN',
    email: 'alisson.vermetten@daveo.fr',
  },
  arrivalDate: '2023-02-01 22:00:00',
  firstName: 'test',
  satisfactionQuestions:
    "{'generalFeedback': 'oui', 'pastExperience': 'non', 'feedback': \"Non mais c'était bien, pas d'idée\", 'discoverDaveo': 'oui', 'generalAccessibility': 'oui', 'videoAccessibility': 'oui', 'displayCorrectly': 'oui', 'commentary': 'nop', 'stepDuration': 'non', 'gameUtility': 'oui', 'clearInformation': 'oui', 'knowMore': 'non', 'moreSubject': '', 'stillWantDaveo': 'oui', 'rgpdRead': True, 'rgpdAgreement': True}",
  lastUpdate: '2022-05-16 08:40:24.420',
  communitiesQuestions: "{'communities': ['dax'], 'answer':{'dax': 'AccompagnementEquipe'}}",
  currentPage: '7',
};

export const inputUpdateWelcomeMock: CreateUserDto = {
  email: 'test@test.fr',
  firstName: 'test',
  lastName: 'testtest',
  grade: GRADE.ASSOCIATE,
  practice: PRACTICE.PRODUCT,
  arrivalDate: '1970-01-01',
  signupDate: '1970-01-01',
  referentRH: {
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
  },
  civility: 'M',
  agency: 'Lille',
};

export const inputWelcomeMock: CreateUserDto = {
  email: 'test-create@test.fr',
  firstName: 'test-create',
  lastName: 'testtest-create',
  grade: GRADE.ASSOCIATE,
  practice: PRACTICE.PRODUCT,
  arrivalDate: '2024-06-01',
  signupDate: '2024-05-16',
  referentRH: {
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
  },
  civility: 'M',
  agency: 'Lille',
};
