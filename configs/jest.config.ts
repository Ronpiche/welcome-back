import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  preset: 'ts-jest',
  moduleFileExtensions: ['js', 'json', 'ts'],
  coverageReporters: ['json', 'clover', 'text', 'lcov'],
  collectCoverage: true,
  rootDir: '../',
  testMatch: [
    '**/test/unit/modules/welcome/*.spec.ts',
    '**/test/unit/modules/shared/*.spec.ts',
    '**/test/unit/modules/cognito/*.spec.ts',
    '**/test/unit/modules/email/*.spec.ts',
  ],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.service.ts', 'src/**/*.controller.ts', 'src/**/*.pipe.ts', 'src/**/*.filter.ts'],
  coveragePathIgnorePatterns: ['/dist/', '/mocks/', '/coverage/', '/node_modules/'],
  coverageDirectory: '<rootDir>/coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/src/$1',
    '@mocks/(.*)$': '<rootDir>/mocks/$1',
    '@modules/(.*)$': '<rootDir>/src/modules/$1',
  },
};

export default config;
