import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
// Get Cosmos Client
import { CosmosClient } from '@azure/cosmos';
import { Agent } from 'https';
// Data items
const items = [
  {
    id: '08225A9E-F2B3-4FA3-AB08-8C70ADD6C3C2',
    categoryId: '75BF1ACB-168D-469C-9AA3-1FD26BB4EA4C',
    categoryName: 'Bikes, Touring Bikes',
    sku: 'BK-T79U-50',
    name: 'Touring-1000 Blue, 50',
    description: 'The product called "Touring-1000 Blue, 50"',
    price: 2384.0700000000002,
    tags: [
      {
        _id: '27B7F8D5-1009-45B8-88F5-41008A0F0393',
        name: 'Tag-61',
      },
    ],
  },
  {
    id: '2C981511-AC73-4A65-9DA3-A0577E386394',
    categoryId: '75BF1ACB-168D-469C-9AA3-1FD26BB4EA4C',
    categoryName: 'Bikes, Touring Bikes',
    sku: 'BK-T79U-46',
    name: 'Touring-1000 Blue, 46',
    description: 'The product called "Touring-1000 Blue, 46"',
    price: 2384.0700000000002,
    tags: [
      {
        _id: '4E102F3F-7D57-4CD7-88F4-AC5076A42C59',
        name: 'Tag-91',
      },
    ],
  },
  {
    id: '0F124781-C991-48A9-ACF2-249771D44029',
    categoryId: '56400CF3-446D-4C3F-B9B2-68286DA3BB99',
    categoryName: 'Bikes, Mountain Bikes',
    sku: 'BK-M68B-42',
    name: 'Mountain-200 Black, 42',
    description: 'The product called "Mountain-200 Black, 42"',
    price: 2294.9899999999998,
    tags: [
      {
        _id: '4F67013C-3B5E-4A3D-B4B0-8C597A491EB6',
        name: 'Tag-82',
      },
    ],
  },
];

@Injectable()
export class ConnectionService implements OnModuleInit {
  constructor(private _configService: ConfigService) {}
  database = null;
  async onModuleInit() {
    // Provide required connection from environment variables
    const databaseName: string = this._configService.get(
      'AZURE_COSMOS_DB_NAME',
    );
    // Endpoint format: https://YOUR-RESOURCE-NAME.documents.azure.com:443/
    const endpoint: string = this._configService.get('AZURE_COSMOS_DB_URL');
    const key: string = this._configService.get('AZURE_COSMOS_DB_PRIMARY_KEY');

    const cosmosClient = new CosmosClient({
      endpoint,
      key,
      agent: new Agent({ rejectUnauthorized: false }),
    });
    console.log('cosmosClient');
    // Create database if it doesn't exist
    const { database } = await cosmosClient.databases.createIfNotExists({
      id: databaseName,
    });
    console.log(`${database} database ready`);
    console.log(`${database.id} database ready`);

    this.database = database;
  }

  async createContainer(containerName: string, partitionKeyPath: string) {
    // Create container if it doesn't exist
    const { container } = await this.database.containers.createIfNotExists({
      id: containerName,
      partitionKey: {
        paths: partitionKeyPath,
      },
    });
    console.log(`${container.id} container ready`);
  }
  async getItem(container) {
    // Read item by id and partitionKey - least expensive `find`
    const { resource } = await container
      .item(items[0].id, items[0].categoryName)
      .read();
    console.log(`${resource.name} read`);
  }
}
