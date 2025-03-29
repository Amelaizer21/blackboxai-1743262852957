# Image Processing API Documentation

## Endpoint
`GET /api/images/process-image/:filename`

## Parameters
- `filename`: Image filename (jpg/jpeg/png only)
- `width`: Output width in pixels (100-2000, default: 800)
- `format`: Output format (webp|jpeg, default: webp)

## Rate Limits
- 100 requests per IP every 15 minutes

## Response
- Processed image file
- Cache headers for 24 hours
- Content-Type based on output format

## Example Request
```bash
curl "http://localhost:3000/api/images/process-image/sample.jpg?width=600&format=webp"
```

## Security Features
- Input validation
- Rate limiting
- Secure headers
- File path sanitization
- Error handling