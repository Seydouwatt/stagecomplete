import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';

async function bootstrap() {
  console.log('🚀 BOOTSTRAP START');

  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  // TEMPORAIRE: 10MB pour base64. TODO: Migrer vers upload binaire avec stockage externe (S3/Cloudinary)
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));
  // Global exception filter pour gérer les exceptions HTTP
  app.useGlobalFilters(new HttpExceptionFilter());
  // Global validation pipe avec messages en français
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Supprime les propriétés non décorées
      forbidNonWhitelisted: true, // Rejette les propriétés non autorisées
      transform: true, // Transforme automatiquement les types
      transformOptions: {
        enableImplicitConversion: true,
      },
      // Messages d'erreur personnalisés
      exceptionFactory: (errors) => {
        const messages = errors.map((error) => ({
          field: error.property,
          errors: Object.values(error.constraints || {}),
        }));

        // Log détaillé des erreurs de validation
        console.log('🚨 [VALIDATION ERROR] Erreurs détectées:');
        errors.forEach((error) => {
          console.log(`  - Champ: "${error.property}"`);
          console.log(
            `    Valeur reçue: ${typeof error.value} (length: ${error.value?.length || 'N/A'})`,
          );
          console.log(
            `    Contraintes échouées:`,
            Object.keys(error.constraints || {}),
          );
          Object.entries(error.constraints || {}).forEach(([key, msg]) => {
            console.log(`      • ${key}: ${msg}`);
          });
        });

        return {
          statusCode: 400,
          message: 'Données de validation invalides',
          errors: messages,
        };
      },
    }),
  );

  // CORS configuration
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://stagecomplete.netlify.app',
  ];

  if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
  }

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('StageComplete API')
    .setDescription(
      'API pour la plateforme StageComplete - Mise en relation artistes et lieux de spectacle',
    )
    .setVersion('1.0')
    .addTag('auth', 'Authentification et gestion des utilisateurs')
    .addTag('artist', 'Gestion des profils et membres artistes')
    .addTag('public', 'Endpoints publics accessibles sans authentification')
    .addTag('health', 'État de santé du serveur')
    .addTag('profile', 'Gestion des profils utilisateur')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Token JWT pour authentification',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'StageComplete API Documentation',
    customfavIcon: '/favicon.ico',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  console.log('🔥 BEFORE LISTEN');
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Server running on http://localhost:${port}/api`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  console.log(`📊 Prisma Studio: npx prisma studio`);
}
void bootstrap();
