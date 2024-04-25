import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.(spec|test).tsx?$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '\\.module\\.ts',
    '\\.entity\\.ts',
    '\\.model\\.ts',
    '\\.dto\\.ts',
    '/dist/',
    '/mocks/',
    '/coverage/',
    '/node_modules/',
    '/jest.config.ts',
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/src/$1',
    '@mocks/(.*)$': '<rootDir>/mocks/$1',
    '@modules/(.*)$': '<rootDir>/src/modules/$1',
  },
};

export default config;
