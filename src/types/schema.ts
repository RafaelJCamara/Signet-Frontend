export interface Queue {
  id: string;
  name: string;
  exchange?: string;
  routingKey?: string;
  status: 'active' | 'error' | 'missing';
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
