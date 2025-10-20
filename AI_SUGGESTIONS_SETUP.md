# AI Resume Suggestions Feature Setup

This document explains how to set up and use the AI-powered resume suggestions feature that uses the Gemini API.

## Backend Setup

1. **Environment Variables**:
   - Add your Google API key to `backend/.env`:
     ```
     GOOGLE_API_KEY=your_actual_google_api_key_here
     PORT=3000
     ```

2. **Dependencies**:
   - The required dependencies are already included in `backend/package.json`

3. **Routes**:
   - The new route `/api/gemini-suggestions` is automatically registered in `server.js`

## Frontend Integration

The AI suggestions feature is integrated into the resume builder through:

1. **Custom Hook**: `src/hooks/useGeminiSuggestions.js`
2. **Component**: `src/components/resume/AISuggestions.jsx`
3. **Integration**: Added to `src/components/resume/ResumeForm.jsx`

## How It Works

1. Users select their profession type (Coder, Researcher, Student, Designer, or Other)
2. The resume data is sent to the backend endpoint `/api/gemini-suggestions`
3. The backend calls the Gemini API with a prompt tailored to the user's profession
4. Gemini returns personalized suggestions for:
   - Recommended resume sections
   - Enhanced bullet points for experience and projects
   - Suggested skills
   - Professional summary

## API Endpoints

### POST /api/gemini-suggestions

**Request Body**:
```json
{
  "userType": "Coder",
  "resumeData": { /* current resume data */ }
}
```

**Response**:
```json
{
  "recommendedSections": ["string"],
  "enhancedBullets": {
    "experience": ["string"],
    "projects": ["string"]
  },
  "recommendedSkills": ["string"],
  "summarySuggestion": "string"
}
```

## Usage in Resume Builder

1. The AI Suggestions panel appears at the top of the resume form
2. Users select their profession and click "Get Suggestions"
3. Suggestions are displayed in the panel
4. Users can apply suggestions directly to their resume:
   - Click "Apply" next to the summary suggestion to update the summary
   - Click "Add All" for skills to add all recommended skills

## Error Handling

- Invalid API keys will result in error messages
- Network issues are handled with fallback URLs
- JSON parsing errors are caught and logged
- User-friendly error toasts are displayed for all failures

## Models Used

- `gemini-1.5-pro` for both the suggestions and summary generation features