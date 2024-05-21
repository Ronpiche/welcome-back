import { WelcomeUserDto } from '@modules/welcome/dto/output/welcome-user.dto';
import { WelcomeUser } from '@modules/welcome/entities/user.entity';

export const welcomeUserEntityMock: WelcomeUser = {
  _id: '16156-585263',
  __v: '1',
  appGames: { scoreTetris: 3000, scoreDemineur: 8050, scoreTrexGame: 777 },
  note: '',
  signupDate: '2022-04-24 22:00:00',
  lastName: 'COBIGO',
  finishedOnBoarding: true,
  civility: 'M',
  stepEmailSent: [true, true, true],
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
  currentStep: '2',
  firstName: 'Xavier',
  satisfactionQuestions:
    "{'generalFeedback': 'oui', 'pastExperience': 'non', 'feedback': \"Non mais c'était bien, pas d'idée\", 'discoverDaveo': 'oui', 'generalAccessibility': 'oui', 'videoAccessibility': 'oui', 'displayCorrectly': 'oui', 'commentary': 'nop', 'stepDuration': 'non', 'gameUtility': 'oui', 'clearInformation': 'oui', 'knowMore': 'non', 'moreSubject': '', 'stillWantDaveo': 'oui', 'rgpdRead': True, 'rgpdAgreement': True}",
  lastUpdate: '2022-05-16 08:40:24.420',
  finishedCurrentStep: true,
  communitiesQuestions: "{'communities': ['dax'], 'answer':{'dax': 'AccompagnementEquipe'}}",
  currentPage: '7',
  emailDates: [new Date(2022, 4, 25, 13, 24, 6), new Date(2022, 4, 25, 13, 24, 6), new Date(2022, 4, 25, 13, 24, 6)],
  maxStep: '2',
};

export const outputWelcomeMock: WelcomeUserDto = {
  _id: '561651-1561',
  appGames: { scoreTetris: 3000, scoreDemineur: 8050, scoreTrexGame: 777 },
  note: '',
  signupDate: '2022-04-24 22:00:00',
  lastName: 'COBIGO',
  finishedOnBoarding: true,
  civility: 'M',
  stepEmailSent: [true, true, true],
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
  currentStep: '2',
  firstName: 'Xavier',
  satisfactionQuestions:
    "{'generalFeedback': 'oui', 'pastExperience': 'non', 'feedback': \"Non mais c'était bien, pas d'idée\", 'discoverDaveo': 'oui', 'generalAccessibility': 'oui', 'videoAccessibility': 'oui', 'displayCorrectly': 'oui', 'commentary': 'nop', 'stepDuration': 'non', 'gameUtility': 'oui', 'clearInformation': 'oui', 'knowMore': 'non', 'moreSubject': '', 'stillWantDaveo': 'oui', 'rgpdRead': True, 'rgpdAgreement': True}",
  lastUpdate: '2022-05-16 08:40:24.420',
  finishedCurrentStep: true,
  communitiesQuestions: "{'communities': ['dax'], 'answer':{'dax': 'AccompagnementEquipe'}}",
  currentPage: '7',
  emailDates: [new Date(2022, 4, 25, 13, 24, 6), new Date(2022, 4, 25, 13, 24, 6), new Date(2022, 4, 25, 13, 24, 6)],
  maxStep: '2',
};
