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
      // Allow local network IPs for mobile testing (192.168.x.x, 10.0.x.x, etc.)
      /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:\d+$/,
      /^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d+$/,
      /^http:\/\/172\.(1[6-9]|2[0-9]|3[0-1])\.\d{1,3}\.\d{1,3}:\d+$/,
    );
  }
  origins.push(
    process.env.PROD_FRONTEND_URL || 'https://gympro-power.vercel.app',
    process.env.PROD_DESKTOP_URL || 'https://desktop.gympro-power.com',
    // ✅ ADD THIS: Allow ALL Vercel preview deployments
    /^https:\/\/gympro-[a-z0-9]+-ahmeds-projects-[a-z0-9]+\.vercel\.app$/,
    // ✅ ADD THIS: Allow ALL Vercel app deployments
    /^https:\/\/gympro-.*\.vercel\.app$/,
  );

  // Custom scheme for mobile deep links (if needed for some endpoints)
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
    rawBody: true,
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
  await app.listen(port, '0.0.0.0'); // Listen on all network interfaces

  logger.log(`🚀 Server running on http://localhost:${port}/api`);
  logger.log(
    `🌍 CORS enabled for origins: ${allowedOrigins.map((o) => o.toString()).join(', ')}`,
  );
  logger.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
