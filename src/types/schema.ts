export interface Queue {
  id: string;
  name: string;
  exchange: string;
  routingKey: string;
  status: 'active' | 'inactive' | 'error';
  messageCount: number;
  consumerCount: number;
  createdAt: string;
  schemaId?: string;
}

export interface Schema {
  id: string;
  name: string;
  version: string;
  description: string;
  jsonSchema: object;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
}

export interface SchemaVersion {
  version: string;
  schema: object;
  createdAt: string;
}
