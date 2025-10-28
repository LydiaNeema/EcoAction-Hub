-- Emergency SQL to create all required tables
-- Run this directly in your PostgreSQL database

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    reset_token VARCHAR(100),
    reset_token_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_users_email ON users (email);

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id),
    full_name VARCHAR(120),
    bio TEXT DEFAULT '',
    county VARCHAR(100),
    area VARCHAR(120),
    avatar_url VARCHAR(255),
    member_since DATE DEFAULT CURRENT_DATE,
    issues_reported INTEGER DEFAULT 0,
    alerts_responded INTEGER DEFAULT 0,
    community_impact INTEGER DEFAULT 0,
    trees_planted INTEGER DEFAULT 0,
    impact_points INTEGER DEFAULT 0,
    issues_this_month INTEGER DEFAULT 0,
    alerts_this_month INTEGER DEFAULT 0,
    impact_this_month INTEGER DEFAULT 0,
    trees_this_month INTEGER DEFAULT 0
);

-- Emergency contacts table
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id SERIAL PRIMARY KEY,
    service VARCHAR(100) NOT NULL,
    type VARCHAR(100) NOT NULL,
    number VARCHAR(50) NOT NULL,
    county VARCHAR(100),
    location VARCHAR(200),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Emergency alerts table  
CREATE TABLE IF NOT EXISTS emergency_alerts (
    id SERIAL PRIMARY KEY,
    type VARCHAR(100) NOT NULL,
    location VARCHAR(200) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    description TEXT,
    recommendation TEXT,
    affected_areas VARCHAR(200),
    county VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- Community actions table
CREATE TABLE IF NOT EXISTS community_actions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    location VARCHAR(200) NOT NULL,
    date TIMESTAMP NOT NULL,
    organizer VARCHAR(120),
    participants_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    icon_url VARCHAR(255),
    requirement_type VARCHAR(50),
    requirement_value INTEGER
);

-- Dashboard stats table
CREATE TABLE IF NOT EXISTS dashboard_stats (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    total_issues_reported INTEGER DEFAULT 0,
    total_actions_joined INTEGER DEFAULT 0,
    total_community_impact INTEGER DEFAULT 0,
    total_trees_planted INTEGER DEFAULT 0,
    monthly_issues_increase INTEGER DEFAULT 0,
    monthly_actions_increase INTEGER DEFAULT 0,
    flood_reports_this_month INTEGER DEFAULT 0,
    heat_alerts_active BOOLEAN DEFAULT false,
    upcoming_events_count INTEGER DEFAULT 0,
    air_quality_improvement FLOAT DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI intelligence table
CREATE TABLE IF NOT EXISTS ai_intelligence (
    id SERIAL PRIMARY KEY,
    user_county VARCHAR(100) NOT NULL,
    insight_type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- Recent activities table
CREATE TABLE IF NOT EXISTS recent_activities (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    activity_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Emergency reports table
CREATE TABLE IF NOT EXISTS emergency_reports (
    id SERIAL PRIMARY KEY,
    reporter_name VARCHAR(100),
    reporter_phone VARCHAR(20),
    reporter_email VARCHAR(100),
    emergency_type VARCHAR(100) NOT NULL,
    location VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(120) NOT NULL,
    phone VARCHAR(20),
    category VARCHAR(100) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User achievements junction table
CREATE TABLE IF NOT EXISTS user_achievements (
    user_id INTEGER NOT NULL REFERENCES users(id),
    achievement_id INTEGER NOT NULL REFERENCES achievements(id),
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, achievement_id)
);

-- Action participants table
CREATE TABLE IF NOT EXISTS action_participants (
    id SERIAL PRIMARY KEY,
    action_id INTEGER NOT NULL REFERENCES community_actions(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(action_id, user_id)
);

-- Alembic version table (for migration tracking)
CREATE TABLE IF NOT EXISTS alembic_version (
    version_num VARCHAR(32) NOT NULL PRIMARY KEY
);

-- Insert current migration version
INSERT INTO alembic_version (version_num) VALUES ('db5e406b0f23') ON CONFLICT DO NOTHING;

-- Success message
SELECT 'All tables created successfully!' as status;
