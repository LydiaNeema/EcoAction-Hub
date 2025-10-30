# EcoAction Hub

A comprehensive platform connecting communities to solve local climate challenges through AI-powered emergency response and community collaboration.

## Live Demo

- **Frontend**: [https://eco-action-hub-puce.vercel.app](https://eco-action-hub-puce.vercel.app)
- **Backend API**: [https://ecoaction-hub.onrender.com](https://ecoaction-hub.onrender.com)
- **API Documentation (Swagger)**: [https://ecoaction-hub.onrender.com/api/docs](https://ecoaction-hub.onrender.com/api/docs)

## Project Overview

EcoAction Hub enables communities to respond effectively to climate emergencies while building long-term resilience through collective action. The platform combines real-time emergency reporting, community action coordination, and AI-powered intelligence.

## Features

### Core Functionality
- **Emergency Response**: Real-time climate emergency reporting and coordination
- **Community Actions**: Collaborative environmental projects and initiatives  
- **AI Integration**: Smart recommendations using Hugging Face Phi-3-mini model
- **User Profiles**: Impact tracking and achievement system
- **File Upload**: Image upload functionality for actions and reports

### Key Capabilities
- Real-time alerts for floods, heatwaves, and pollution spikes
- Community action creation and participation tracking
- Emergency contact database (14+ services for Nairobi)
- User authentication and profile management
- Admin tools for content management

## Technology Stack

### Frontend (Client)
- **Framework**: Next.js 15.5.6 with React 19
- **Styling**: TailwindCSS 4
- **Icons**: Lucide React
- **Forms**: Formik + Yup validation
- **Build**: Turbopack for fast development

### Backend (Server)
- **Framework**: Flask 3.0.3 with RESTful API
- **Database**: PostgreSQL with SQLAlchemy 2.0
- **Authentication**: JWT with Flask-JWT-Extended
- **Migrations**: Flask-Migrate with Alembic
- **AI Integration**: Hugging Face API (Microsoft Phi-3-mini-4k-instruct)
- **Image Processing**: Pillow for upload handling
- **Production Server**: Gunicorn

### Deployment
- **Frontend**: Vercel
- **Backend**: Render.com with PostgreSQL
- **File Storage**: Local filesystem (expandable to CDN)
- **Environment**: Production/Development configs

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Community Actions
- `GET /api/community/actions` - List all actions
- `POST /api/community/actions` - Create new action
- `PUT /api/community/actions/<id>` - Update action (creator only)
- `DELETE /api/community/actions/<id>` - Delete action (creator only)
- `POST /api/community/actions/<id>/join` - Join action
- `POST /api/community/actions/<id>/leave` - Leave action
- `GET /api/community/my-actions` - Get user's joined actions

### Emergency Management
- `GET /api/emergency/alerts` - List emergency alerts
- `POST /api/emergency/reports` - Submit emergency report
- `GET /api/emergency/contacts` - Get emergency contacts
- `GET /api/emergency/insights` - Get AI insights

### File Upload
- `POST /api/upload/image` - Upload image file
- `GET /api/upload/images/<filename>` - Serve uploaded image
- `DELETE /api/upload/images/<filename>` - Delete image (owner only)

### User Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile

## Project Structure

```
EcoAction-Hub/
├── client/                  # Next.js frontend
│   ├── src/
│   │   ├── app/            # Next.js app directory
│   │   ├── services/       # API service functions
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── package.json
└── server/                 # Flask backend
    ├── app/
    │   ├── models/         # Database models
    │   ├── routes/         # API endpoints
    │   ├── schemas/        # Validation schemas
    │   └── __init__.py     # App factory
    ├── migrations/         # Database migrations
    ├── requirements.txt
    └── run.py             # Application entry point
```

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- Python 3.11+
- PostgreSQL database

### Backend Setup
1. Navigate to server directory:
   ```bash
   cd server
   ```

2. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. Initialize database:
   ```bash
   flask db upgrade
   ```

6. Run development server:
   ```bash
   python run.py
   ```

### Frontend Setup
1. Navigate to client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Create .env.local with your API base URL
   NEXT_PUBLIC_API_BASE=http://localhost:5000/api
   ```

4. Run development server:
   ```bash
   npm run dev
   ```

## Environment Variables

### Backend (.env)
```
FLASK_APP=run.py
FLASK_ENV=development
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret
DATABASE_URL=postgresql://user:password@localhost/ecoaction_hub
HUGGINGFACE_API_KEY=your-huggingface-api-key
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_BASE=http://localhost:5000/api
```

## Deployment

### Backend (Render.com)
1. Connect GitHub repository to Render
2. Configure build settings:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn --bind 0.0.0.0:$PORT run:app`
3. Set environment variables in Render dashboard
4. Database migrations run automatically via Procfile

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set build settings:
   - Framework Preset: Next.js
   - Root Directory: client
3. Configure environment variables
4. Deploy automatically on push to main branch

## AI Integration

The platform uses Hugging Face API with Microsoft's Phi-3-mini-4k-instruct model for:
- Emergency classification and prioritization
- Smart action recommendations
- Content analysis and insights
- Automated response suggestions

Fallback to rule-based responses ensures reliability when AI service is unavailable.

## Database Schema

Key models:
- **User**: Authentication and basic profile
- **Profile**: Extended user profile with impact metrics
- **CommunityAction**: Environmental actions and projects
- **ActionParticipant**: User participation in actions
- **EmergencyAlert**: Emergency notifications
- **EmergencyReport**: User-submitted emergency reports
- **EmergencyContact**: Emergency service contact information

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make changes and test thoroughly
4. Commit with clear messages: `git commit -m "Add feature description"`
5. Push to branch: `git push origin feature-name`
6. Create a Pull Request

## Security Considerations

- JWT-based authentication with secure token handling
- Input validation using Pydantic schemas
- SQL injection prevention through SQLAlchemy ORM
- File upload validation and size limits
- CORS configuration for secure cross-origin requests
- Environment-based configuration management

## Performance Features

- Database indexing for fast queries
- Image compression for optimized uploads
- Efficient pagination for large datasets
- Caching strategies for frequently accessed data
- Optimized SQL queries with proper relationships

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check existing GitHub issues
2. Create new issue with detailed description
3. Include error messages and steps to reproduce
4. Provide environment details (OS, browser, versions)

## Roadmap

Future enhancements:
- Mobile app development
- IoT sensor integration
- Advanced analytics dashboard
- Multi-language support
- Enhanced mapping features
- Real-time notifications
- Social media integration
