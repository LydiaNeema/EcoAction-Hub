# EcoAction Hub

**Turning Climate Concern Into Community Action**

A comprehensive platform connecting communities to solve local climate challenges through AI-powered emergency response and collaborative environmental initiatives.

## 🌍 Project Overview

EcoAction Hub is a full-stack web application that empowers communities to respond effectively to climate emergencies while building long-term environmental resilience through collective action.

### Key Features

🚨 **Emergency Response**
- Real-time climate emergency reporting and coordination
- Instant alerts for floods, heatwaves, and pollution spikes
- Direct connection to emergency services
- AI-powered emergency classification and routing

🤝 **Community Action**
- Collaborative environmental projects and initiatives
- Local cleanup events and sustainability programs
- Skill-sharing and resource coordination
- Progress tracking and impact measurement

🤖 **AI-Powered Intelligence**
- Smart recommendations using Hugging Face AI (Microsoft Phi-3-mini)
- Automated emergency classification and routing
- Predictive insights for community planning
- Fallback to rule-based responses for reliability

## 🏗️ Architecture

### Frontend (Client)
- **Framework**: Next.js 15.5.6 with React 19
- **Styling**: TailwindCSS 4 for responsive, modern UI
- **Icons**: Lucide React for consistent visual language
- **Forms**: Formik + Yup for robust form handling and validation
- **Location**: `/client/`

### Backend (Server)
- **Framework**: Flask 3.0.3 with RESTful API architecture
- **Database**: PostgreSQL with SQLAlchemy 2.0 for reliable data management
- **Authentication**: JWT-based secure user sessions
- **AI Integration**: Hugging Face API with Microsoft Phi-3-mini model
- **Location**: `/server/`

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Python 3.11+
- PostgreSQL database
- Git

### Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install
# or
yarn install

# Start development server
npm run dev
# or
yarn dev

# Open http://localhost:3000 in your browser
```

The frontend uses Next.js with automatic hot reloading. You can start editing pages in `app/page.js` and see changes immediately.

### Backend Setup

```bash
# Navigate to server directory
cd server

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables (see Configuration section)
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
flask db upgrade

# Start development server
python run.py
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the server directory with the following variables:

**Required:**
```env
FLASK_APP=run.py
FLASK_ENV=development
FLASK_DEBUG=true
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here
DATABASE_URL=postgresql://username:password@localhost/ecoaction_hub
```

**Optional:**
```env
HUGGINGFACE_API_KEY=your-huggingface-api-key
FRONTEND_URL=http://localhost:3000
SEED_DATA=true
PYTHONDONTWRITEBYTECODE=1
```

### Database Setup

1. Create a PostgreSQL database named `ecoaction_hub`
2. Update the `DATABASE_URL` in your `.env` file
3. Run migrations: `flask db upgrade`
4. (Optional) Seed initial data: Set `SEED_DATA=true` in `.env`

## 🗂️ Project Structure

```
EcoAction-Hub/
├── client/                          # Next.js Frontend
│   ├── src/
│   │   ├── app/                     # App Router pages
│   │   │   ├── ai/                  # AI chat interface
│   │   │   ├── auth/                # Authentication pages
│   │   │   ├── community/           # Community actions
│   │   │   ├── dashboard/           # User dashboard
│   │   │   ├── emergency/           # Emergency reporting
│   │   │   └── profile/             # User profile
│   │   ├── components/              # Reusable UI components
│   │   ├── context/                 # React context providers
│   │   ├── services/                # API service functions
│   │   └── utils/                   # Utility functions
│   ├── public/                      # Static assets
│   │   ├── assets/                  # Images and media
│   │   └── uploads/                 # User uploaded images
│   ├── package.json
│   └── next.config.mjs
├── server/                          # Flask Backend
│   ├── app/
│   │   ├── models/                  # Database models
│   │   ├── routes/                  # API endpoints
│   │   ├── schemas/                 # Data validation schemas
│   │   └── __init__.py              # Flask app factory
│   ├── migrations/                  # Database migrations
│   ├── requirements.txt             # Python dependencies
│   ├── run.py                       # Application entry point
│   └── seed_*.py                    # Data seeding scripts
└── README.md                        # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - User logout

### Emergency Management
- `GET /api/emergency/alerts` - Get emergency alerts
- `POST /api/emergency/reports` - Create emergency report
- `GET /api/emergency/insights` - Get AI-powered insights
- `GET /api/emergency/contacts` - Get emergency contacts

### Community Actions
- `GET /api/community/actions` - Get community actions
- `POST /api/community/actions` - Create new action
- `PUT /api/community/actions/:id` - Edit action (creator only)
- `DELETE /api/community/actions/:id` - Delete action (creator only)
- `POST /api/community/actions/:id/join` - Join an action
- `DELETE /api/community/actions/:id/leave` - Leave an action
- `GET /api/community/stats` - Get community statistics

### AI Integration
- `POST /api/ai/chat` - AI chat interface
- `POST /api/ai/emergency-classify` - Classify emergency reports

### File Upload
- `POST /api/upload/image` - Upload and process images (JWT required)
- `DELETE /api/upload/image/:filename` - Delete uploaded images (JWT required)

## 🚀 Deployment

### Production Deployment on Render.com

#### Prerequisites
- Render.com account
- GitHub repository with the code
- Hugging Face API key (optional, for AI features)

#### Database Setup
1. In Render dashboard, create a new PostgreSQL database:
   - Name: `ecoaction-hub-db`
   - Database Name: `ecoaction_hub`
   - User: `ecoaction_user`
   - Note down the connection string

#### Backend Deployment
1. Create a new Web Service in Render
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `ecoaction-hub-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn --bind 0.0.0.0:$PORT run:app`
   - **Root Directory**: `server`

#### Environment Variables for Production
Set these in Render dashboard:

**Required:**
- `FLASK_APP`: `run.py`
- `FLASK_ENV`: `production`
- `FLASK_DEBUG`: `false`
- `SECRET_KEY`: Generate a secure random string
- `JWT_SECRET_KEY`: Generate a secure random string
- `DATABASE_URL`: Use the PostgreSQL connection string

**Optional:**
- `HUGGINGFACE_API_KEY`: Your Hugging Face API key
- `FRONTEND_URL`: Your frontend URL for CORS
- `SEED_DATA`: `true` (only for first deployment)

#### Frontend Deployment
Deploy the Next.js frontend to Vercel:

1. Connect your GitHub repository to Vercel
2. Set the root directory to `client`
3. Configure environment variables for API endpoints
4. Deploy

### File Requirements for Deployment

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

## 🎯 Features in Detail

### Emergency Response System
- **Real-Time Reporting**: Users can instantly report flooding, pollution, wildfires
- **Smart Categorization**: AI automatically classifies and prioritizes emergencies
- **Emergency Contacts**: Integrated database of emergency services
- **Live Updates**: Real-time status tracking and community notifications
- **Geolocation**: Location-based emergency mapping and response coordination

### Community Collaboration
- **Action Creation**: Users can start environmental initiatives and projects
- **Action Management**: Edit and update your own community actions
- **Skill Matching**: Connect people with complementary skills and resources
- **Event Coordination**: Organize cleanup drives, tree planting, awareness campaigns
- **Progress Tracking**: Monitor community impact and project outcomes
- **Resource Sharing**: Tools, equipment, and knowledge exchange platform
- **Image Upload**: Upload and manage images for community actions

### AI Integration
**Hugging Face Integration**
- **Model**: Microsoft Phi-3-mini-4k-instruct (3.8B parameters)
- **Capabilities**: Natural language understanding, emergency classification
- **Fallback System**: Rule-based responses ensure reliability

**AI Applications**
- **Emergency Triage**: Automatically prioritize urgent vs. non-urgent reports
- **Smart Recommendations**: Suggest relevant community actions
- **Content Moderation**: Ensure appropriate community interactions
- **Predictive Insights**: Identify patterns in environmental data

## 🛠️ Development

### Python Cache Configuration

This project prevents Python from creating `__pycache__` files:

#### Configuration Methods
1. **Environment Variable** (Recommended): `PYTHONDONTWRITEBYTECODE=1` is set in `server/run.py`
2. **Global Environment**: `export PYTHONDONTWRITEBYTECODE=1`
3. **Python Flag**: `python -B run.py`

#### Benefits
- **Cleaner repository**: No bytecode files in version control
- **Reduced conflicts**: Eliminates merge conflicts from cache files
- **Better performance**: Slightly slower startup but cleaner development environment

### Seeded Data

The application includes seeding scripts for:
- **Emergency Contacts**: 14 contacts for Nairobi County (Police, Fire, Ambulance, Hospitals)
- **Community Actions**: Sample community actions for testing

**Note**: Seeded data will only be deployed if `SEED_DATA=true` environment variable is set.

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Input Validation**: Comprehensive data validation using Pydantic schemas
- **SQL Injection Protection**: SQLAlchemy ORM prevents SQL injection
- **Environment Variables**: Sensitive data stored in environment variables
- **Image Upload Security**: File type validation, size limits, and secure filename generation
- **Action Ownership**: Users can only edit/delete their own community actions
- **File Upload Authentication**: JWT required for all image upload operations

## 📊 Database Schema

### Key Models
- **User**: User authentication and profile information
- **CommunityAction**: Environmental initiatives and projects
- **EmergencyReport**: Climate emergency reports and alerts
- **ActionParticipant**: User participation in community actions
- **Profile**: Extended user profile with impact metrics
- **EmergencyContact**: Emergency service contact information

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd server
python -m pytest

# Frontend tests
cd client
npm test
```

### Testing New Features

#### Image Upload Testing
1. Start both servers (`python run.py` in server, `npm run dev` in client)
2. Navigate to http://localhost:3000/community
3. Click "Start New Action" 
4. Upload an image (PNG, JPG, JPEG, GIF, WEBP - max 5MB)
5. Verify image preview and successful upload
6. Submit form and check action displays with image

#### Edit Action Testing
1. Create a community action (you'll be the owner)
2. Look for the blue "EDIT ACTION" button on your action card
3. Click edit to open pre-filled modal
4. Modify fields and save changes
5. Verify updates appear immediately in action list

**Note**: Edit buttons only appear for actions you created

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

**Build Failures**
- Check requirements.txt for dependency conflicts
- Ensure Python 3.11+ is installed
- Verify Node.js 18+ is installed

**Database Connection**
- Verify DATABASE_URL format and credentials
- Ensure PostgreSQL is running
- Check database permissions

**CORS Errors**
- Ensure FRONTEND_URL is set correctly in backend
- Check allowed origins in Flask CORS configuration

**Image Upload Issues**
- Verify uploads directory exists and is writable
- Check file size and type restrictions
- Ensure Pillow is installed for image processing

**AI Features Not Working**
- Verify HUGGINGFACE_API_KEY is set correctly
- Check API key permissions and quotas
- Fallback responses should still work without API key

### Health Check Endpoint
```
GET /
```
Returns API status and available endpoints.

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the troubleshooting section above
- Review the deployment logs for error details

## ✨ Latest Features

### Image Upload System
- **Secure Upload**: JWT authentication with file validation
- **Image Processing**: Automatic compression and resizing (max 800x600, 85% quality)
- **File Management**: Upload, preview, and delete functionality
- **Storage**: Local development storage with cloud-ready architecture

### Action Management
- **Edit Actions**: Users can edit their own community actions
- **Visual Indicators**: Blue edit button for action creators
- **Pre-filled Forms**: Edit modal loads existing action data
- **Ownership Validation**: Backend ensures only creators can modify actions

### Enhanced Security
- **File Type Validation**: Only image files allowed (PNG, JPG, JPEG, GIF, WEBP)
- **Size Limits**: Maximum 5MB file uploads
- **Secure Filenames**: UUID-based naming prevents conflicts
- **Permission Checks**: Action ownership validated on all operations

## 🚀 Future Roadmap

- **Cloud Storage**: AWS S3 or Cloudinary integration for production
- **Mobile App**: Native iOS/Android applications
- **IoT Integration**: Environmental sensor data integration
- **Advanced Analytics**: Climate impact measurement and reporting
- **Multi-Language**: Localization for global communities
- **Government Integration**: Official emergency service partnerships

---

**Vision**: *Empowering every community to become climate-resilient through technology, collaboration, and collective action.*
