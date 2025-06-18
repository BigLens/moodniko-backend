import { Controller, Get, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  @Get()
  async check() {
    const startTime = Date.now();
    this.logger.log('Health check requested');

    try {
      // Check database connection
      const dbStatus = await this.checkDatabase();

      const responseTime = Date.now() - startTime;

      const healthStatus = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: process.env.npm_package_version || '1.0.0',
        responseTime: `${responseTime}ms`,
        services: {
          database: dbStatus,
        },
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
          external: Math.round(process.memoryUsage().external / 1024 / 1024),
        },
      };

      this.logger.log(`Health check completed in ${responseTime}ms`);
      return healthStatus;
    } catch (error) {
      this.logger.error('Health check failed:', error);
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error.message,
      };
    }
  }

  @Get('ready')
  async readiness() {
    this.logger.log('Readiness check requested');

    try {
      const dbStatus = await this.checkDatabase();

      if (dbStatus.status === 'ok') {
        this.logger.log('Application is ready');
        return { status: 'ready' };
      } else {
        this.logger.warn('Application is not ready - database issue');
        return { status: 'not ready', reason: 'database connection failed' };
      }
    } catch (error) {
      this.logger.error('Readiness check failed:', error);
      return { status: 'not ready', reason: error.message };
    }
  }

  @Get('live')
  liveness() {
    this.logger.log('Liveness check requested');
    return { status: 'alive', timestamp: new Date().toISOString() };
  }

  private async checkDatabase(): Promise<{ status: string; details?: any }> {
    try {
      const startTime = Date.now();
      await this.dataSource.query('SELECT 1');
      const responseTime = Date.now() - startTime;

      return {
        status: 'ok',
        details: {
          responseTime: `${responseTime}ms`,
          type: this.dataSource.options.type,
        },
      };
    } catch (error) {
      return {
        status: 'error',
        details: {
          error: error.message,
          type: this.dataSource.options.type,
        },
      };
    }
  }
}
