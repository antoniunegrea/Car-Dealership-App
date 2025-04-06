/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
  collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/__tests__/**/*',
        '!src/**/*.d.ts' 
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'clover']
};