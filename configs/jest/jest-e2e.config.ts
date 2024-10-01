import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  verbose: true,
  preset: "ts-jest",
  moduleFileExtensions: ["js", "json", "ts"],
  coverageReporters: ["json", "clover", "text", "lcov"],
  collectCoverage: true,
  rootDir: "../",
  testEnvironment: "node",
  testMatch: ["**/test/integration/**/*.e2e-spec.ts"],
  coverageDirectory: "<rootDir>/coverage",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
  coveragePathIgnorePatterns: ["/node_modules/", "/dist/", "/mocks/", "/coverage/"],
  moduleNameMapper: {
    "@/(.*)$": "<rootDir>/src/$1",
    "@mocks/(.*)$": "<rootDir>/mocks/$1",
    "@modules/(.*)$": "<rootDir>/src/modules/$1",
  },
};

export default config;