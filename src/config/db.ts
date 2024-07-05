import z from 'zod';
import * as fs from 'fs';
import { config as dotenvConfig } from 'dotenv';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';

dotenvConfig({ path: '.env' });

const isLocalEnvironment = fs.existsSync('src');

const parentDir = isLocalEnvironment ? 'dist' : './';

const postgresSecretsSchema = z.object({
  POSTGRES_USERNAME: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_HOST: z.string(),
  POSTGRES_DATABASE: z.string(),
  POSTGRES_PORT: z.string(),
  POSTGRES_SSL: z.string(),
});

const secrets = postgresSecretsSchema.parse(process.env);

export const dbConfig = {
  type: 'postgres' as const,
  host: secrets.POSTGRES_HOST,
  port: Number(secrets.POSTGRES_PORT),
  username: secrets.POSTGRES_USERNAME,
  password: secrets.POSTGRES_PASSWORD,
  database: secrets.POSTGRES_DATABASE,
  entities: [`${parentDir}/entity/**/*`],
  migrations: [`${parentDir}/migration/**/*`],
  migrationsRun: false,
  logging: true,
  synchronize: false,
  extra: {
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
  },
  connectTimeoutMS: 1500,
  logNotifications: true,
};

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  useFactory: async (): Promise<TypeOrmModuleOptions> => {
    return dbConfig;
  },
};
