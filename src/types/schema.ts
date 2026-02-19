export interface Queue {
  id: string;
  name: string;
  exchange?: string;
  routingKey?: string;
  status: 'active' | 'error' | 'missing';
  createdAt: string;
  schemaId?: string;
}

// Root schema without version-specific data
export type CompatibilityLevel = 'backward' | 'forward';

export interface RootSchema {
  schemaId: string;
  name: string;
  description: string;
  compatibility: CompatibilityLevel;
  createdAt: string;
}

export interface Schema {
  id: string;
  schemaId: string; // Unique identifier that never changes once created
  name: string;
  version: string;
  description: string;
  changelog?: string; // Notes about what changed in this version
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
