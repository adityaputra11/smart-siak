# Smart SIAK API

## API Structure

The API follows a standardized structure with versioning:

```
/api/v1/[resource]/[action]
```

### Example Endpoints

- Authentication: `/api/v1/auth/login`
- Lecturers: `/api/v1/lecturers`
- Student Profile: `/api/v1/students/profile`

## API Versioning

API versioning is implemented using URI versioning:

- Default version: v1
- Format: `/api/v[version_number]/[resource]`

## Error Response Format

All API errors follow a standardized format:

```json
{
  "success": false,
  "error": {
    "code": 400,
    "message": "Validation failed",
    "details": {
      "validationErrors": {
        "email": ["email must be a valid email address"],
        "password": ["password must be at least 6 characters"]
      },
      "path": "/api/v1/auth/register",
      "method": "POST"
    }
  },
  "timestamp": "2025-03-19T01:21:22.000Z"
}
```

## Success Response Format

All successful API responses follow a standardized format:

```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "message": "Optional success message",
  "timestamp": "2025-03-19T01:21:22.000Z"
}
```

## API Constants

API paths are defined as constants in `src/common/constants/api-paths.constants.ts` to ensure consistency across the application.

## API Controllers

Controllers use the `ApiController` decorator which automatically applies versioning:

```typescript
@ApiController(API_PATHS.LECTURERS.ROOT)
export class LecturerController {
  // Controller methods
}
```
