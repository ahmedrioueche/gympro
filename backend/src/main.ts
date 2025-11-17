import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

/**
 * Get all allowed origins based on environment
 */
const getAllowedOrigins = (): (string | RegExp)[] => {
  const isDev = process.env.NODE_ENV !== 'prod';

  const origins: (string | RegExp)[] = [];

  if (isDev) {
    // Development origins
    origins.push(
      process.env.DEV_FRONTEND_URL || 'http://localhost:5173',
      process.env.DEV_DESKTOP_URL || 'http://localhost:5174',
      process.env.DEV_MOBILE_URL || 'http://localhost:8081',
      // Allow localhost with any port for development
      /^http:\/\/localhost:\d+$/,
      /^http:\/\/127\.0\.0\.1:\d+$/,
    );
  } else {
    // Production origins
    origins.push(
      process.env.PROD_FRONTEND_URL || 'https://gympro-power.vercel.app',
      process.env.PROD_DESKTOP_URL || 'https://desktop.gympro-power.com',
    );
  }

  // Custom scheme for mobile deep links (if needed for some endpoints)
  // Note: Mobile apps typically don't need CORS, but web views might
  const mobileScheme = process.env.PROD_MOBILE_URL || 'gympro://';
  if (mobileScheme.startsWith('http')) {
    origins.push(mobileScheme);
  }

  return origins;
};

async function bootstrap() {
  const isDev = process.env.NODE_ENV === 'dev';

  const app = await NestFactory.create(AppModule, {
    logger: isDev
      ? ['error', 'warn', 'log', 'debug', 'verbose']
      : ['error', 'warn', 'log'],
  });

  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('api');
  app.use(cookieParser());

  // Register global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Enable validation pipes with detailed errors
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const allowedOrigins = getAllowedOrigins();

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) {
        return callback(null, true);
      }

      // Check if origin is allowed
      const isAllowed = allowedOrigins.some((allowedOrigin) => {
        if (typeof allowedOrigin === 'string') {
          return origin === allowedOrigin;
        }
        // RegExp check
        return allowedOrigin.test(origin);
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        logger.warn(`CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-App-Platform'],
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  logger.log(`🚀 Server running on http://localhost:${port}/api`);
  logger.log(
    `🌍 CORS enabled for origins: ${allowedOrigins.map((o) => o.toString()).join(', ')}`,
  );
  logger.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
}
bootstrap();
