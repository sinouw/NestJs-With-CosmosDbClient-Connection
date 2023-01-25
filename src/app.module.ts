import { AzureCosmosDbModule } from '@nestjs/azure-database';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './core/config/config.module';
import { ConfigService } from './core/config/config.service';
import { CosmosClient } from '@azure/cosmos';
import { ConnectionModule } from './core/connection/connection.module';

@Module({
  imports: [ConfigModule, ConnectionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
