import type {Config} from 'jest';

const config: Config = {
  bail: true, // pare assim que encontrar o primeiro erro no teste
  clearMocks: true, // limpa os mocks, fazendo com que cada teste comece com estado limpo
  coverageProvider: "v8",
  preset: "ts-jest", // configura o jest para compilar arquivos em ts
  testEnvironment: "jest-environment-node", // define o ambiente como nodejs
  testMatch: ["<rootDir>/src/**/*.test.ts"], // que os arquivos devem estar em src e usando a extenão .test.ts
  // mapeia os caminhos de modulos que começam com @/
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default config;
