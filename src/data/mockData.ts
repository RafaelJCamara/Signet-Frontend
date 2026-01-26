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
    version: '1.0.0',
    description: 'Initial schema for order creation events',
    jsonSchema: {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "type": "object",
      "required": ["orderId", "timestamp"],
      "properties": {
        "orderId": {
          "type": "string",
          "description": "Unique order identifier"
        },
        "timestamp": {
          "type": "string",
          "format": "date-time"
        }
      }
    },
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-05T10:00:00Z',
    usageCount: 0,
  },
  {
    id: '1a',
    name: 'OrderCreatedEvent',
    version: '1.1.0',
    description: 'Added customer information to order events',
    jsonSchema: {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "type": "object",
      "required": ["orderId", "customerId", "timestamp"],
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
        "timestamp": {
          "type": "string",
          "format": "date-time"
        }
      }
    },
    createdAt: '2024-01-08T14:00:00Z',
    updatedAt: '2024-01-08T14:00:00Z',
    usageCount: 1,
  },
  {
    id: '1b',
    name: 'OrderCreatedEvent',
    version: '1.2.0',
    description: 'Added items array to order events',
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
    id: '1c',
    name: 'OrderCreatedEvent',
    version: '2.0.0',
    description: 'Major update with shipping and billing addresses',
    jsonSchema: {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "type": "object",
      "required": ["orderId", "customerId", "items", "shippingAddress", "timestamp"],
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
            "required": ["productId", "quantity", "price"],
            "properties": {
              "productId": { "type": "string" },
              "quantity": { "type": "integer", "minimum": 1 },
              "price": { "type": "number", "minimum": 0 },
              "discount": { "type": "number", "minimum": 0, "default": 0 }
            }
          }
        },
        "shippingAddress": {
          "type": "object",
          "required": ["street", "city", "country"],
          "properties": {
            "street": { "type": "string" },
            "city": { "type": "string" },
            "postalCode": { "type": "string" },
            "country": { "type": "string" }
          }
        },
        "billingAddress": {
          "type": "object",
          "properties": {
            "street": { "type": "string" },
            "city": { "type": "string" },
            "postalCode": { "type": "string" },
            "country": { "type": "string" }
          }
        },
        "timestamp": {
          "type": "string",
          "format": "date-time"
        }
      }
    },
    createdAt: '2024-01-18T09:00:00Z',
    updatedAt: '2024-01-18T09:00:00Z',
    usageCount: 2,
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
