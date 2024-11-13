import type { Config } from "@jest/types";
import { pathsToModuleNameMapper } from "ts-jest";

import { compilerOptions } from "../../tsconfig.json";

const config: Config.InitialOptions = {
  verbose: true,
  preset: "ts-jest",
  collectCoverage: true,
  rootDir: "../../",
  testMatch: ["**/tests/unit/**/*.spec.ts"],
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  testEnvironment: "node",
  moduleFileExtensions: ["js", "ts"],
  modulePaths: ["<rootDir>"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.dto.ts",
    "!src/**/*.controller.ts",
    "!src/**/*.module.ts",
    "!src/**/*.types.ts",
    "!src/**/*.entity.ts",
    "!src/**/*.constants.ts",
  ],
  coverageReporters: ["clover", "json", "lcov", "text", "text-summary", "html-spa"],
  coverageDirectory: "tests/unit/coverage",
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 75,
      lines: 80,
      functions: 80,
    },
  },
};

export default config;