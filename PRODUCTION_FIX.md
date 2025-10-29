# Image Upload Production Fix

## Issue
Image upload was failing in production with error: "Unexpected token 'T', "The page c"... is not valid JSON"

This happens because the frontend is trying to call `/api/upload/image` but it's hitting a 404 page instead of the API.

## Root Cause
The upload service wasn't using the centralized API configuration, so it was trying to use local paths in production.

## Solution Applied

### 1. Updated Upload Service
- Now uses centralized `endpoints.upload` configuration
- Consistent with other services (community, emergency, etc.)

### 2. Added Upload Endpoint to API Config
```javascript
// In apiConfig.js
upload: `${API_BASE}/upload`
```

### 3. Environment Variable Needed
For production deployment, set this environment variable in Vercel:

```
NEXT_PUBLIC_API_BASE=https://ecoaction-hub.onrender.com/api
```

## Files Modified
- `/client/src/services/uploadService.js` - Updated to use centralized config
- `/client/src/services/apiConfig.js` - Added upload endpoint

## Testing
After setting the environment variable and redeploying:
1. Go to community page
2. Click "Start New Action"
3. Try uploading an image
4. Should now work without JSON parsing errors

## Verification
Check browser network tab - the upload request should go to:
`https://ecoaction-hub.onrender.com/api/upload/image` (not `/api/upload/image`)
