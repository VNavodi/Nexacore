# API Integration Implementation

## Overview
This module implements the complete API integration blueprint for inbound data from POS/Webhook sources. It provides:
- **Idempotency support** (prevent duplicate sales)
- **HMAC signature verification** (secure webhooks)
- **Stock reservations** (prevent overselling)
- **Async processing** with retry queue
- **Conflict detection & resolution**

## Core Endpoints

### 1. Sales Webhook - Ingest Orders
```
POST /api/v1/sales/webhook
Headers:
  - Idempotency-Key: <unique-uuid>
  - X-Signature: <hmac-sha256-signature>
  - X-Source: POS|WEBSITE|EXTERNAL_API

Body:
{
  "orderId": "POS-2024-001",
  "source": "POS",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "items": [
    {
      "sku": "SKU-001",
      "productName": "Widget",
      "quantity": 2,
      "unitPrice": 29.99,
      "discount": 0
    }
  ],
  "taxBreakdown": {
    "taxRate": 0.08,
    "taxAmount": 4.80,
    "taxRegion": "CA"
  },
  "paymentStatus": "COMPLETED",
  "totalAmount": 64.78,
  "currencyCode": "USD",
  "timestamp": 1719619200000
}

Response:
{
  "success": true,
  "message": "Webhook received and queued for processing",
  "webhookEventId": "1",
  "status": "PENDING"
}
```

### 2. Sync Status - Check Queue & Conflicts
```
GET /api/v1/sync/status?source=POS

Response:
{
  "lastSync": "2024-04-28T10:15:30",
  "pendingCount": 5,
  "conflictCount": 2,
  "overallStatus": "DEGRADED",
  "nextRetryTime": "2024-04-28T11:15:30"
}
```

### 3. List Pending Conflicts
```
GET /api/v1/sync/conflicts

Response:
[
  {
    "id": 1,
    "webhookEventId": 5,
    "conflictType": "STOCK_MISMATCH",
    "description": "API reserved 10 units but system has 8 available",
    "productId": 101,
    "sku": "SKU-001",
    "expectedData": "10",
    "actualData": "8",
    "status": "PENDING",
    "detectedAt": "2024-04-28T10:10:00"
  }
]
```

### 4. Get Conflict Detail
```
GET /api/v1/sync/conflicts/1

Response:
{
  "id": 1,
  "webhookEventId": 5,
  "conflictType": "STOCK_MISMATCH",
  "description": "API reserved 10 units but system has 8 available",
  "productId": 101,
  "sku": "SKU-001",
  "expectedData": "10",
  "actualData": "8",
  "status": "PENDING",
  "detectedAt": "2024-04-28T10:10:00"
}
```

### 5. Resolve Conflict - Manual Resolution from UI
```
POST /api/v1/sync/conflicts/1/resolve
Headers:
  - X-User: admin-user-id

Body:
{
  "action": "accept_api",  // OR "accept_local" OR "custom_value"
  "customValue": "15",      // Only if action="custom_value"
  "notes": "Accepted API value, inventory will be resynced"
}

Response:
{
  "success": true,
  "message": "Conflict resolved",
  "conflictId": "1",
  "resolvedAt": "2024-04-28T10:15:30"
}
```

### 6. Products Catalog - CRUD
```
GET /api/v1/products?sku=SKU-001&status=active
POST /api/v1/products
PUT /api/v1/products/{id}
DELETE /api/v1/products/{id}
```

## Key Patterns Implemented

### Idempotency
- **Idempotency-Key Header**: Unique key per request
- **Duplicate Detection**: Check `webhook_events.idempotency_key`
- **Response**: Returns `409 Conflict` if already processed
- **TTL**: 24 hours (configurable)

### Stock Reservation
- **Flow**: 
  1. Order arrives → `RESERVED` (qty blocked)
  2. Payment confirmed → `CONFIRMED` (qty deducted)
  3. Order cancelled → `RELEASED` (qty freed)
- **Expiry**: Auto-release after 24 hours if not confirmed
- **Table**: `stock_reservations`

### HMAC Signature Verification
- **Algorithm**: HmacSHA256
- **Header**: `X-Signature`
- **Payload**: Request body JSON
- **Secret**: Stored in `api.webhook.secret`
- **Rejection**: 401 Unauthorized if invalid

### Async Processing + Retry Queue
- **Processing**: `@Async` processing in background
- **Retry Logic**: Exponential backoff (1s, 2s, 4s)
- **Max Retries**: 3 attempts (configurable)
- **Queue Status**: Track in `webhook_events.status`
- **Event States**: PENDING → PROCESSING → SUCCESS/FAILED/CONFLICT

### Conflict Detection
- **Types**: STOCK_MISMATCH, DUPLICATE_ORDER, PRICING_VARIANCE, etc.
- **Detection**: Compare expected vs actual data
- **Auto-Resolve**: Minor pricing variance < 1% auto-accepted
- **Manual**: UI dashboard for admin to resolve
- **Table**: `sync_conflicts`

## Database Schema

### webhook_events
Tracks all inbound webhooks with idempotency
```sql
- idempotency_key (UNIQUE)
- status (PENDING, PROCESSING, SUCCESS, FAILED, CONFLICT)
- payload (JSON blob)
- retry_count, last_retry_at
- created_at, processed_at
```

### stock_reservations
Tracks stock reserved for orders
```sql
- external_order_id, internal_order_id
- product_id, sku, reserved_quantity
- status (RESERVED, CONFIRMED, RELEASED, EXPIRED)
- reserved_at, confirmed_at, released_at, expires_at
```

### sync_conflicts
Tracks discrepancies detected during sync
```sql
- webhook_event_id, conflict_type
- expected_data, actual_data
- status (PENDING, ACCEPTED, REJECTED, MANUAL_RESOLVED)
- resolution, resolved_by, resolved_at
```

### sync_logs
Audit trail of sync operations
```sql
- source (POS, WEBSITE, EXTERNAL_API)
- status (SUCCESS, FAILED, PARTIAL)
- orders_processed, orders_skipped, conflicts_detected
- synced_at, completed_at, duration_ms
```

## Frontend Integration

### Sales Tab
```
Source: [API] [POS] [WEBSITE]
Sync Status: ✅ SUCCESS | ⏳ PENDING | ⚠️ CONFLICT
```

### Integrations Tab
```
- Last Sync: 2024-04-28 10:15:30
- Pending Queue: 5 orders
- Conflicts: 2 pending
- [Resolve Conflicts] Button → Modal
```

### Inventory Tab
```
Stock Movement Reason: "API Order #POS-2024-001" or "Manual Adjustment"
Shows source badge (API/POS/Manual)
```

### Dashboard
```
Sync Health Widget:
- Overall Status: HEALTHY/DEGRADED/CRITICAL
- Last 24h: 45 orders synced, 2 conflicts
- Real-time updates: SSE or polling /api/v1/sync/status
```

## Configuration

**application.yaml**
```yaml
api:
  webhook:
    secret: your-secure-secret-key-here
    max-retries: 3
    retry-delay-ms: 1000
    reservation-ttl-hours: 24

spring:
  task:
    scheduling:
      pool:
        size: 5
    execution:
      pool:
        core-size: 5
        max-size: 10
```

## Testing the Integration

### cURL Example - Send Webhook
```bash
PAYLOAD='{"orderId":"POS-001","source":"POS","items":[{"sku":"SKU-001","quantity":2,"unitPrice":29.99}],"paymentStatus":"COMPLETED","totalAmount":64.78}'

SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "your-secret-key" -binary | base64)

curl -X POST http://localhost:8080/api/v1/sales/webhook \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $(uuidgen)" \
  -H "X-Signature: $SIGNATURE" \
  -H "X-Source: POS" \
  -d "$PAYLOAD"
```

### Check Sync Status
```bash
curl http://localhost:8080/api/v1/sync/status?source=POS
```

### List Conflicts
```bash
curl http://localhost:8080/api/v1/sync/conflicts
```

### Resolve Conflict
```bash
curl -X POST http://localhost:8080/api/v1/sync/conflicts/1/resolve \
  -H "Content-Type: application/json" \
  -H "X-User: admin" \
  -d '{"action":"accept_api","notes":"Accepted"}'
```

## Scheduled Tasks

- **Retry Failed Webhooks**: Every 30 seconds
- **Release Expired Reservations**: Every 60 seconds
- **Auto-Resolve Conflicts**: Every 5 minutes
- **Cleanup Old Events**: Daily at 2 AM

## Error Handling

- **400 Bad Request**: Invalid payload or missing headers
- **401 Unauthorized**: Invalid HMAC signature
- **409 Conflict**: Idempotency key already processed
- **500 Internal Server Error**: Processing failure (queued for retry)

## Next Steps

1. Implement SalesOrderService integration
2. Implement ProductService integration
3. Add real-time SSE for dashboard updates
4. Build conflict resolution UI modal
5. Add email notifications for critical conflicts
6. Implement analytics dashboard
