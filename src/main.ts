import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  Logger,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Set global API prefix
  app.setGlobalPrefix('api');

  // Enable API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'v',
  });

  // Apply global pipes, filters and interceptors
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.reduce((acc, error) => {
          const property = error.property;
          const constraints = error.constraints
            ? Object.values(error.constraints)
            : [];

          if (constraints.length > 0) {
            acc[property] = constraints;
          }

          // Handle nested validation errors
          if (error.children && error.children.length > 0) {
            const childErrors = error.children.reduce((childAcc, child) => {
              const childProperty = child.property;
              const childConstraints = child.constraints
                ? Object.values(child.constraints)
                : [];

              if (childConstraints.length > 0) {
                childAcc[`${property}.${childProperty}`] = childConstraints;
              }

              return childAcc;
            }, {});

            acc = { ...acc, ...childErrors };
          }

          return acc;
        }, {});

        return new BadRequestException({
          message: 'Validation failed',
          errors: formattedErrors,
        });
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  const port = process.env.PORT || 3000;
  await app.listen(port);

  const baseUrl = `http://localhost:${port}`;
  logger.log(`Application is running on: ${baseUrl}`);
  logger.log(`API base URL: ${baseUrl}/api/v1`);
  logger.log(`AI Agent endpoint: ${baseUrl}/api/v1/ai-agent/study-plan`);
}
bootstrap();
