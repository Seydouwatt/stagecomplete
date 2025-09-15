import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({
    summary: 'Vérification de l\'état du serveur',
    description: 'Endpoint de santé pour vérifier que l\'API est opérationnelle'
  })
  @ApiOkResponse({
    description: 'Serveur opérationnel',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00.000Z' }
      }
    }
  })
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
