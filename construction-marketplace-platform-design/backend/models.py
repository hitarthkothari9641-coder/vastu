"""
BuildBid Platform - Database Models (SQLAlchemy ORM)
All tables and relationships for the E-Quotation Marketplace
"""
from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


# ─── ASSOCIATION TABLES ───────────────────────────────────────────────

company_services = db.Table('company_services',
    db.Column('company_id', db.Integer, db.ForeignKey('companies.id'), primary_key=True),
    db.Column('service_id', db.Integer, db.ForeignKey('services.id'), primary_key=True)
)

project_materials = db.Table('project_materials',
    db.Column('project_id', db.Integer, db.ForeignKey('feed_projects.id'), primary_key=True),
    db.Column('material_name', db.String(100), primary_key=True)
)

quotation_materials = db.Table('quotation_materials',
    db.Column('quotation_id', db.Integer, db.ForeignKey('quotation_requests.id'), primary_key=True),
    db.Column('material_name', db.String(100), primary_key=True)
)

saved_projects = db.Table('saved_projects',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('project_id', db.Integer, db.ForeignKey('feed_projects.id'), primary_key=True)
)

liked_projects = db.Table('liked_projects',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('project_id', db.Integer, db.ForeignKey('feed_projects.id'), primary_key=True)
)


# ─── USER MODEL ───────────────────────────────────────────────────────

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(256), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), unique=True, nullable=True)
    avatar_url = db.Column(db.String(500))
    location = db.Column(db.String(200))
    role = db.Column(db.String(20), nullable=False, default='user')  # user, company, admin
    is_active = db.Column(db.Boolean, default=True)
    is_verified = db.Column(db.Boolean, default=False)
    auth_provider = db.Column(db.String(20), default='email')  # email, google, phone
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc),
                           onupdate=lambda: datetime.now(timezone.utc))
    last_login = db.Column(db.DateTime)

    # Relationships
    company = db.relationship('Company', backref='owner', uselist=False, lazy=True)
    quotation_requests = db.relationship('QuotationRequest', backref='requester', lazy=True)
    reviews_given = db.relationship('Review', backref='reviewer', lazy=True,
                                     foreign_keys='Review.user_id')
    notifications = db.relationship('Notification', backref='user', lazy=True)
    saved = db.relationship('FeedProject', secondary=saved_projects, backref='saved_by')
    liked = db.relationship('FeedProject', secondary=liked_projects, backref='liked_by')

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'full_name': self.full_name,
            'phone': self.phone,
            'avatar_url': self.avatar_url,
            'location': self.location,
            'role': self.role,
            'is_active': self.is_active,
            'is_verified': self.is_verified,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


# ─── COMPANY MODEL ───────────────────────────────────────────────────

class Company(db.Model):
    __tablename__ = 'companies'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    name = db.Column(db.String(200), nullable=False, index=True)
    logo_url = db.Column(db.String(500))
    logo_emoji = db.Column(db.String(10), default='🏗️')
    description = db.Column(db.Text)
    location = db.Column(db.String(200))
    city = db.Column(db.String(100), index=True)
    state = db.Column(db.String(100))
    experience_years = db.Column(db.Integer, default=0)
    website = db.Column(db.String(300))

    # Verification Fields
    gst_number = db.Column(db.String(50), unique=True)
    gst_verified = db.Column(db.Boolean, default=False)
    license_number = db.Column(db.String(100))
    licensed = db.Column(db.Boolean, default=False)
    license_doc_url = db.Column(db.String(500))
    platform_verified = db.Column(db.Boolean, default=False)
    verification_status = db.Column(db.String(20), default='pending')  # pending, approved, rejected

    # Stats (denormalized for performance)
    rating = db.Column(db.Float, default=0.0)
    total_reviews = db.Column(db.Integer, default=0)
    completed_projects = db.Column(db.Integer, default=0)
    success_rate = db.Column(db.Float, default=0.0)
    total_earnings = db.Column(db.Float, default=0.0)

    # Subscription
    subscription_plan = db.Column(db.String(20), default='free')  # free, basic, premium, enterprise
    subscription_expires = db.Column(db.DateTime)

    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc),
                           onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    services = db.relationship('Service', secondary=company_services, backref='companies')
    bids = db.relationship('Bid', backref='company', lazy=True)
    projects = db.relationship('Project', backref='company', lazy=True)
    feed_posts = db.relationship('FeedProject', backref='company', lazy=True)
    reviews = db.relationship('Review', backref='company', lazy=True,
                               foreign_keys='Review.company_id')
    certifications = db.relationship('Certification', backref='company', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'logo_url': self.logo_url,
            'logo_emoji': self.logo_emoji,
            'description': self.description,
            'location': self.location,
            'city': self.city,
            'state': self.state,
            'experience_years': self.experience_years,
            'website': self.website,
            'gst_number': self.gst_number,
            'gst_verified': self.gst_verified,
            'licensed': self.licensed,
            'platform_verified': self.platform_verified,
            'verification_status': self.verification_status,
            'rating': self.rating,
            'total_reviews': self.total_reviews,
            'completed_projects': self.completed_projects,
            'success_rate': self.success_rate,
            'subscription_plan': self.subscription_plan,
            'is_active': self.is_active,
            'services': [s.name for s in self.services],
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


# ─── SERVICE CATEGORIES ──────────────────────────────────────────────

class Service(db.Model):
    __tablename__ = 'services'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    slug = db.Column(db.String(50), unique=True, nullable=False)
    icon = db.Column(db.String(10))
    description = db.Column(db.String(200))
    is_active = db.Column(db.Boolean, default=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'icon': self.icon,
            'description': self.description,
        }


# ─── CERTIFICATION ───────────────────────────────────────────────────

class Certification(db.Model):
    __tablename__ = 'certifications'

    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    issuer = db.Column(db.String(200))
    issue_date = db.Column(db.Date)
    expiry_date = db.Column(db.Date)
    document_url = db.Column(db.String(500))
    verified = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'issuer': self.issuer,
            'issue_date': self.issue_date.isoformat() if self.issue_date else None,
            'expiry_date': self.expiry_date.isoformat() if self.expiry_date else None,
            'verified': self.verified,
        }


# ─── FEED PROJECT (Instagram-Style Posts) ─────────────────────────────

class FeedProject(db.Model):
    __tablename__ = 'feed_projects'

    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(50), nullable=False, index=True)
    cost_min = db.Column(db.Float)
    cost_max = db.Column(db.Float)
    cost_range_display = db.Column(db.String(100))
    timeline = db.Column(db.String(50))
    materials_used = db.Column(db.Text)  # JSON string
    location = db.Column(db.String(200))
    likes_count = db.Column(db.Integer, default=0)
    saves_count = db.Column(db.Integer, default=0)
    shares_count = db.Column(db.Integer, default=0)
    views_count = db.Column(db.Integer, default=0)
    is_featured = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    images = db.relationship('ProjectImage', backref='project', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'company_id': self.company_id,
            'company_name': self.company.name if self.company else None,
            'company_logo': self.company.logo_emoji if self.company else None,
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'cost_range': self.cost_range_display,
            'timeline': self.timeline,
            'materials': self.materials_used,
            'likes': self.likes_count,
            'saves': self.saves_count,
            'images': [img.url for img in self.images],
            'is_featured': self.is_featured,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class ProjectImage(db.Model):
    __tablename__ = 'project_images'

    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('feed_projects.id'), nullable=False)
    url = db.Column(db.String(500), nullable=False)
    caption = db.Column(db.String(200))
    is_before = db.Column(db.Boolean, default=False)  # before/after comparison
    sort_order = db.Column(db.Integer, default=0)


# ─── QUOTATION REQUEST ───────────────────────────────────────────────

class QuotationRequest(db.Model):
    __tablename__ = 'quotation_requests'

    id = db.Column(db.Integer, primary_key=True)
    request_code = db.Column(db.String(20), unique=True, nullable=False, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    service_type = db.Column(db.String(50), nullable=False, index=True)

    # Project Details
    area_sqft = db.Column(db.Float)
    num_rooms = db.Column(db.Integer)
    location = db.Column(db.String(200))
    city = db.Column(db.String(100))

    # Budget & Timeline
    budget_min = db.Column(db.Float)
    budget_max = db.Column(db.Float)
    budget_display = db.Column(db.String(100))
    timeline = db.Column(db.String(50))
    urgency = db.Column(db.String(20), default='normal')  # asap, normal, flexible

    # Material Preferences (stored as JSON)
    material_preferences = db.Column(db.Text)  # JSON

    # Green Construction
    green_mode = db.Column(db.Boolean, default=False)

    # Status
    status = db.Column(db.String(20), default='active', index=True)
    # active, closed, awarded, cancelled, expired
    total_bids = db.Column(db.Integer, default=0)
    awarded_bid_id = db.Column(db.Integer, db.ForeignKey('bids.id'), nullable=True)

    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc),
                           onupdate=lambda: datetime.now(timezone.utc))
    expires_at = db.Column(db.DateTime)

    # Relationships
    bids = db.relationship('Bid', backref='quotation_request', lazy=True,
                            foreign_keys='Bid.quotation_id')
    reference_images = db.relationship('QuotationImage', backref='quotation', lazy=True,
                                        cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'request_code': self.request_code,
            'user_id': self.user_id,
            'title': self.title,
            'description': self.description,
            'service_type': self.service_type,
            'area_sqft': self.area_sqft,
            'num_rooms': self.num_rooms,
            'budget_display': self.budget_display,
            'budget_min': self.budget_min,
            'budget_max': self.budget_max,
            'timeline': self.timeline,
            'material_preferences': self.material_preferences,
            'green_mode': self.green_mode,
            'status': self.status,
            'total_bids': self.total_bids,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class QuotationImage(db.Model):
    __tablename__ = 'quotation_images'

    id = db.Column(db.Integer, primary_key=True)
    quotation_id = db.Column(db.Integer, db.ForeignKey('quotation_requests.id'), nullable=False)
    url = db.Column(db.String(500), nullable=False)
    filename = db.Column(db.String(200))
    file_type = db.Column(db.String(20))  # image, drawing, pdf


# ─── BID MODEL ────────────────────────────────────────────────────────

class Bid(db.Model):
    __tablename__ = 'bids'

    id = db.Column(db.Integer, primary_key=True)
    bid_code = db.Column(db.String(20), unique=True, nullable=False, index=True)
    quotation_id = db.Column(db.Integer, db.ForeignKey('quotation_requests.id'), nullable=False)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=False)

    # Price Breakdown
    total_price = db.Column(db.Float, nullable=False)
    labor_cost = db.Column(db.Float, default=0)
    material_cost = db.Column(db.Float, default=0)
    overhead_cost = db.Column(db.Float, default=0)
    profit_margin = db.Column(db.Float, default=0)

    # Details
    timeline_days = db.Column(db.Integer)
    timeline_display = db.Column(db.String(50))
    warranty_months = db.Column(db.Integer, default=0)
    warranty_terms = db.Column(db.Text)
    materials_proposed = db.Column(db.Text)  # JSON
    scope_of_work = db.Column(db.Text)
    notes = db.Column(db.Text)

    # Status
    status = db.Column(db.String(20), default='pending', index=True)
    # pending, accepted, rejected, withdrawn, expired

    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc),
                           onupdate=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'id': self.id,
            'bid_code': self.bid_code,
            'quotation_id': self.quotation_id,
            'company_id': self.company_id,
            'company_name': self.company.name if self.company else None,
            'company_rating': self.company.rating if self.company else None,
            'total_price': self.total_price,
            'labor_cost': self.labor_cost,
            'material_cost': self.material_cost,
            'overhead_cost': self.overhead_cost,
            'timeline_display': self.timeline_display,
            'warranty_months': self.warranty_months,
            'warranty_terms': self.warranty_terms,
            'scope_of_work': self.scope_of_work,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


# ─── PROJECT (Active/Completed Work) ─────────────────────────────────

class Project(db.Model):
    __tablename__ = 'projects'

    id = db.Column(db.Integer, primary_key=True)
    project_code = db.Column(db.String(20), unique=True, nullable=False, index=True)
    quotation_id = db.Column(db.Integer, db.ForeignKey('quotation_requests.id'), nullable=False)
    bid_id = db.Column(db.Integer, db.ForeignKey('bids.id'), nullable=False)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    total_cost = db.Column(db.Float)

    # Status & Progress
    status = db.Column(db.String(30), default='planning', index=True)
    # planning, material_procurement, in_progress, inspection, completed, on_hold, cancelled, dispute
    progress = db.Column(db.Integer, default=0)  # 0-100

    # Dates
    start_date = db.Column(db.Date)
    expected_end_date = db.Column(db.Date)
    actual_end_date = db.Column(db.Date)

    # Payment
    total_paid = db.Column(db.Float, default=0)
    escrow_amount = db.Column(db.Float, default=0)
    platform_commission = db.Column(db.Float, default=0)

    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc),
                           onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    milestones = db.relationship('Milestone', backref='project', lazy=True,
                                  cascade='all, delete-orphan', order_by='Milestone.sort_order')
    payments = db.relationship('Payment', backref='project', lazy=True)
    warranty = db.relationship('Warranty', backref='project', uselist=False, lazy=True)
    quotation = db.relationship('QuotationRequest', backref='project', uselist=False)
    bid = db.relationship('Bid', backref='project', uselist=False)
    user = db.relationship('User', backref='projects')

    def to_dict(self):
        return {
            'id': self.id,
            'project_code': self.project_code,
            'title': self.title,
            'description': self.description,
            'total_cost': self.total_cost,
            'status': self.status,
            'progress': self.progress,
            'company_name': self.company.name if self.company else None,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'expected_end_date': self.expected_end_date.isoformat() if self.expected_end_date else None,
            'milestones': [m.to_dict() for m in self.milestones],
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


# ─── MILESTONE ────────────────────────────────────────────────────────

class Milestone(db.Model):
    __tablename__ = 'milestones'

    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending')  # pending, in_progress, completed
    sort_order = db.Column(db.Integer, default=0)
    expected_date = db.Column(db.Date)
    completed_date = db.Column(db.Date)
    payment_amount = db.Column(db.Float, default=0)
    payment_released = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'status': self.status,
            'sort_order': self.sort_order,
            'expected_date': self.expected_date.isoformat() if self.expected_date else None,
            'completed_date': self.completed_date.isoformat() if self.completed_date else None,
            'payment_amount': self.payment_amount,
            'payment_released': self.payment_released,
        }


# ─── PAYMENT MODEL ───────────────────────────────────────────────────

class Payment(db.Model):
    __tablename__ = 'payments'

    id = db.Column(db.Integer, primary_key=True)
    payment_code = db.Column(db.String(20), unique=True, nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    payer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    payee_company_id = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=False)
    milestone_id = db.Column(db.Integer, db.ForeignKey('milestones.id'), nullable=True)

    amount = db.Column(db.Float, nullable=False)
    commission = db.Column(db.Float, default=0)
    net_amount = db.Column(db.Float)
    payment_type = db.Column(db.String(20))  # escrow, milestone, final, refund
    status = db.Column(db.String(20), default='pending')
    # pending, in_escrow, released, completed, refunded, failed
    payment_method = db.Column(db.String(30))
    transaction_id = db.Column(db.String(100))

    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    completed_at = db.Column(db.DateTime)

    payer = db.relationship('User', backref='payments_made')
    payee = db.relationship('Company', backref='payments_received')

    def to_dict(self):
        return {
            'id': self.id,
            'payment_code': self.payment_code,
            'amount': self.amount,
            'commission': self.commission,
            'net_amount': self.net_amount,
            'payment_type': self.payment_type,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


# ─── REVIEW MODEL ────────────────────────────────────────────────────

class Review(db.Model):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=True)
    rating = db.Column(db.Float, nullable=False)  # 1.0 to 5.0
    title = db.Column(db.String(200))
    comment = db.Column(db.Text)
    is_verified = db.Column(db.Boolean, default=False)  # verified purchase
    is_flagged = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    project = db.relationship('Project', backref='reviews')

    def to_dict(self):
        return {
            'id': self.id,
            'user_name': self.reviewer.full_name if self.reviewer else None,
            'company_id': self.company_id,
            'rating': self.rating,
            'title': self.title,
            'comment': self.comment,
            'is_verified': self.is_verified,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


# ─── MATERIAL PRICE TRACKING ─────────────────────────────────────────

class Material(db.Model):
    __tablename__ = 'materials'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    brand = db.Column(db.String(100))
    category = db.Column(db.String(50), nullable=False, index=True)
    unit = db.Column(db.String(30))  # kg, bag, sq.ft, meter, piece
    current_price = db.Column(db.Float, nullable=False)
    previous_price = db.Column(db.Float)
    price_change_pct = db.Column(db.Float, default=0)
    city = db.Column(db.String(100), default='National Average')
    is_eco_friendly = db.Column(db.Boolean, default=False)
    carbon_score = db.Column(db.Float)  # lower is better
    last_updated = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    price_history = db.relationship('MaterialPriceHistory', backref='material', lazy=True,
                                     order_by='MaterialPriceHistory.recorded_at')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'brand': self.brand,
            'category': self.category,
            'unit': self.unit,
            'price': self.current_price,
            'change': self.price_change_pct,
            'city': self.city,
            'is_eco_friendly': self.is_eco_friendly,
            'carbon_score': self.carbon_score,
            'history': [h.price for h in self.price_history[-6:]],
            'last_updated': self.last_updated.isoformat() if self.last_updated else None,
        }


class MaterialPriceHistory(db.Model):
    __tablename__ = 'material_price_history'

    id = db.Column(db.Integer, primary_key=True)
    material_id = db.Column(db.Integer, db.ForeignKey('materials.id'), nullable=False)
    price = db.Column(db.Float, nullable=False)
    recorded_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))


# ─── WARRANTY MODEL ──────────────────────────────────────────────────

class Warranty(db.Model):
    __tablename__ = 'warranties'

    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False, unique=True)
    warranty_code = db.Column(db.String(30), unique=True, nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    terms = db.Column(db.Text)
    coverage_details = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True)

    # Service reminders
    next_service_date = db.Column(db.Date)
    service_interval_months = db.Column(db.Integer, default=6)

    def to_dict(self):
        return {
            'id': self.id,
            'warranty_code': self.warranty_code,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'terms': self.terms,
            'is_active': self.is_active,
        }


# ─── CHAT / MESSAGING ────────────────────────────────────────────────

class ChatRoom(db.Model):
    __tablename__ = 'chat_rooms'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=False)
    quotation_id = db.Column(db.Integer, db.ForeignKey('quotation_requests.id'), nullable=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    messages = db.relationship('ChatMessage', backref='room', lazy=True,
                                order_by='ChatMessage.created_at')
    user = db.relationship('User', backref='chat_rooms')
    company_rel = db.relationship('Company', backref='chat_rooms')


class ChatMessage(db.Model):
    __tablename__ = 'chat_messages'

    id = db.Column(db.Integer, primary_key=True)
    room_id = db.Column(db.Integer, db.ForeignKey('chat_rooms.id'), nullable=False)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    message = db.Column(db.Text, nullable=False)
    message_type = db.Column(db.String(20), default='text')  # text, image, file, system
    attachment_url = db.Column(db.String(500))
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    sender = db.relationship('User', backref='messages_sent')

    def to_dict(self):
        return {
            'id': self.id,
            'sender_id': self.sender_id,
            'sender_name': self.sender.full_name if self.sender else None,
            'message': self.message,
            'message_type': self.message_type,
            'is_read': self.is_read,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


# ─── NOTIFICATION MODEL ──────────────────────────────────────────────

class Notification(db.Model):
    __tablename__ = 'notifications'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text)
    notification_type = db.Column(db.String(30))
    # bid_received, bid_accepted, project_update, payment, review, system
    reference_type = db.Column(db.String(30))  # quotation, bid, project, payment
    reference_id = db.Column(db.Integer)
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'message': self.message,
            'type': self.notification_type,
            'is_read': self.is_read,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


# ─── REPORT / MODERATION ─────────────────────────────────────────────

class Report(db.Model):
    __tablename__ = 'reports'

    id = db.Column(db.Integer, primary_key=True)
    reporter_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    report_type = db.Column(db.String(30), nullable=False)
    # fake_bid, delayed_project, fake_review, payment_dispute, inappropriate_content
    target_type = db.Column(db.String(30))  # company, user, bid, review, project
    target_id = db.Column(db.Integer)
    description = db.Column(db.Text)
    severity = db.Column(db.String(10), default='medium')  # low, medium, high, critical
    status = db.Column(db.String(20), default='open')  # open, investigating, resolved, dismissed
    admin_notes = db.Column(db.Text)
    resolved_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    resolved_at = db.Column(db.DateTime)

    reporter = db.relationship('User', foreign_keys=[reporter_id], backref='reports_filed')

    def to_dict(self):
        return {
            'id': self.id,
            'reporter_name': self.reporter.full_name if self.reporter else None,
            'report_type': self.report_type,
            'target_type': self.target_type,
            'target_id': self.target_id,
            'description': self.description,
            'severity': self.severity,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


# ─── PLATFORM ANALYTICS ──────────────────────────────────────────────

class PlatformStats(db.Model):
    __tablename__ = 'platform_stats'

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, unique=True, nullable=False, index=True)
    total_users = db.Column(db.Integer, default=0)
    total_companies = db.Column(db.Integer, default=0)
    active_projects = db.Column(db.Integer, default=0)
    completed_projects = db.Column(db.Integer, default=0)
    total_quotations = db.Column(db.Integer, default=0)
    total_bids = db.Column(db.Integer, default=0)
    total_revenue = db.Column(db.Float, default=0)
    total_commission = db.Column(db.Float, default=0)
    avg_quotation_value = db.Column(db.Float, default=0)
    project_success_rate = db.Column(db.Float, default=0)
    new_users_today = db.Column(db.Integer, default=0)
    new_companies_today = db.Column(db.Integer, default=0)


# ─── AI ESTIMATION LOG ───────────────────────────────────────────────

class AIEstimationLog(db.Model):
    __tablename__ = 'ai_estimation_logs'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    service_type = db.Column(db.String(50))
    area_sqft = db.Column(db.Float)
    quality_level = db.Column(db.String(20))
    num_rooms = db.Column(db.Integer)
    estimated_min = db.Column(db.Float)
    estimated_max = db.Column(db.Float)
    estimated_duration = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))


# ─── SUBSCRIPTION PLAN ───────────────────────────────────────────────

class SubscriptionPlan(db.Model):
    __tablename__ = 'subscription_plans'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    price_monthly = db.Column(db.Float, nullable=False)
    price_yearly = db.Column(db.Float)
    max_bids_per_month = db.Column(db.Integer, default=10)
    priority_listing = db.Column(db.Boolean, default=False)
    analytics_access = db.Column(db.Boolean, default=False)
    premium_leads = db.Column(db.Boolean, default=False)
    verified_badge = db.Column(db.Boolean, default=False)
    features = db.Column(db.Text)  # JSON
    is_active = db.Column(db.Boolean, default=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'price_monthly': self.price_monthly,
            'price_yearly': self.price_yearly,
            'max_bids_per_month': self.max_bids_per_month,
            'priority_listing': self.priority_listing,
            'analytics_access': self.analytics_access,
            'premium_leads': self.premium_leads,
        }
