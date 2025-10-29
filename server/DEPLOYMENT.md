# EcoAction-Hub Backend Deployment Guide

## Render.com Deployment

### Prerequisites
- Render.com account
- GitHub repository with the backend code
- OpenAI API key (optional, for AI features)

### Deployment Steps

#### 1. Database Setup
1. In Render dashboard, create a new PostgreSQL database:
   - Name: `ecoaction-hub-db`
   - Database Name: `ecoaction_hub`
   - User: `ecoaction_user`
   - Note down the connection string

#### 2. Web Service Setup
1. Create a new Web Service in Render
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `ecoaction-hub-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn --bind 0.0.0.0:$PORT run:app`
   - **Root Directory**: `server` (if backend is in server folder)

#### 3. Environment Variables
Set the following environment variables in Render dashboard:

**Required:**
- `FLASK_APP`: `run.py`
- `FLASK_ENV`: `production`
- `FLASK_DEBUG`: `false`
- `SECRET_KEY`: Generate a secure random string
- `JWT_SECRET_KEY`: Generate a secure random string
- `DATABASE_URL`: Use the PostgreSQL connection string from step 1

**Optional:**
- `HUGGINGFACE_API_KEY`: Your Hugging Face API key for AI features (replaces OPENAI_API_KEY)
- `FRONTEND_URL`: Your frontend URL for CORS (e.g., `https://eco-action-hub-puce.vercel.app`)
- `SEED_DATA`: `true` (only for first deployment to seed initial data)

#### 4. Deploy
1. Click "Deploy" in Render dashboard
2. Monitor the build logs
3. Once deployed, the database migrations will run automatically

### File Structure for Deployment

The following files are required for Render.com deployment:

```
server/
├── requirements.txt          # Python dependencies
├── runtime.txt              # Python version specification
├── Procfile                 # Process definitions
├── render.yaml              # Render configuration (optional)
├── deploy.py                # Deployment script
├── run.py                   # Application entry point
├── app/                     # Flask application
├── migrations/              # Database migrations
└── seed_*.py               # Data seeding scripts
```

### Database Migrations

Migrations are handled automatically during deployment via the `release` process in Procfile:
```
release: flask db upgrade
```

### Seeded Data

The application includes seeding scripts for:
- **Emergency Contacts**: 14 contacts for Nairobi County (Police, Fire, Ambulance, Hospitals)
- **Community Actions**: 6 sample community actions for testing

**Note**: Seeded data will only be deployed if `SEED_DATA=true` environment variable is set. This should only be used for the initial deployment.

### PostgreSQL Compatibility

✅ **Fully Compatible**: The application uses:
- SQLAlchemy 2.0.43 with PostgreSQL support
- psycopg2-binary 2.9.10 for PostgreSQL connectivity
- Proper URL format handling (postgres:// → postgresql://)
- Flask-Migrate for database schema management

### Production Considerations

1. **Security**: All secret keys should be generated securely
2. **CORS**: Frontend URL must be added to allowed origins
3. **Database**: PostgreSQL is used instead of SQLite
4. **Logging**: Consider adding proper logging configuration
5. **Monitoring**: Set up health checks and monitoring

### Troubleshooting

**Common Issues:**
1. **Build Failures**: Check requirements.txt for dependency conflicts
2. **Database Connection**: Verify DATABASE_URL format and credentials
3. **CORS Errors**: Ensure FRONTEND_URL is set correctly
4. **Migration Errors**: Check migration files for PostgreSQL compatibility

**Health Check Endpoint:**
```
GET /
```
Returns API status and available endpoints.

### Post-Deployment

1. Test all API endpoints
2. Verify database connections
3. Check that seeded data is present (if enabled)
4. Test authentication flows
5. Verify AI features (if OpenAI key provided)

### Scaling

Render.com automatically handles:
- Load balancing
- SSL certificates
- Health checks
- Auto-scaling based on traffic
