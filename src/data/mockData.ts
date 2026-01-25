import { Queue, Schema } from '@/types/schema';

export const mockQueues: Queue[] = [
  {
    id: '1',
    name: 'order-events',
    exchange: 'orders.exchange',
    routingKey: 'order.created',
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
    schemaId: '1',
  },
  {
    id: '2',
    name: 'user-notifications',
    exchange: 'notifications.exchange',
    routingKey: 'user.notify',
    status: 'active',
    createdAt: '2024-01-14T08:15:00Z',
    schemaId: '2',
  },
  {
    id: '3',
    name: 'payment-processing',
    exchange: 'payments.exchange',
    routingKey: 'payment.*',
    status: 'error',
    createdAt: '2024-01-13T14:20:00Z',
  },
  {
    id: '4',
    name: 'inventory-sync',
    status: 'missing',
    createdAt: '2024-01-12T09:45:00Z',
    schemaId: '3',
  },
];

export const mockSchemas: Schema[] = [
  {
    id: '1',
    name: 'OrderCreatedEvent',
    version: '1.2.0',
    description: 'Schema for order creation events',
    jsonSchema: {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "type": "object",
      "required": ["orderId", "customerId", "items", "timestamp"],
      "properties": {
        "orderId": {
          "type": "string",
          "format": "uuid",
          "description": "Unique order identifier"
        },
        "customerId": {
          "type": "string",
          "format": "uuid",
          "description": "Customer identifier"
        },
        "items": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "productId": { "type": "string" },
              "quantity": { "type": "integer", "minimum": 1 },
              "price": { "type": "number", "minimum": 0 }
            }
          }
        },
        "timestamp": {
          "type": "string",
          "format": "date-time"
        }
      }
    },
    createdAt: '2024-01-10T12:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    usageCount: 3,
  },
  {
    id: '2',
    name: 'UserNotification',
    version: '2.0.1',
    description: 'Schema for user notification messages',
    jsonSchema: {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "type": "object",
      "required": ["userId", "type", "message"],
      "properties": {
        "userId": { "type": "string" },
        "type": { 
          "type": "string",
          "enum": ["email", "push", "sms"]
        },
        "message": { "type": "string", "maxLength": 500 },
        "priority": { 
          "type": "string",
          "enum": ["low", "medium", "high"],
          "default": "medium"
        }
      }
    },
    createdAt: '2024-01-08T09:00:00Z',
    updatedAt: '2024-01-14T08:15:00Z',
    usageCount: 5,
  },
  {
    id: '3',
    name: 'InventoryUpdate',
    version: '1.0.0',
    description: 'Schema for inventory synchronization events',
    jsonSchema: {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "type": "object",
      "required": ["sku", "quantity", "warehouse"],
      "properties": {
        "sku": { "type": "string" },
        "quantity": { "type": "integer" },
        "warehouse": { "type": "string" },
        "lastUpdated": { "type": "string", "format": "date-time" }
      }
    },
    createdAt: '2024-01-05T14:30:00Z',
    updatedAt: '2024-01-05T14:30:00Z',
    usageCount: 1,
  },
];
