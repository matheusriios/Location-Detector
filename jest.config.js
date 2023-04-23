/* eslint-disable @typescript-eslint/no-var-requires */
const { compilerOptions } = require('./tsconfig.json');
const { pathsToModuleNameMapper } = require('ts-jest');

module.exports = {
  globalTeardown: 'tst/test-teardown-globals.ts',
  cache: false,
  rootDir: '.',
  verbose: true,
  clearMocks: true,
  preset: 'ts-jest',
  collectCoverage: true,
  testEnvironment: 'node',
  testURL: 'http://localhost',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/index.ts',
    '!**/*interface.ts',
    '!src/Bootstrap.ts',
    '!**/node_modules/**',
    '!src/commons/Exceptions.ts',
    '!src/commons/helpers/ValidateEnvironments.ts',
    '!src/commons/helpers/convertSecondsToMinutes.ts',
    '!src/commons/helpers/isDevelopmentEnvironment.ts',
    '!src/infra/monitoring/logger/MonitoringLoggerService.ts',
  ],
  setupFilesAfterEnv: ['./tst/setup.ts'],
  moduleDirectories: ['node_modules', 'src'],
  coverageReporters: ['json-summary', 'text', 'lcov'],
  testResultsProcessor: 'jest-sonar-reporter',
  transform: {
    '.(ts|tsx)': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  testRegex: '(/__tst__/.*|\\.(test|tst))\\.(ts|tsx|js)$',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  coverageThreshold: {
    global: {
      statements: 95,
      branches: 95,
      functions: 95,
      lines: 95,
    },
  },
  globals: {
    'ts-jest': {
      compiler: 'ttypescript',
    },
  },
};
