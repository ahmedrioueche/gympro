import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

const logger = new Logger('MongoConfig');

export const DEV_MONGO_DB_NAME = 'test';
/** Local dev database (set MONGODB_DB_NAME=gympro-dev in .env) */
export const LOCAL_DEV_MONGO_DB_NAME = 'gympro-dev';
export const PROD_MONGO_DB_NAME = 'gympro-prod';

/**
 * Database name per environment.
 * - prod  → gympro-prod
 * - dev/local (default) → test; use MONGODB_DB_NAME=gympro-dev for your local dev DB
 *
 * Override anytime with MONGODB_DB_NAME in .env
 */
export function resolveMongoDbName(
  nodeEnv?: string,
  explicitDbName?: string,
): string {
  if (explicitDbName?.trim()) {
    return explicitDbName.trim();
  }
  return nodeEnv === 'prod' ? PROD_MONGO_DB_NAME : DEV_MONGO_DB_NAME;
}

export function resolveMongoUri(configService?: ConfigService): string {
  const fromEnv =
    configService?.get<string>('MONGODB_URI') ?? process.env.MONGODB_URI;
  return fromEnv?.trim() || 'mongodb://localhost:27017';
}

export function getMongooseOptions(configService: ConfigService) {
  const uri = resolveMongoUri(configService);
  const nodeEnv = configService.get<string>('NODE_ENV');
  const dbName = resolveMongoDbName(
    nodeEnv,
    configService.get<string>('MONGODB_DB_NAME'),
  );

  logger.log(`MongoDB database: ${dbName} (NODE_ENV=${nodeEnv ?? 'unset'})`);

  return { uri, dbName };
}

/** For scripts / raw MongoClient usage */
export function getMongoClientOptions(configService?: ConfigService) {
  const uri = resolveMongoUri(configService);
  const nodeEnv =
    configService?.get<string>('NODE_ENV') ?? process.env.NODE_ENV;
  const dbName = resolveMongoDbName(
    nodeEnv,
    configService?.get<string>('MONGODB_DB_NAME') ??
      process.env.MONGODB_DB_NAME,
  );
  return { uri, dbName };
}
