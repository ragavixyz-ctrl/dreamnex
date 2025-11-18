module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  verbose: true,
  forceExit: true,
  extensionsToTreatAsEsm: ['.js'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
};

