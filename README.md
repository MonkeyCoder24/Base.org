# The Ghana Base - Backend Setup

This backend stores signup form submissions in a SQLite database.

## Requirements

- Node.js 14+ and npm

## Installation

1. Clone or download the repository.
2. Install dependencies:

```bash
npm install
```

## Running the Server

To start the server:

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will run on `http://localhost:3000`.

## API Endpoints

### POST `/api/signup`

Saves a signup record.

**Request body:**
```json
{
  "first": "John",
  "last": "Doe",
  "email": "john@example.com",
  "birth": "1990-01-15",
  "phone": "+233501234567",
  "region": "Greater Accra",
  "constituency": "Ayawaso Central"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Signup recorded successfully",
  "data": {
    "id": 1,
    "message": "Signup saved successfully"
  }
}
```

### GET `/api/signups`

Retrieves all signups (for admin/dashboard use).

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "birth_date": "1990-01-15",
      "phone": "+233501234567",
      "region": "Greater Accra",
      "constituency": "Ayawaso Central",
      "created_at": "2026-02-22 10:30:00"
    }
  ]
}
```

## Database

- **Location:** `signups.db` (SQLite)
- **Table:** `signups` with fields: id, first_name, last_name, email, birth_date, phone, region, constituency, created_at

The database is automatically created on first run.

## Frontend Integration

The signup form in `signup.html` posts to `/api/signup` and displays success/error messages.

## Troubleshooting

- **"Connection error" on signup:** Ensure the backend server is running on port 3000.
- **CORS errors:** Already handled by the `cors` middleware.
- **Port already in use:** Change the port by setting the `PORT` environment variable:
  ```bash
  PORT=3001 npm start
  ```

## Notes

- All required fields (first, last, email, region, constituency) must be provided.
- Phone and birth date are optional.
- Timestamps are recorded automatically on signup.
