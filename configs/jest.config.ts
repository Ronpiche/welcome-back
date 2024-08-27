import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  preset: 'ts-jest',
  moduleFileExtensions: ['js', 'json', 'ts'],
  coverageReporters: ['json', 'clover', 'text', 'lcov'],
  collectCoverage: true,
  rootDir: '../',
  testMatch: ['**/test/unit/**/*.spec.ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.service.ts', 'src/**/*.controller.ts', 'src/**/*.pipe.ts', 'src/**/*.filter.ts'],
  coveragePathIgnorePatterns: ['/dist/', '/mocks/', '/coverage/', '/node_modules/'],
  coverageDirectory: '<rootDir>/coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@src/(.*)$': '<rootDir>/src/$1',
    '@test/(.*)$': '<rootDir>/test/$1',
    '@modules/(.*)$': '<rootDir>/src/modules/$1',
  },
};

export default config;
