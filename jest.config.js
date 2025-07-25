/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",

  // look for tests in `src/` and `tests/`
  roots: ["<rootDir>/src", "<rootDir>/tests"],

  // transform TS/TSX with ts-jest
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },

  // file extensions Jest will process
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  // auto–import jest-dom matchers
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};
