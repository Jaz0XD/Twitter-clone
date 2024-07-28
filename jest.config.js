export default {
    testEnvironment: 'node',
    transform: {
      '^.+\\.jsx?$': 'babel-jest'
    },
    transformIgnorePatterns: [
      '/node_modules/(?!bson|other-module-to-transform)'
    ],
    testTimeout: 30000,
    maxWorkers: 2,
    verbose: true,
    forceExit: true,
    detectOpenHandles: true,
  };
  