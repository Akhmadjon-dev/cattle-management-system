# Cattle Management API

## Overview

REST API for managing cattle records and health events.

## Running the Server

```bash
npm run dev      # Development with auto-reload
npm run build    # Compile TypeScript
npm start        # Production
npm run seed     # Reset database with test data
```

## Base URL

```
http://localhost:3001
```

## Error Responses

All error responses follow this shape:

```json
{ "error": "descriptive message" }
```

Status codes:
- `400` Bad Request — invalid input, validation failed
- `404` Not Found — resource doesn't exist
- `500` Internal Server Error

---

## Cattle Endpoints

### GET /cattle

List all cattle with optional filters.

**Query Parameters:**
- `status` (optional) — Filter by status: `active`, `sold`, `deceased`, `removed`
- `breed` (optional) — Filter by breed name
- `search` (optional) — Search by tag (case-insensitive, partial match)

**Example:**
```bash
GET /cattle
GET /cattle?status=active
GET /cattle?breed=Angus
GET /cattle?search=TAG-0001
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "tag": "TAG-0001",
      "breed": "Angus",
      "gender": "male",
      "birth_date": "2022-01-15",
      "status": "active",
      "created_at": "2024-01-01T10:00:00.000Z",
      "updated_at": "2024-01-01T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

### GET /cattle/:id

Get a single cattle record.

**Response:**
```json
{
  "data": { /* cattle object */ }
}
```

**Errors:**
- `404` — Cattle not found

---

### POST /cattle

Create a new cattle record.

**Required fields:**
- `tag` (string, unique) — Ear tag identifier
- `breed` (string) — Breed name
- `gender` (string) — `male` or `female`
- `birth_date` (string) — YYYY-MM-DD format

**Example:**
```bash
curl -X POST http://localhost:3001/cattle \
  -H "Content-Type: application/json" \
  -d '{
    "tag": "TAG-0025",
    "breed": "Hereford",
    "gender": "female",
    "birth_date": "2023-03-10"
  }'
```

**Response:** `201 Created`
```json
{
  "data": { /* created cattle with id and timestamps */ }
}
```

**Errors:**
- `400` — Missing/invalid fields, tag already exists

---

### PATCH /cattle/:id

Partially update a cattle record.

**Allowed fields:** `tag`, `breed`, `gender`, `birth_date`, `status`

**Example — Update status (soft delete):**
```bash
curl -X PATCH http://localhost:3001/cattle/uuid \
  -H "Content-Type: application/json" \
  -d '{ "status": "sold" }'
```

**Example — Update breed:**
```bash
curl -X PATCH http://localhost:3001/cattle/uuid \
  -H "Content-Type: application/json" \
  -d '{ "breed": "Simmental" }'
```

**Response:** `200 OK`
```json
{
  "data": { /* updated cattle */ }
}
```

**Errors:**
- `404` — Cattle not found
- `400` — Invalid/conflicting data

---

### DELETE /cattle/:id

Soft delete a cattle record (sets status to `removed`).

**Response:** `204 No Content`

**Notes:**
- Does not physically delete the record
- Sets `status` to `removed`
- Record is excluded from `GET /cattle` list (unless explicitly filtered)
- Still included in analytics for historical analysis

---

## Health Events Endpoints

### POST /cattle/:cattleId/health-events

Add a health event for a cattle record.

**Required fields:**
- `type` (string) — `vaccination`, `treatment`, or `checkup`
- `date` (string) — YYYY-MM-DD format
- `notes` (string, optional) — Event notes

**Example:**
```bash
curl -X POST http://localhost:3001/cattle/uuid/health-events \
  -H "Content-Type: application/json" \
  -d '{
    "type": "vaccination",
    "date": "2024-06-15",
    "notes": "Annual flu shot"
  }'
```

**Response:** `201 Created`
```json
{
  "data": {
    "id": "uuid",
    "cattle_id": "uuid",
    "type": "vaccination",
    "date": "2024-06-15",
    "notes": "Annual flu shot",
    "created_at": "2024-06-15T14:30:00.000Z"
  }
}
```

**Errors:**
- `404` — Cattle not found
- `400` — Invalid event type or date format

---

### GET /cattle/:cattleId/health-events

List all health events for a cattle record.

**Response:**
```json
{
  "data": [
    { /* health event objects */ }
  ],
  "count": 5
}
```

**Errors:**
- `404` — Cattle not found

---

## Analytics Endpoint

### GET /analytics

Dashboard metrics and breakdowns.

**Response:**
```json
{
  "summary": {
    "totalActive": 15,
    "totalCount": 20
  },
  "byStatus": [
    { "status": "active", "count": 15 },
    { "status": "sold", "count": 3 },
    { "status": "deceased", "count": 1 },
    { "status": "removed", "count": 1 }
  ],
  "byBreed": [
    { "breed": "Angus", "count": 5 },
    { "breed": "Hereford", "count": 4 }
  ],
  "byGender": [
    { "gender": "male", "count": 8 },
    { "gender": "female", "count": 7 }
  ],
  "ageDistribution": [
    { "range": "0-1 years", "count": 2 },
    { "range": "1-3 years", "count": 4 },
    { "range": "3-5 years", "count": 6 },
    { "range": "5-8 years", "count": 2 },
    { "range": "8+ years", "count": 1 }
  ]
}
```

**Notes:**
- `totalActive` = active cattle only
- `totalCount` = all cattle (all statuses)
- `byBreed`, `byGender`, `ageDistribution` = active only
- `byStatus` = includes all statuses for awareness

---

## Design Decisions

### Soft Deletes
Cattle are never physically deleted. The `DELETE /cattle/:id` endpoint sets `status = removed`. This allows:
- Historical record keeping
- Undo capability
- Accurate analytics (removed animals still count toward "total"/"by status")
- Default `GET /cattle` list excludes removed/sold/deceased (active focus)

### Validation
- Minimal but strict: required fields, enum constraints, date format
- Tag uniqueness enforced at database level
- Errors return `400` with clear messages

### Analytics Strategy
Multiple focused queries instead of one giant query:
1. Active count (simple filter)
2. By status (GROUP BY)
3. By breed (GROUP BY, active only)
4. By gender (GROUP BY, active only)
5. By age (computed bucketing, active only)

This makes each query readable and independently testable.

### Database
- SQLite with WAL mode for concurrent access
- Indexes on `status` and `breed` for fast filters
- Unique constraint on `tag`
- Foreign key: health_events → cattle (CASCADE delete)
