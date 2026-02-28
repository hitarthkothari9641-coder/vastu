-- =====================================================
-- BuildBid E-Quotation Marketplace - Complete SQL Schema
-- Database: SQLite
-- =====================================================

PRAGMA journal_mode=WAL;
PRAGMA foreign_keys=ON;

-- ─── USERS TABLE ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    email           TEXT    UNIQUE NOT NULL,
    password_hash   TEXT    NOT NULL,
    full_name       TEXT    NOT NULL,
    phone           TEXT    UNIQUE,
    avatar_url      TEXT,
    location        TEXT,
    role            TEXT    NOT NULL DEFAULT 'user'
                    CHECK(role IN ('user', 'company', 'admin')),
    is_active       INTEGER DEFAULT 1,
    is_verified     INTEGER DEFAULT 0,
    auth_provider   TEXT    DEFAULT 'email'
                    CHECK(auth_provider IN ('email', 'google', 'phone')),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login      TIMESTAMP
);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ─── SERVICES TABLE ─────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    UNIQUE NOT NULL,
    slug        TEXT    UNIQUE NOT NULL,
    icon        TEXT,
    description TEXT,
    is_active   INTEGER DEFAULT 1
);

-- ─── COMPANIES TABLE ────────────────────────────────
CREATE TABLE IF NOT EXISTS companies (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id             INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name                TEXT    NOT NULL,
    logo_url            TEXT,
    logo_emoji          TEXT    DEFAULT '🏗️',
    description         TEXT,
    location            TEXT,
    city                TEXT,
    state               TEXT,
    experience_years    INTEGER DEFAULT 0,
    website             TEXT,
    
    -- Verification
    gst_number          TEXT    UNIQUE,
    gst_verified        INTEGER DEFAULT 0,
    license_number      TEXT,
    licensed            INTEGER DEFAULT 0,
    license_doc_url     TEXT,
    platform_verified   INTEGER DEFAULT 0,
    verification_status TEXT    DEFAULT 'pending'
                        CHECK(verification_status IN ('pending', 'approved', 'rejected')),
    
    -- Stats
    rating              REAL    DEFAULT 0.0,
    total_reviews       INTEGER DEFAULT 0,
    completed_projects  INTEGER DEFAULT 0,
    success_rate        REAL    DEFAULT 0.0,
    total_earnings      REAL    DEFAULT 0.0,
    
    -- Subscription
    subscription_plan   TEXT    DEFAULT 'free'
                        CHECK(subscription_plan IN ('free', 'basic', 'premium', 'enterprise')),
    subscription_expires TIMESTAMP,
    
    is_active           INTEGER DEFAULT 1,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_companies_city ON companies(city);
CREATE INDEX idx_companies_verification ON companies(verification_status);

-- ─── COMPANY-SERVICES JUNCTION ──────────────────────
CREATE TABLE IF NOT EXISTS company_services (
    company_id  INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    service_id  INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    PRIMARY KEY (company_id, service_id)
);

-- ─── CERTIFICATIONS ─────────────────────────────────
CREATE TABLE IF NOT EXISTS certifications (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id  INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name        TEXT    NOT NULL,
    issuer      TEXT,
    issue_date  DATE,
    expiry_date DATE,
    document_url TEXT,
    verified    INTEGER DEFAULT 0
);

-- ─── FEED PROJECTS (Posts) ──────────────────────────
CREATE TABLE IF NOT EXISTS feed_projects (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id          INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title               TEXT    NOT NULL,
    description         TEXT,
    category            TEXT    NOT NULL,
    cost_min            REAL,
    cost_max            REAL,
    cost_range_display  TEXT,
    timeline            TEXT,
    materials_used      TEXT,   -- JSON array
    location            TEXT,
    likes_count         INTEGER DEFAULT 0,
    saves_count         INTEGER DEFAULT 0,
    shares_count        INTEGER DEFAULT 0,
    views_count         INTEGER DEFAULT 0,
    is_featured         INTEGER DEFAULT 0,
    is_active           INTEGER DEFAULT 1,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_feed_category ON feed_projects(category);

-- ─── PROJECT IMAGES ─────────────────────────────────
CREATE TABLE IF NOT EXISTS project_images (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id  INTEGER NOT NULL REFERENCES feed_projects(id) ON DELETE CASCADE,
    url         TEXT    NOT NULL,
    caption     TEXT,
    is_before   INTEGER DEFAULT 0,
    sort_order  INTEGER DEFAULT 0
);

-- ─── LIKED / SAVED PROJECTS ─────────────────────────
CREATE TABLE IF NOT EXISTS liked_projects (
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id  INTEGER NOT NULL REFERENCES feed_projects(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, project_id)
);

CREATE TABLE IF NOT EXISTS saved_projects (
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id  INTEGER NOT NULL REFERENCES feed_projects(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, project_id)
);

-- ─── QUOTATION REQUESTS ─────────────────────────────
CREATE TABLE IF NOT EXISTS quotation_requests (
    id                    INTEGER PRIMARY KEY AUTOINCREMENT,
    request_code          TEXT    UNIQUE NOT NULL,
    user_id               INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title                 TEXT    NOT NULL,
    description           TEXT,
    service_type          TEXT    NOT NULL,
    
    -- Project Details
    area_sqft             REAL,
    num_rooms             INTEGER,
    location              TEXT,
    city                  TEXT,
    
    -- Budget & Timeline
    budget_min            REAL,
    budget_max            REAL,
    budget_display        TEXT,
    timeline              TEXT,
    urgency               TEXT    DEFAULT 'normal'
                          CHECK(urgency IN ('asap', 'normal', 'flexible')),
    
    -- Material Preferences (JSON)
    material_preferences  TEXT,
    
    -- Green Construction
    green_mode            INTEGER DEFAULT 0,
    
    -- Status
    status                TEXT    DEFAULT 'active'
                          CHECK(status IN ('active', 'closed', 'awarded', 'cancelled', 'expired')),
    total_bids            INTEGER DEFAULT 0,
    awarded_bid_id        INTEGER REFERENCES bids(id),
    
    created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at            TIMESTAMP
);
CREATE INDEX idx_quotation_status ON quotation_requests(status);
CREATE INDEX idx_quotation_service ON quotation_requests(service_type);

-- ─── QUOTATION IMAGES ───────────────────────────────
CREATE TABLE IF NOT EXISTS quotation_images (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    quotation_id    INTEGER NOT NULL REFERENCES quotation_requests(id) ON DELETE CASCADE,
    url             TEXT    NOT NULL,
    filename        TEXT,
    file_type       TEXT
);

-- ─── BIDS TABLE ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS bids (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    bid_code            TEXT    UNIQUE NOT NULL,
    quotation_id        INTEGER NOT NULL REFERENCES quotation_requests(id) ON DELETE CASCADE,
    company_id          INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    
    -- Price Breakdown
    total_price         REAL    NOT NULL,
    labor_cost          REAL    DEFAULT 0,
    material_cost       REAL    DEFAULT 0,
    overhead_cost       REAL    DEFAULT 0,
    profit_margin       REAL    DEFAULT 0,
    
    -- Details
    timeline_days       INTEGER,
    timeline_display    TEXT,
    warranty_months     INTEGER DEFAULT 0,
    warranty_terms      TEXT,
    materials_proposed  TEXT,   -- JSON
    scope_of_work       TEXT,
    notes               TEXT,
    
    -- Status
    status              TEXT    DEFAULT 'pending'
                        CHECK(status IN ('pending', 'accepted', 'rejected', 'withdrawn', 'expired')),
    
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_bids_quotation ON bids(quotation_id);
CREATE INDEX idx_bids_company ON bids(company_id);
CREATE INDEX idx_bids_status ON bids(status);

-- ─── PROJECTS (Active Work) ─────────────────────────
CREATE TABLE IF NOT EXISTS projects (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    project_code        TEXT    UNIQUE NOT NULL,
    quotation_id        INTEGER NOT NULL REFERENCES quotation_requests(id),
    bid_id              INTEGER NOT NULL REFERENCES bids(id),
    company_id          INTEGER NOT NULL REFERENCES companies(id),
    user_id             INTEGER NOT NULL REFERENCES users(id),
    
    title               TEXT    NOT NULL,
    description         TEXT,
    total_cost          REAL,
    
    -- Status & Progress
    status              TEXT    DEFAULT 'planning'
                        CHECK(status IN ('planning', 'material_procurement', 'in_progress',
                                         'inspection', 'completed', 'on_hold', 'cancelled', 'dispute')),
    progress            INTEGER DEFAULT 0 CHECK(progress >= 0 AND progress <= 100),
    
    -- Dates
    start_date          DATE,
    expected_end_date   DATE,
    actual_end_date     DATE,
    
    -- Payment
    total_paid          REAL    DEFAULT 0,
    escrow_amount       REAL    DEFAULT 0,
    platform_commission REAL    DEFAULT 0,
    
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_company ON projects(company_id);
CREATE INDEX idx_projects_user ON projects(user_id);

-- ─── MILESTONES ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS milestones (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id          INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name                TEXT    NOT NULL,
    description         TEXT,
    status              TEXT    DEFAULT 'pending'
                        CHECK(status IN ('pending', 'in_progress', 'completed')),
    sort_order          INTEGER DEFAULT 0,
    expected_date       DATE,
    completed_date      DATE,
    payment_amount      REAL    DEFAULT 0,
    payment_released    INTEGER DEFAULT 0
);

-- ─── PAYMENTS ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    payment_code        TEXT    UNIQUE NOT NULL,
    project_id          INTEGER NOT NULL REFERENCES projects(id),
    payer_id            INTEGER NOT NULL REFERENCES users(id),
    payee_company_id    INTEGER NOT NULL REFERENCES companies(id),
    milestone_id        INTEGER REFERENCES milestones(id),
    
    amount              REAL    NOT NULL,
    commission          REAL    DEFAULT 0,
    net_amount          REAL,
    payment_type        TEXT    CHECK(payment_type IN ('escrow', 'milestone', 'final', 'refund')),
    status              TEXT    DEFAULT 'pending'
                        CHECK(status IN ('pending', 'in_escrow', 'released', 'completed', 'refunded', 'failed')),
    payment_method      TEXT,
    transaction_id      TEXT,
    
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at        TIMESTAMP
);

-- ─── REVIEWS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL REFERENCES users(id),
    company_id  INTEGER NOT NULL REFERENCES companies(id),
    project_id  INTEGER REFERENCES projects(id),
    rating      REAL    NOT NULL CHECK(rating >= 1.0 AND rating <= 5.0),
    title       TEXT,
    comment     TEXT,
    is_verified INTEGER DEFAULT 0,
    is_flagged  INTEGER DEFAULT 0,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── MATERIALS ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS materials (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    name                TEXT    NOT NULL,
    brand               TEXT,
    category            TEXT    NOT NULL,
    unit                TEXT,
    current_price       REAL    NOT NULL,
    previous_price      REAL,
    price_change_pct    REAL    DEFAULT 0,
    city                TEXT    DEFAULT 'National Average',
    is_eco_friendly     INTEGER DEFAULT 0,
    carbon_score        REAL,
    last_updated        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_materials_category ON materials(category);

-- ─── MATERIAL PRICE HISTORY ─────────────────────────
CREATE TABLE IF NOT EXISTS material_price_history (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    material_id INTEGER NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
    price       REAL    NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── WARRANTIES ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS warranties (
    id                      INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id              INTEGER UNIQUE NOT NULL REFERENCES projects(id),
    warranty_code           TEXT    UNIQUE NOT NULL,
    start_date              DATE    NOT NULL,
    end_date                DATE    NOT NULL,
    terms                   TEXT,
    coverage_details        TEXT,
    is_active               INTEGER DEFAULT 1,
    next_service_date       DATE,
    service_interval_months INTEGER DEFAULT 6
);

-- ─── CHAT ROOMS ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS chat_rooms (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER NOT NULL REFERENCES users(id),
    company_id      INTEGER NOT NULL REFERENCES companies(id),
    quotation_id    INTEGER REFERENCES quotation_requests(id),
    project_id      INTEGER REFERENCES projects(id),
    is_active       INTEGER DEFAULT 1,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── CHAT MESSAGES ──────────────────────────────────
CREATE TABLE IF NOT EXISTS chat_messages (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id         INTEGER NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
    sender_id       INTEGER NOT NULL REFERENCES users(id),
    message         TEXT    NOT NULL,
    message_type    TEXT    DEFAULT 'text'
                    CHECK(message_type IN ('text', 'image', 'file', 'system')),
    attachment_url  TEXT,
    is_read         INTEGER DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── NOTIFICATIONS ──────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id             INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title               TEXT    NOT NULL,
    message             TEXT,
    notification_type   TEXT,
    reference_type      TEXT,
    reference_id        INTEGER,
    is_read             INTEGER DEFAULT 0,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);

-- ─── REPORTS / MODERATION ───────────────────────────
CREATE TABLE IF NOT EXISTS reports (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    reporter_id     INTEGER NOT NULL REFERENCES users(id),
    report_type     TEXT    NOT NULL,
    target_type     TEXT,
    target_id       INTEGER,
    description     TEXT,
    severity        TEXT    DEFAULT 'medium'
                    CHECK(severity IN ('low', 'medium', 'high', 'critical')),
    status          TEXT    DEFAULT 'open'
                    CHECK(status IN ('open', 'investigating', 'resolved', 'dismissed')),
    admin_notes     TEXT,
    resolved_by     INTEGER REFERENCES users(id),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at     TIMESTAMP
);

-- ─── PLATFORM STATS ─────────────────────────────────
CREATE TABLE IF NOT EXISTS platform_stats (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    date                DATE    UNIQUE NOT NULL,
    total_users         INTEGER DEFAULT 0,
    total_companies     INTEGER DEFAULT 0,
    active_projects     INTEGER DEFAULT 0,
    completed_projects  INTEGER DEFAULT 0,
    total_quotations    INTEGER DEFAULT 0,
    total_bids          INTEGER DEFAULT 0,
    total_revenue       REAL    DEFAULT 0,
    total_commission    REAL    DEFAULT 0,
    avg_quotation_value REAL    DEFAULT 0,
    project_success_rate REAL   DEFAULT 0,
    new_users_today     INTEGER DEFAULT 0,
    new_companies_today INTEGER DEFAULT 0
);

-- ─── AI ESTIMATION LOGS ─────────────────────────────
CREATE TABLE IF NOT EXISTS ai_estimation_logs (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER REFERENCES users(id),
    service_type    TEXT,
    area_sqft       REAL,
    quality_level   TEXT,
    num_rooms       INTEGER,
    estimated_min   REAL,
    estimated_max   REAL,
    estimated_duration TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── SUBSCRIPTION PLANS ─────────────────────────────
CREATE TABLE IF NOT EXISTS subscription_plans (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    name                TEXT    UNIQUE NOT NULL,
    price_monthly       REAL    NOT NULL,
    price_yearly        REAL,
    max_bids_per_month  INTEGER DEFAULT 10,
    priority_listing    INTEGER DEFAULT 0,
    analytics_access    INTEGER DEFAULT 0,
    premium_leads       INTEGER DEFAULT 0,
    verified_badge      INTEGER DEFAULT 0,
    features            TEXT,   -- JSON
    is_active           INTEGER DEFAULT 1
);

-- ─── TRIGGERS ───────────────────────────────────────

-- Auto-update company stats when review is added
CREATE TRIGGER IF NOT EXISTS update_company_rating_insert
AFTER INSERT ON reviews
BEGIN
    UPDATE companies SET
        rating = (SELECT AVG(rating) FROM reviews WHERE company_id = NEW.company_id),
        total_reviews = (SELECT COUNT(*) FROM reviews WHERE company_id = NEW.company_id)
    WHERE id = NEW.company_id;
END;

-- Auto-update quotation bid count
CREATE TRIGGER IF NOT EXISTS update_quotation_bid_count
AFTER INSERT ON bids
BEGIN
    UPDATE quotation_requests SET
        total_bids = (SELECT COUNT(*) FROM bids WHERE quotation_id = NEW.quotation_id)
    WHERE id = NEW.quotation_id;
END;

-- Auto-update feed project like count
CREATE TRIGGER IF NOT EXISTS update_likes_count_insert
AFTER INSERT ON liked_projects
BEGIN
    UPDATE feed_projects SET likes_count = (
        SELECT COUNT(*) FROM liked_projects WHERE project_id = NEW.project_id
    ) WHERE id = NEW.project_id;
END;

CREATE TRIGGER IF NOT EXISTS update_likes_count_delete
AFTER DELETE ON liked_projects
BEGIN
    UPDATE feed_projects SET likes_count = (
        SELECT COUNT(*) FROM liked_projects WHERE project_id = OLD.project_id
    ) WHERE id = OLD.project_id;
END;

-- Auto-update saved count
CREATE TRIGGER IF NOT EXISTS update_saves_count_insert
AFTER INSERT ON saved_projects
BEGIN
    UPDATE feed_projects SET saves_count = (
        SELECT COUNT(*) FROM saved_projects WHERE project_id = NEW.project_id
    ) WHERE id = NEW.project_id;
END;

CREATE TRIGGER IF NOT EXISTS update_saves_count_delete
AFTER DELETE ON saved_projects
BEGIN
    UPDATE feed_projects SET saves_count = (
        SELECT COUNT(*) FROM saved_projects WHERE project_id = OLD.project_id
    ) WHERE id = OLD.project_id;
END;

-- ─── VIEWS ──────────────────────────────────────────

-- Company leaderboard view
CREATE VIEW IF NOT EXISTS v_company_leaderboard AS
SELECT 
    c.id,
    c.name,
    c.rating,
    c.completed_projects,
    c.success_rate,
    c.total_earnings,
    u.email,
    GROUP_CONCAT(s.name, ', ') as services
FROM companies c
JOIN users u ON c.user_id = u.id
LEFT JOIN company_services cs ON c.id = cs.company_id
LEFT JOIN services s ON cs.service_id = s.id
WHERE c.is_active = 1 AND c.platform_verified = 1
GROUP BY c.id
ORDER BY c.rating DESC, c.completed_projects DESC;

-- Active quotations with bid counts
CREATE VIEW IF NOT EXISTS v_active_quotations AS
SELECT 
    qr.*,
    u.full_name as requester_name,
    u.email as requester_email,
    (SELECT COUNT(*) FROM bids b WHERE b.quotation_id = qr.id) as bid_count
FROM quotation_requests qr
JOIN users u ON qr.user_id = u.id
WHERE qr.status = 'active';

-- Revenue summary
CREATE VIEW IF NOT EXISTS v_revenue_summary AS
SELECT 
    strftime('%Y-%m', p.created_at) as month,
    COUNT(*) as total_payments,
    SUM(p.amount) as total_amount,
    SUM(p.commission) as total_commission,
    SUM(p.net_amount) as total_net
FROM payments p
WHERE p.status IN ('completed', 'released')
GROUP BY strftime('%Y-%m', p.created_at)
ORDER BY month DESC;
