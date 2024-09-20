import { Timestamp } from '@google-cloud/firestore';
import { CreateUserDto } from '@modules/welcome/dto/input/create-user.dto';
import { WelcomeUserDto } from '@modules/welcome/dto/output/welcome-user.dto';
import { WelcomeUser } from '@modules/welcome/entities/user.entity';
import { GRADE, PRACTICE } from '@modules/welcome/types/user.enum';
import { UpdateUserDto } from '@src/modules/welcome/dto/input/update-user.dto';

export const welcomeUserEntityMock: WelcomeUser = {
  _id: '16156-585263',
  note: '',
  email: 'test@test.fr',
  signupDate: '2022-04-24 22:00:00',
  lastName: 'COBIGO',
  civility: 'M',
  agency: 'Lille',
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
  steps: [
    {
      _id: '0',
      unlockDate: Timestamp.fromDate(new Date(2022, 4, 25, 13, 24, 6)),
      subStep: [{ _id: '1', isCompleted: false }],
    },
    {
      _id: '1',
      unlockDate: Timestamp.fromDate(new Date(2022, 4, 25, 13, 24, 6)),
      subStep: [{ _id: '1', isCompleted: false }],
    },
    {
      _id: '2',
      unlockDate: Timestamp.fromDate(new Date(2022, 4, 25, 13, 24, 6)),
      subStep: [{ _id: '1', isCompleted: false }],
    },
  ],
};

export const outputWelcomeMock: WelcomeUserDto = {
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
  lastUpdate: new Date('2022-05-16T08:40:24.420Z'),
  steps: [
    { _id: '0', unlockDate: new Date(2022, 4, 25, 13, 24, 6), subStep: [{ _id: '1', isCompleted: false }] },
    { _id: '1', unlockDate: new Date(2022, 4, 25, 13, 24, 6), subStep: [{ _id: '1', isCompleted: false }] },
    { _id: '2', unlockDate: new Date(2022, 4, 25, 13, 24, 6), subStep: [{ _id: '1', isCompleted: false }] },
  ],
  smileyQuestion: '1',
};

export const outputUpdateWelcomeMock: WelcomeUserDto = {
  _id: '561651-1561',
  note: '',
  signupDate: '2022-04-24 22:00:00',
  lastName: 'testtest',
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
  firstName: 'test',
  lastUpdate: new Date('2022-05-16T08:40:24.420Z'),
  steps: [
    { _id: '0', unlockDate: new Date(2022, 4, 25, 13, 24, 6), subStep: [{ _id: '1', isCompleted: false }] },
    { _id: '1', unlockDate: new Date(2022, 4, 25, 13, 24, 6), subStep: [{ _id: '1', isCompleted: false }] },
    { _id: '2', unlockDate: new Date(2022, 4, 25, 13, 24, 6), subStep: [{ _id: '1', isCompleted: false }] },
  ],
  smileyQuestion: '1',
};

export const inputUpdateWelcomeMock: UpdateUserDto = {
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
  note: '',
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
  note: '',
};
