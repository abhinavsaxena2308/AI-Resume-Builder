# Environment Setup Guide

## Backend Configuration (.env file)

Create a `.env` file in the `backend/` directory with the following variables:

```env
GOOGLE_API_KEY=your_actual_google_api_key_here
PORT=3000
```

### Getting Your Google API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create a new API key
3. Copy the key and paste it as the value for `GOOGLE_API_KEY`

## Frontend Configuration (.env file)

Create a `.env` file in the root directory with the following variables:

```env
VITE_BACKEND_URL=http://localhost:3000
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

### Environment-Specific URLs

For development:
```env
VITE_BACKEND_URL=http://localhost:3000
```

For production (example):
```env
VITE_BACKEND_URL=https://your-production-backend-url.com
```

## Running the Application

### Development Mode

1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

2. Start the frontend:
   ```bash
   npm run dev
   ```

### Production Mode

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Serve the built files with your preferred hosting solution

## Troubleshooting

### "Cannot POST /api/gemini-suggestions" Error

This error typically occurs when:

1. The backend server is not running
2. The `.env` file is missing or incorrectly configured
3. The `GOOGLE_API_KEY` is invalid or missing

**Solution:**
1. Ensure the backend server is running on the correct port
2. Verify the `.env` file exists in the `backend/` directory
3. Check that `GOOGLE_API_KEY` is correctly set
4. Restart both frontend and backend servers after making changes

### CORS Issues

If you encounter CORS errors, ensure the frontend URL is added to the `allowedOrigins` array in `backend/server.js`:

```javascript
const allowedOrigins = [
  "http://localhost:5173", // Vite dev server
  "https://your-production-frontend-url.com", // Your production frontend
];
```

## API Endpoints

### Backend Routes

- `POST /api/gemini-suggestions` - Get AI-powered resume suggestions
- `POST /generate-summary` - Generate professional summary
- `POST /api/generate-pdf` - Generate PDF resume
- `GET /api/test` - Test backend connectivity

### Frontend Environment Variables

- `VITE_BACKEND_URL` - Base URL for backend API calls
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Supabase publishable key