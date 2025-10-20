# Testing AI Features

This document explains how to test the new AI features in the resume builder.

## How to Test

1. Start the backend server:
   ```
   cd backend
   node server.js
   ```

2. Start the frontend:
   ```
   npm run dev
   ```

3. Navigate to http://localhost:5173/test-ai

4. Fill in some resume information if needed

5. Select your profession from the dropdown

6. Click "Enhance with AI"

7. You should see AI suggestions appear in the following places:
   - Professional Summary section (below the textarea)
   - Work Experience section (suggested bullet points)
   - Skills section (below the skills list)

## Troubleshooting

If the AI suggestions are not appearing:

1. Check the browser console for any JavaScript errors
2. Verify the backend server is running at http://localhost:3000
3. Check that the backend server console doesn't show any errors
4. Make sure you have a valid GOOGLE_API_KEY in the backend .env file

## Expected Behavior

When you click "Enhance with AI":
1. The button should show a loading spinner
2. After a few seconds, AI suggestions should appear
3. Each suggestion should have three action buttons:
   - Checkmark (✅) to accept the suggestion
   - Pencil (📝) to edit the suggestion
   - X (❌) to dismiss the suggestion
4. When you accept a suggestion, it should be applied to the relevant field

## Test Routes

- Main test page: http://localhost:5173/test-ai
- Backend test route: http://localhost:3000/api/test
- Backend AI suggestions route: http://localhost:3000/api/gemini-suggestions

## Debugging Information

The test page includes a debug panel on the right side that shows:
- Current resume data
- AI suggestions as they are received

You can also check the browser console for detailed logging of:
- When AI suggestions are received
- When suggestions are being retrieved for specific fields
- When suggestions are accepted or dismissed