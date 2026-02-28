"""
BuildBid E-Quotation Marketplace - Main Flask Application
Complete backend with REST API, authentication, and real-time features
"""
import os
import json
from datetime import datetime, timezone, timedelta
from functools import wraps

from flask import Flask, request, jsonify, g
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity, get_jwt
)
import bcrypt

from config import config
from models import (
    db, User, Company, Service, Certification, FeedProject, ProjectImage,
    QuotationRequest, QuotationImage, Bid, Project, Milestone, Payment,
    Review, Material, MaterialPriceHistory, Warranty, ChatRoom, ChatMessage,
    Notification, Report, PlatformStats, AIEstimationLog, SubscriptionPlan
)


def create_app(config_name='default'):
    """Application factory"""
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    # Initialize extensions
    db.init_app(app)
    CORS(app, origins=app.config.get('CORS_ORIGINS', '*'), supports_credentials=True)
    jwt = JWTManager(app)

    # Create upload directory
    os.makedirs(app.config.get('UPLOAD_FOLDER', 'uploads'), exist_ok=True)

    # Create tables
    with app.app_context():
        db.create_all()

    # ─── JWT CALLBACKS ────────────────────────────────────
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({'error': 'Token has expired', 'code': 'token_expired'}), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({'error': 'Invalid token', 'code': 'invalid_token'}), 401

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({'error': 'Authorization required', 'code': 'authorization_required'}), 401

    # ─── ROLE-BASED ACCESS DECORATOR ──────────────────────
    def role_required(*roles):
        def decorator(fn):
            @wraps(fn)
            @jwt_required()
            def wrapper(*args, **kwargs):
                user_id = get_jwt_identity()
                user = db.session.get(User, user_id)
                if not user or user.role not in roles:
                    return jsonify({'error': 'Access denied'}), 403
                g.current_user = user
                return fn(*args, **kwargs)
            return wrapper
        return decorator

    # ─── HELPER FUNCTIONS ─────────────────────────────────
    def generate_code(prefix, model, field):
        """Generate unique codes like QR001, B001, P001"""
        count = db.session.query(model).count() + 1
        return f"{prefix}{count:03d}"

    # ═══════════════════════════════════════════════════════
    # AUTH ROUTES
    # ═══════════════════════════════════════════════════════

    @app.route('/api/auth/register', methods=['POST'])
    def register():
        """Register new user or company"""
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        full_name = data.get('full_name', '').strip()
        phone = data.get('phone', '').strip() or None
        role = data.get('role', 'user')
        location = data.get('location', '')

        if not email or not password or not full_name:
            return jsonify({'error': 'Email, password, and name are required'}), 400

        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already registered'}), 409

        if phone and User.query.filter_by(phone=phone).first():
            return jsonify({'error': 'Phone number already registered'}), 409

        # Hash password
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        user = User(
            email=email, password_hash=password_hash, full_name=full_name,
            phone=phone, role=role, location=location, is_verified=(role == 'admin')
        )
        db.session.add(user)
        db.session.flush()

        # If company registration, create company profile
        if role == 'company':
            company_name = data.get('company_name', full_name)
            company = Company(
                user_id=user.id, name=company_name,
                location=location,
                city=data.get('city', ''),
                state=data.get('state', ''),
                gst_number=data.get('gst_number'),
                description=data.get('description', ''),
                experience_years=data.get('experience_years', 0),
            )
            db.session.add(company)

            # Add services
            service_names = data.get('services', [])
            for sname in service_names:
                service = Service.query.filter_by(name=sname).first()
                if service:
                    company.services.append(service)

        db.session.commit()

        # Create tokens
        access_token = create_access_token(
            identity=user.id,
            additional_claims={'role': user.role, 'name': user.full_name}
        )
        refresh_token = create_refresh_token(identity=user.id)

        return jsonify({
            'message': 'Registration successful',
            'user': user.to_dict(),
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 201

    @app.route('/api/auth/login', methods=['POST'])
    def login():
        """Login user"""
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')

        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({'error': 'Invalid email or password'}), 401

        if not bcrypt.checkpw(password.encode('utf-8'), user.password_hash.encode('utf-8')):
            return jsonify({'error': 'Invalid email or password'}), 401

        if not user.is_active:
            return jsonify({'error': 'Account is suspended'}), 403

        # Update last login
        user.last_login = datetime.now(timezone.utc)
        db.session.commit()

        access_token = create_access_token(
            identity=user.id,
            additional_claims={'role': user.role, 'name': user.full_name}
        )
        refresh_token = create_refresh_token(identity=user.id)

        response = {
            'message': 'Login successful',
            'user': user.to_dict(),
            'access_token': access_token,
            'refresh_token': refresh_token
        }

        # Include company data if company user
        if user.role == 'company' and user.company:
            response['company'] = user.company.to_dict()

        return jsonify(response), 200

    @app.route('/api/auth/refresh', methods=['POST'])
    @jwt_required(refresh=True)
    def refresh():
        """Refresh access token"""
        user_id = get_jwt_identity()
        user = db.session.get(User, user_id)
        access_token = create_access_token(
            identity=user_id,
            additional_claims={'role': user.role, 'name': user.full_name}
        )
        return jsonify({'access_token': access_token}), 200

    @app.route('/api/auth/me', methods=['GET'])
    @jwt_required()
    def get_current_user():
        """Get current user profile"""
        user_id = get_jwt_identity()
        user = db.session.get(User, user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        result = user.to_dict()
        if user.role == 'company' and user.company:
            result['company'] = user.company.to_dict()
        return jsonify(result), 200

    # ═══════════════════════════════════════════════════════
    # USER ROUTES
    # ═══════════════════════════════════════════════════════

    @app.route('/api/users/profile', methods=['PUT'])
    @jwt_required()
    def update_profile():
        """Update user profile"""
        user_id = get_jwt_identity()
        user = db.session.get(User, user_id)
        data = request.get_json()

        if 'full_name' in data: user.full_name = data['full_name']
        if 'phone' in data: user.phone = data['phone']
        if 'location' in data: user.location = data['location']
        if 'avatar_url' in data: user.avatar_url = data['avatar_url']

        db.session.commit()
        return jsonify({'message': 'Profile updated', 'user': user.to_dict()}), 200

    @app.route('/api/users/dashboard', methods=['GET'])
    @role_required('user')
    def user_dashboard():
        """Get user dashboard data"""
        user = g.current_user
        active_quotations = QuotationRequest.query.filter_by(
            user_id=user.id, status='active').count()
        total_bids = db.session.query(Bid).join(QuotationRequest).filter(
            QuotationRequest.user_id == user.id).count()
        active_projects = Project.query.filter(
            Project.user_id == user.id,
            Project.status.notin_(['completed', 'cancelled'])).count()
        completed_projects = Project.query.filter_by(
            user_id=user.id, status='completed').count()

        notifications = Notification.query.filter_by(
            user_id=user.id, is_read=False).order_by(
            Notification.created_at.desc()).limit(10).all()

        return jsonify({
            'stats': {
                'active_quotations': active_quotations,
                'total_bids': total_bids,
                'active_projects': active_projects,
                'completed_projects': completed_projects,
            },
            'notifications': [n.to_dict() for n in notifications],
        }), 200

    # ═══════════════════════════════════════════════════════
    # COMPANY ROUTES
    # ═══════════════════════════════════════════════════════

    @app.route('/api/companies', methods=['GET'])
    def list_companies():
        """List all verified companies"""
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        search = request.args.get('search', '')
        service_filter = request.args.get('service', '')
        city = request.args.get('city', '')

        query = Company.query.filter_by(is_active=True)

        if search:
            query = query.filter(Company.name.ilike(f'%{search}%'))
        if city:
            query = query.filter(Company.city.ilike(f'%{city}%'))
        if service_filter:
            query = query.join(Company.services).filter(Service.name == service_filter)

        query = query.order_by(Company.rating.desc())
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)

        return jsonify({
            'companies': [c.to_dict() for c in pagination.items],
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page,
        }), 200

    @app.route('/api/companies/<int:company_id>', methods=['GET'])
    def get_company(company_id):
        """Get company details"""
        company = db.session.get(Company, company_id)
        if not company:
            return jsonify({'error': 'Company not found'}), 404

        result = company.to_dict()
        result['certifications'] = [c.to_dict() for c in company.certifications]
        result['recent_projects'] = [p.to_dict() for p in
            FeedProject.query.filter_by(company_id=company.id, is_active=True)
            .order_by(FeedProject.created_at.desc()).limit(6).all()]
        result['reviews'] = [r.to_dict() for r in
            Review.query.filter_by(company_id=company.id)
            .order_by(Review.created_at.desc()).limit(10).all()]

        return jsonify(result), 200

    @app.route('/api/companies/profile', methods=['PUT'])
    @role_required('company')
    def update_company_profile():
        """Update company profile"""
        user = g.current_user
        company = user.company
        if not company:
            return jsonify({'error': 'Company profile not found'}), 404

        data = request.get_json()
        for field in ['name', 'description', 'location', 'city', 'state',
                      'website', 'experience_years', 'logo_emoji']:
            if field in data:
                setattr(company, field, data[field])

        if 'services' in data:
            company.services = []
            for sname in data['services']:
                service = Service.query.filter_by(name=sname).first()
                if service:
                    company.services.append(service)

        db.session.commit()
        return jsonify({'message': 'Company profile updated', 'company': company.to_dict()}), 200

    @app.route('/api/companies/dashboard', methods=['GET'])
    @role_required('company')
    def company_dashboard():
        """Get company dashboard stats"""
        company = g.current_user.company
        if not company:
            return jsonify({'error': 'No company profile'}), 404

        active_projects = Project.query.filter(
            Project.company_id == company.id,
            Project.status.notin_(['completed', 'cancelled'])).count()
        completed = Project.query.filter_by(company_id=company.id, status='completed').count()
        pending_bids = Bid.query.filter_by(company_id=company.id, status='pending').count()
        total_earnings = company.total_earnings

        # Monthly revenue data
        monthly_data = db.session.query(
            db.func.strftime('%Y-%m', Payment.created_at).label('month'),
            db.func.sum(Payment.net_amount).label('revenue')
        ).filter(
            Payment.payee_company_id == company.id,
            Payment.status.in_(['completed', 'released'])
        ).group_by('month').order_by('month').all()

        return jsonify({
            'stats': {
                'active_projects': active_projects,
                'completed_projects': completed,
                'pending_bids': pending_bids,
                'total_earnings': total_earnings,
                'rating': company.rating,
                'success_rate': company.success_rate,
            },
            'monthly_revenue': [{'month': m[0], 'revenue': m[1] or 0} for m in monthly_data],
        }), 200

    # ═══════════════════════════════════════════════════════
    # FEED ROUTES
    # ═══════════════════════════════════════════════════════

    @app.route('/api/feed', methods=['GET'])
    def get_feed():
        """Get feed projects (Instagram-style)"""
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        category = request.args.get('category', '')

        query = FeedProject.query.filter_by(is_active=True)
        if category and category != 'All':
            query = query.filter_by(category=category)

        query = query.order_by(FeedProject.created_at.desc())
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)

        return jsonify({
            'projects': [p.to_dict() for p in pagination.items],
            'total': pagination.total,
            'pages': pagination.pages,
        }), 200

    @app.route('/api/feed', methods=['POST'])
    @role_required('company')
    def create_feed_post():
        """Create a new feed post"""
        company = g.current_user.company
        data = request.get_json()

        post = FeedProject(
            company_id=company.id,
            title=data['title'],
            description=data.get('description', ''),
            category=data['category'],
            cost_min=data.get('cost_min'),
            cost_max=data.get('cost_max'),
            cost_range_display=data.get('cost_range', ''),
            timeline=data.get('timeline', ''),
            materials_used=json.dumps(data.get('materials', [])),
        )
        db.session.add(post)

        if 'images' in data:
            for i, url in enumerate(data['images']):
                img = ProjectImage(project_id=post.id, url=url, sort_order=i)
                db.session.add(img)

        db.session.commit()
        return jsonify({'message': 'Post created', 'project': post.to_dict()}), 201

    @app.route('/api/feed/<int:project_id>/like', methods=['POST'])
    @jwt_required()
    def toggle_like(project_id):
        """Like/unlike a feed project"""
        user_id = get_jwt_identity()
        user = db.session.get(User, user_id)
        project = db.session.get(FeedProject, project_id)
        if not project:
            return jsonify({'error': 'Project not found'}), 404

        if project in user.liked:
            user.liked.remove(project)
            action = 'unliked'
        else:
            user.liked.append(project)
            action = 'liked'

        db.session.commit()
        return jsonify({'action': action, 'likes': project.likes_count}), 200

    @app.route('/api/feed/<int:project_id>/save', methods=['POST'])
    @jwt_required()
    def toggle_save(project_id):
        """Save/unsave a feed project"""
        user_id = get_jwt_identity()
        user = db.session.get(User, user_id)
        project = db.session.get(FeedProject, project_id)
        if not project:
            return jsonify({'error': 'Project not found'}), 404

        if project in user.saved:
            user.saved.remove(project)
            action = 'unsaved'
        else:
            user.saved.append(project)
            action = 'saved'

        db.session.commit()
        return jsonify({'action': action, 'saves': project.saves_count}), 200

    # ═══════════════════════════════════════════════════════
    # QUOTATION ROUTES
    # ═══════════════════════════════════════════════════════

    @app.route('/api/quotations', methods=['GET'])
    @jwt_required()
    def list_quotations():
        """List quotations (filtered by role)"""
        user_id = get_jwt_identity()
        user = db.session.get(User, user_id)
        page = request.args.get('page', 1, type=int)
        status = request.args.get('status', '')

        if user.role == 'user':
            query = QuotationRequest.query.filter_by(user_id=user.id)
        elif user.role == 'company':
            query = QuotationRequest.query.filter_by(status='active')
        else:
            query = QuotationRequest.query

        if status:
            query = query.filter_by(status=status)

        query = query.order_by(QuotationRequest.created_at.desc())
        pagination = query.paginate(page=page, per_page=20, error_out=False)

        return jsonify({
            'quotations': [q.to_dict() for q in pagination.items],
            'total': pagination.total,
        }), 200

    @app.route('/api/quotations', methods=['POST'])
    @jwt_required()
    def create_quotation():
        """Create a new quotation request"""
        user_id = get_jwt_identity()
        data = request.get_json()

        code = generate_code('QR', QuotationRequest, 'request_code')

        quotation = QuotationRequest(
            request_code=code,
            user_id=user_id,
            title=data['title'],
            description=data.get('description', ''),
            service_type=data['service_type'],
            area_sqft=data.get('area_sqft'),
            num_rooms=data.get('num_rooms'),
            location=data.get('location', ''),
            city=data.get('city', ''),
            budget_min=data.get('budget_min'),
            budget_max=data.get('budget_max'),
            budget_display=data.get('budget_display', ''),
            timeline=data.get('timeline', ''),
            urgency=data.get('urgency', 'normal'),
            material_preferences=json.dumps(data.get('materials', {})),
            green_mode=data.get('green_mode', False),
            expires_at=datetime.now(timezone.utc) + timedelta(days=30),
        )
        db.session.add(quotation)
        db.session.commit()

        # Notify relevant companies
        companies = Company.query.filter_by(is_active=True, platform_verified=True).all()
        for company in companies:
            services = [s.name for s in company.services]
            if data['service_type'] in services or not services:
                notif = Notification(
                    user_id=company.user_id,
                    title='New Quotation Request',
                    message=f'New request: {data["title"]} - {data.get("budget_display", "")}',
                    notification_type='new_quotation',
                    reference_type='quotation',
                    reference_id=quotation.id,
                )
                db.session.add(notif)

        db.session.commit()
        return jsonify({'message': 'Quotation created', 'quotation': quotation.to_dict()}), 201

    @app.route('/api/quotations/<int:quotation_id>', methods=['GET'])
    @jwt_required()
    def get_quotation(quotation_id):
        """Get quotation details with bids"""
        quotation = db.session.get(QuotationRequest, quotation_id)
        if not quotation:
            return jsonify({'error': 'Quotation not found'}), 404

        result = quotation.to_dict()
        result['bids'] = [b.to_dict() for b in quotation.bids]
        result['images'] = [{'url': img.url, 'filename': img.filename}
                           for img in quotation.reference_images]
        return jsonify(result), 200

    # ═══════════════════════════════════════════════════════
    # BID ROUTES
    # ═══════════════════════════════════════════════════════

    @app.route('/api/bids', methods=['POST'])
    @role_required('company')
    def submit_bid():
        """Submit a bid for a quotation"""
        company = g.current_user.company
        data = request.get_json()

        quotation_id = data['quotation_id']
        quotation = db.session.get(QuotationRequest, quotation_id)
        if not quotation or quotation.status != 'active':
            return jsonify({'error': 'Quotation not available'}), 400

        # Check if already bid
        existing = Bid.query.filter_by(
            quotation_id=quotation_id, company_id=company.id).first()
        if existing:
            return jsonify({'error': 'You have already bid on this quotation'}), 409

        code = generate_code('B', Bid, 'bid_code')

        bid = Bid(
            bid_code=code,
            quotation_id=quotation_id,
            company_id=company.id,
            total_price=data['total_price'],
            labor_cost=data.get('labor_cost', 0),
            material_cost=data.get('material_cost', 0),
            overhead_cost=data.get('overhead_cost', 0),
            timeline_days=data.get('timeline_days'),
            timeline_display=data.get('timeline_display', ''),
            warranty_months=data.get('warranty_months', 0),
            warranty_terms=data.get('warranty_terms', ''),
            materials_proposed=json.dumps(data.get('materials', [])),
            scope_of_work=data.get('scope_of_work', ''),
            notes=data.get('notes', ''),
        )
        db.session.add(bid)

        # Notify user
        notif = Notification(
            user_id=quotation.user_id,
            title='New Bid Received',
            message=f'{company.name} submitted a bid of ₹{data["total_price"]:,.0f}',
            notification_type='bid_received',
            reference_type='bid',
            reference_id=bid.id,
        )
        db.session.add(notif)
        db.session.commit()

        return jsonify({'message': 'Bid submitted', 'bid': bid.to_dict()}), 201

    @app.route('/api/bids/<int:bid_id>/accept', methods=['POST'])
    @role_required('user')
    def accept_bid(bid_id):
        """Accept a bid and create project"""
        user = g.current_user
        bid = db.session.get(Bid, bid_id)
        if not bid:
            return jsonify({'error': 'Bid not found'}), 404

        quotation = bid.quotation_request
        if quotation.user_id != user.id:
            return jsonify({'error': 'Not your quotation'}), 403

        # Accept the bid
        bid.status = 'accepted'
        quotation.status = 'awarded'
        quotation.awarded_bid_id = bid.id

        # Reject other bids
        other_bids = Bid.query.filter(
            Bid.quotation_id == quotation.id, Bid.id != bid.id).all()
        for ob in other_bids:
            ob.status = 'rejected'

        # Create project
        project_code = generate_code('P', Project, 'project_code')
        project = Project(
            project_code=project_code,
            quotation_id=quotation.id,
            bid_id=bid.id,
            company_id=bid.company_id,
            user_id=user.id,
            title=quotation.title,
            description=quotation.description,
            total_cost=bid.total_price,
            status='planning',
            start_date=datetime.now(timezone.utc).date(),
            expected_end_date=(datetime.now(timezone.utc) + timedelta(days=bid.timeline_days or 90)).date(),
            platform_commission=bid.total_price * 0.05,
        )
        db.session.add(project)
        db.session.flush()

        # Create default milestones
        default_milestones = [
            ('Planning & Design', 0),
            ('Material Procurement', 1),
            ('Work in Progress', 2),
            ('Quality Inspection', 3),
            ('Final Completion', 4),
        ]
        for name, order in default_milestones:
            ms = Milestone(project_id=project.id, name=name, sort_order=order)
            db.session.add(ms)

        # Notify company
        notif = Notification(
            user_id=bid.company.user_id,
            title='Bid Accepted! 🎉',
            message=f'Your bid for "{quotation.title}" has been accepted!',
            notification_type='bid_accepted',
            reference_type='project',
            reference_id=project.id,
        )
        db.session.add(notif)
        db.session.commit()

        return jsonify({'message': 'Bid accepted, project created', 'project': project.to_dict()}), 201

    @app.route('/api/bids/<int:bid_id>/reject', methods=['POST'])
    @role_required('user')
    def reject_bid(bid_id):
        """Reject a bid"""
        bid = db.session.get(Bid, bid_id)
        if not bid:
            return jsonify({'error': 'Bid not found'}), 404
        bid.status = 'rejected'
        db.session.commit()
        return jsonify({'message': 'Bid rejected'}), 200

    # ═══════════════════════════════════════════════════════
    # PROJECT ROUTES
    # ═══════════════════════════════════════════════════════

    @app.route('/api/projects', methods=['GET'])
    @jwt_required()
    def list_projects():
        """List user/company projects"""
        user_id = get_jwt_identity()
        user = db.session.get(User, user_id)
        status = request.args.get('status', '')

        if user.role == 'company' and user.company:
            query = Project.query.filter_by(company_id=user.company.id)
        else:
            query = Project.query.filter_by(user_id=user.id)

        if status:
            query = query.filter_by(status=status)

        projects = query.order_by(Project.created_at.desc()).all()
        return jsonify({'projects': [p.to_dict() for p in projects]}), 200

    @app.route('/api/projects/<int:project_id>', methods=['GET'])
    @jwt_required()
    def get_project(project_id):
        """Get project details"""
        project = db.session.get(Project, project_id)
        if not project:
            return jsonify({'error': 'Project not found'}), 404

        result = project.to_dict()
        if project.warranty:
            result['warranty'] = project.warranty.to_dict()
        result['payments'] = [p.to_dict() for p in project.payments]
        return jsonify(result), 200

    @app.route('/api/projects/<int:project_id>/milestone/<int:milestone_id>/complete', methods=['POST'])
    @role_required('company')
    def complete_milestone(project_id, milestone_id):
        """Mark a milestone as completed"""
        milestone = db.session.get(Milestone, milestone_id)
        if not milestone or milestone.project_id != project_id:
            return jsonify({'error': 'Milestone not found'}), 404

        milestone.status = 'completed'
        milestone.completed_date = datetime.now(timezone.utc).date()

        # Update next milestone to in_progress
        next_ms = Milestone.query.filter(
            Milestone.project_id == project_id,
            Milestone.sort_order > milestone.sort_order
        ).order_by(Milestone.sort_order).first()
        if next_ms:
            next_ms.status = 'in_progress'

        # Update project progress
        project = db.session.get(Project, project_id)
        total = len(project.milestones)
        completed = sum(1 for m in project.milestones if m.status == 'completed')
        project.progress = int((completed / total) * 100) if total > 0 else 0

        if project.progress >= 100:
            project.status = 'completed'
            project.actual_end_date = datetime.now(timezone.utc).date()
            # Update company stats
            company = project.company
            company.completed_projects += 1

        # Notify user
        notif = Notification(
            user_id=project.user_id,
            title='Milestone Completed ✅',
            message=f'"{milestone.name}" has been completed for your project.',
            notification_type='project_update',
            reference_type='project',
            reference_id=project.id,
        )
        db.session.add(notif)
        db.session.commit()

        return jsonify({'message': 'Milestone completed', 'project': project.to_dict()}), 200

    # ═══════════════════════════════════════════════════════
    # MATERIAL PRICE ROUTES
    # ═══════════════════════════════════════════════════════

    @app.route('/api/materials', methods=['GET'])
    def list_materials():
        """List material prices with filtering"""
        category = request.args.get('category', '')
        search = request.args.get('search', '')
        city = request.args.get('city', '')

        query = Material.query
        if category and category != 'All':
            query = query.filter_by(category=category)
        if search:
            query = query.filter(
                db.or_(Material.name.ilike(f'%{search}%'),
                       Material.brand.ilike(f'%{search}%')))
        if city:
            query = query.filter_by(city=city)

        materials = query.order_by(Material.category, Material.name).all()
        return jsonify({'materials': [m.to_dict() for m in materials]}), 200

    @app.route('/api/materials/<int:material_id>/history', methods=['GET'])
    def material_history(material_id):
        """Get price history for a material"""
        material = db.session.get(Material, material_id)
        if not material:
            return jsonify({'error': 'Material not found'}), 404

        history = MaterialPriceHistory.query.filter_by(
            material_id=material_id).order_by(
            MaterialPriceHistory.recorded_at.desc()).limit(30).all()

        return jsonify({
            'material': material.to_dict(),
            'history': [{'price': h.price, 'date': h.recorded_at.isoformat()} for h in history],
        }), 200

    @app.route('/api/materials/categories', methods=['GET'])
    def material_categories():
        """Get unique material categories"""
        categories = db.session.query(Material.category).distinct().all()
        return jsonify({'categories': ['All'] + [c[0] for c in categories]}), 200

    # ═══════════════════════════════════════════════════════
    # AI ESTIMATOR ROUTES
    # ═══════════════════════════════════════════════════════

    BASE_COSTS = {
        'Interior Design': 800, 'Renovation': 650, 'Furniture': 500,
        'Plumbing': 200, 'Electrical': 150, 'Full Construction': 1800,
    }
    QUALITY_MULTIPLIERS = {
        'Economy': 1.0, 'Standard': 1.5, 'Premium': 2.2, 'Luxury': 3.5,
    }
    MATERIAL_SUGGESTIONS = {
        'Interior Design': ['Plywood BWR', 'Laminate/Veneer', 'Hardware', 'Paint', 'Lighting', 'Tiles'],
        'Renovation': ['Cement', 'Sand', 'Tiles', 'Paint', 'Plumbing Fittings', 'Electrical'],
        'Furniture': ['Teak/Sal Wood', 'Plywood', 'Laminate', 'Hardware', 'Glass'],
        'Plumbing': ['CPVC Pipes', 'Fittings', 'Mixer Taps', 'Sanitaryware'],
        'Electrical': ['Copper Wire', 'Switches', 'MCB Panel', 'LED Lights'],
        'Full Construction': ['Cement', 'Steel TMT', 'Bricks/Blocks', 'Sand', 'Aggregate',
                              'Plumbing', 'Electrical', 'Paint'],
    }

    @app.route('/api/ai-estimate', methods=['POST'])
    def ai_estimate():
        """Generate AI cost estimate"""
        data = request.get_json()
        service = data.get('service_type', '')
        area = float(data.get('area_sqft', 1000))
        quality = data.get('quality_level', 'Standard')
        rooms = int(data.get('num_rooms', 3))

        base = BASE_COSTS.get(service, 800)
        mult = QUALITY_MULTIPLIERS.get(quality, 1.5)

        min_cost = round(base * area * mult * 0.85)
        max_cost = round(base * area * mult * 1.15)
        days = round((area / 100) * mult * rooms * 1.5)
        duration = f"{days} - {days + 15} days"
        materials = MATERIAL_SUGGESTIONS.get(service, [])

        # Green mode suggestions
        green_materials = []
        if data.get('green_mode'):
            green_materials = [
                'Fly Ash Bricks (eco-friendly)',
                'Low-VOC Paint',
                'Bamboo Flooring',
                'Recycled Steel',
                'Solar Panels',
            ]

        # Log the estimation
        try:
            user_id = get_jwt_identity() if request.headers.get('Authorization') else None
        except Exception:
            user_id = None

        log = AIEstimationLog(
            user_id=user_id, service_type=service, area_sqft=area,
            quality_level=quality, num_rooms=rooms,
            estimated_min=min_cost, estimated_max=max_cost,
            estimated_duration=duration,
        )
        db.session.add(log)
        db.session.commit()

        return jsonify({
            'estimate': {
                'min_cost': min_cost,
                'max_cost': max_cost,
                'duration': duration,
                'materials': materials,
                'green_materials': green_materials,
                'carbon_score': round(area * 0.05 * mult, 1) if data.get('green_mode') else None,
            }
        }), 200

    # ═══════════════════════════════════════════════════════
    # REVIEW ROUTES
    # ═══════════════════════════════════════════════════════

    @app.route('/api/reviews', methods=['POST'])
    @role_required('user')
    def create_review():
        """Submit a review for a company"""
        data = request.get_json()
        user = g.current_user

        review = Review(
            user_id=user.id,
            company_id=data['company_id'],
            project_id=data.get('project_id'),
            rating=data['rating'],
            title=data.get('title', ''),
            comment=data.get('comment', ''),
            is_verified=data.get('project_id') is not None,
        )
        db.session.add(review)
        db.session.commit()
        return jsonify({'message': 'Review submitted', 'review': review.to_dict()}), 201

    @app.route('/api/reviews/company/<int:company_id>', methods=['GET'])
    def get_company_reviews(company_id):
        """Get reviews for a company"""
        page = request.args.get('page', 1, type=int)
        reviews = Review.query.filter_by(company_id=company_id).order_by(
            Review.created_at.desc()).paginate(page=page, per_page=20, error_out=False)

        # Rating breakdown
        rating_counts = {}
        for r in range(1, 6):
            rating_counts[r] = Review.query.filter(
                Review.company_id == company_id,
                Review.rating >= r, Review.rating < r + 1).count()

        return jsonify({
            'reviews': [r.to_dict() for r in reviews.items],
            'total': reviews.total,
            'rating_breakdown': rating_counts,
        }), 200

    # ═══════════════════════════════════════════════════════
    # CHAT ROUTES
    # ═══════════════════════════════════════════════════════

    @app.route('/api/chat/rooms', methods=['GET'])
    @jwt_required()
    def list_chat_rooms():
        """List user's chat rooms"""
        user_id = get_jwt_identity()
        user = db.session.get(User, user_id)

        if user.role == 'company' and user.company:
            rooms = ChatRoom.query.filter_by(company_id=user.company.id, is_active=True).all()
        else:
            rooms = ChatRoom.query.filter_by(user_id=user.id, is_active=True).all()

        result = []
        for room in rooms:
            last_msg = ChatMessage.query.filter_by(room_id=room.id).order_by(
                ChatMessage.created_at.desc()).first()
            result.append({
                'id': room.id,
                'user_name': room.user.full_name,
                'company_name': room.company_rel.name,
                'last_message': last_msg.to_dict() if last_msg else None,
                'unread': ChatMessage.query.filter(
                    ChatMessage.room_id == room.id,
                    ChatMessage.sender_id != user.id,
                    ChatMessage.is_read == False
                ).count(),
            })
        return jsonify({'rooms': result}), 200

    @app.route('/api/chat/rooms', methods=['POST'])
    @jwt_required()
    def create_chat_room():
        """Create or get existing chat room"""
        user_id = get_jwt_identity()
        data = request.get_json()
        company_id = data['company_id']

        room = ChatRoom.query.filter_by(
            user_id=user_id, company_id=company_id, is_active=True).first()
        if not room:
            room = ChatRoom(
                user_id=user_id, company_id=company_id,
                quotation_id=data.get('quotation_id'),
                project_id=data.get('project_id'),
            )
            db.session.add(room)
            db.session.commit()
        return jsonify({'room_id': room.id}), 200

    @app.route('/api/chat/rooms/<int:room_id>/messages', methods=['GET'])
    @jwt_required()
    def get_messages(room_id):
        """Get messages in a chat room"""
        messages = ChatMessage.query.filter_by(room_id=room_id).order_by(
            ChatMessage.created_at.asc()).all()
        return jsonify({'messages': [m.to_dict() for m in messages]}), 200

    @app.route('/api/chat/rooms/<int:room_id>/messages', methods=['POST'])
    @jwt_required()
    def send_message(room_id):
        """Send a chat message"""
        user_id = get_jwt_identity()
        data = request.get_json()

        msg = ChatMessage(
            room_id=room_id, sender_id=user_id,
            message=data['message'],
            message_type=data.get('type', 'text'),
        )
        db.session.add(msg)
        db.session.commit()
        return jsonify({'message': msg.to_dict()}), 201

    # ═══════════════════════════════════════════════════════
    # NOTIFICATION ROUTES
    # ═══════════════════════════════════════════════════════

    @app.route('/api/notifications', methods=['GET'])
    @jwt_required()
    def get_notifications():
        """Get user notifications"""
        user_id = get_jwt_identity()
        unread_only = request.args.get('unread', 'false') == 'true'

        query = Notification.query.filter_by(user_id=user_id)
        if unread_only:
            query = query.filter_by(is_read=False)

        notifications = query.order_by(Notification.created_at.desc()).limit(50).all()
        unread_count = Notification.query.filter_by(user_id=user_id, is_read=False).count()

        return jsonify({
            'notifications': [n.to_dict() for n in notifications],
            'unread_count': unread_count,
        }), 200

    @app.route('/api/notifications/read', methods=['POST'])
    @jwt_required()
    def mark_notifications_read():
        """Mark notifications as read"""
        user_id = get_jwt_identity()
        data = request.get_json()
        ids = data.get('ids', [])

        if ids:
            Notification.query.filter(
                Notification.id.in_(ids),
                Notification.user_id == user_id
            ).update({'is_read': True}, synchronize_session=False)
        else:
            Notification.query.filter_by(user_id=user_id).update(
                {'is_read': True}, synchronize_session=False)

        db.session.commit()
        return jsonify({'message': 'Notifications marked as read'}), 200

    # ═══════════════════════════════════════════════════════
    # ADMIN ROUTES
    # ═══════════════════════════════════════════════════════

    @app.route('/api/admin/stats', methods=['GET'])
    @role_required('admin')
    def admin_stats():
        """Get platform statistics"""
        total_users = User.query.filter_by(role='user').count()
        total_companies = Company.query.count()
        active_projects = Project.query.filter(
            Project.status.notin_(['completed', 'cancelled'])).count()
        completed_projects = Project.query.filter_by(status='completed').count()
        total_quotations = QuotationRequest.query.count()
        total_bids = Bid.query.count()
        disputes = Report.query.filter_by(status='open').count()

        total_revenue = db.session.query(
            db.func.sum(Payment.amount)).filter(
            Payment.status.in_(['completed', 'released'])).scalar() or 0
        total_commission = db.session.query(
            db.func.sum(Payment.commission)).filter(
            Payment.status.in_(['completed', 'released'])).scalar() or 0
        avg_quotation = db.session.query(
            db.func.avg(Bid.total_price)).scalar() or 0

        success_rate = (completed_projects / max(completed_projects + active_projects, 1)) * 100

        return jsonify({
            'total_users': total_users,
            'total_companies': total_companies,
            'active_projects': active_projects,
            'completed_projects': completed_projects,
            'total_quotations': total_quotations,
            'total_bids': total_bids,
            'total_revenue': total_revenue,
            'total_commission': total_commission,
            'avg_quotation_value': round(avg_quotation),
            'project_success_rate': round(success_rate, 1),
            'disputes': disputes,
        }), 200

    @app.route('/api/admin/users', methods=['GET'])
    @role_required('admin')
    def admin_list_users():
        """List all users with filters"""
        page = request.args.get('page', 1, type=int)
        role = request.args.get('role', '')
        status = request.args.get('status', '')

        query = User.query
        if role:
            query = query.filter_by(role=role)
        if status == 'active':
            query = query.filter_by(is_active=True)
        elif status == 'suspended':
            query = query.filter_by(is_active=False)

        pagination = query.order_by(User.created_at.desc()).paginate(
            page=page, per_page=20, error_out=False)

        return jsonify({
            'users': [u.to_dict() for u in pagination.items],
            'total': pagination.total,
            'pages': pagination.pages,
        }), 200

    @app.route('/api/admin/users/<int:user_id>/toggle-status', methods=['POST'])
    @role_required('admin')
    def toggle_user_status(user_id):
        """Activate/suspend a user"""
        user = db.session.get(User, user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        user.is_active = not user.is_active
        db.session.commit()
        return jsonify({'message': f'User {"activated" if user.is_active else "suspended"}',
                       'user': user.to_dict()}), 200

    @app.route('/api/admin/companies/verify/<int:company_id>', methods=['POST'])
    @role_required('admin')
    def verify_company(company_id):
        """Verify/reject a company"""
        company = db.session.get(Company, company_id)
        if not company:
            return jsonify({'error': 'Company not found'}), 404

        data = request.get_json()
        action = data.get('action', 'approve')

        if action == 'approve':
            company.verification_status = 'approved'
            company.platform_verified = True
            company.gst_verified = True
        else:
            company.verification_status = 'rejected'
            company.platform_verified = False

        db.session.commit()
        return jsonify({'message': f'Company {action}ed', 'company': company.to_dict()}), 200

    @app.route('/api/admin/reports', methods=['GET'])
    @role_required('admin')
    def admin_reports():
        """Get moderation reports"""
        status = request.args.get('status', 'open')
        reports = Report.query.filter_by(status=status).order_by(
            Report.created_at.desc()).all()
        return jsonify({'reports': [r.to_dict() for r in reports]}), 200

    @app.route('/api/admin/reports/<int:report_id>/resolve', methods=['POST'])
    @role_required('admin')
    def resolve_report(report_id):
        """Resolve a report"""
        report = db.session.get(Report, report_id)
        if not report:
            return jsonify({'error': 'Report not found'}), 404

        data = request.get_json()
        report.status = data.get('status', 'resolved')
        report.admin_notes = data.get('notes', '')
        report.resolved_by = g.current_user.id
        report.resolved_at = datetime.now(timezone.utc)
        db.session.commit()
        return jsonify({'message': 'Report resolved'}), 200

    @app.route('/api/admin/projects', methods=['GET'])
    @role_required('admin')
    def admin_projects():
        """List all projects for admin oversight"""
        page = request.args.get('page', 1, type=int)
        status = request.args.get('status', '')

        query = Project.query
        if status:
            query = query.filter_by(status=status)

        pagination = query.order_by(Project.created_at.desc()).paginate(
            page=page, per_page=20, error_out=False)

        return jsonify({
            'projects': [p.to_dict() for p in pagination.items],
            'total': pagination.total,
        }), 200

    @app.route('/api/admin/analytics/growth', methods=['GET'])
    @role_required('admin')
    def growth_analytics():
        """Platform growth analytics"""
        stats = PlatformStats.query.order_by(PlatformStats.date.desc()).limit(30).all()
        return jsonify({
            'data': [{
                'date': s.date.isoformat(),
                'users': s.total_users,
                'companies': s.total_companies,
                'projects': s.active_projects,
                'revenue': s.total_revenue,
            } for s in reversed(stats)]
        }), 200

    # ═══════════════════════════════════════════════════════
    # AI DESIGNER ROUTES (Gemini Chat + HuggingFace Image)
    # ═══════════════════════════════════════════════════════

    @app.route('/api/ai-designer/chat', methods=['POST'])
    def ai_designer_chat():
        """Proxy chat request to Gemini API"""
        data = request.get_json()
        gemini_key = data.get('gemini_api_key', '')
        prompt = data.get('prompt', '')
        history = data.get('history', [])

        if not gemini_key or not prompt:
            return jsonify({'error': 'API key and prompt are required'}), 400

        try:
            import google.generativeai as genai_lib
            genai_lib.configure(api_key=gemini_key)
            model = genai_lib.GenerativeModel('gemini-2.0-flash')

            system_instruction = (
                "You are an expert architect and interior designer named BuildBidBot. "
                "Keep responses concise, helpful, creative, and professional. "
                "When discussing designs, mention materials, estimated costs in INR, "
                "color palettes, and space optimization tips. "
                "If the user finalizes an idea, remind them they can use the "
                "'Generate Image' button to see a visual render. "
                "Use markdown formatting for better readability. "
                "Always consider Indian construction standards and materials."
            )

            # Build conversation context
            conversation = f"System Persona: {system_instruction}\n\n"
            for msg in history[-10:]:  # Last 10 messages for context
                role = "User" if msg.get('role') == 'user' else "Assistant"
                conversation += f"{role}: {msg.get('content', '')}\n\n"
            conversation += f"User: {prompt}"

            response = model.generate_content(conversation)
            reply = response.text

            return jsonify({'reply': reply}), 200

        except Exception as e:
            return jsonify({'error': f'Gemini API Error: {str(e)}'}), 500

    @app.route('/api/ai-designer/generate-image', methods=['POST'])
    def ai_designer_generate_image():
        """Proxy image generation request to Hugging Face API"""
        import base64

        data = request.get_json()
        hf_token = data.get('hf_api_key', '')
        prompt = data.get('prompt', '')
        style = data.get('style', 'photorealistic')

        if not hf_token or not prompt:
            return jsonify({'error': 'HF token and prompt are required'}), 400

        try:
            import requests as req

            # Enhance prompt based on style
            style_prompts = {
                'photorealistic': 'Professional architectural visualization, photorealistic, highly detailed, 8k resolution, natural lighting, ',
                'blueprint': 'Architectural blueprint style, technical drawing, blue and white color scheme, precise lines, measurements, ',
                'watercolor': 'Architectural watercolor painting, artistic, soft colors, elegant sketch, ',
                'modern': 'Modern minimalist interior design, clean lines, contemporary furniture, natural materials, ',
                'traditional': 'Traditional Indian architecture, ornate details, warm colors, cultural elements, ',
                '3d_render': 'Professional 3D architectural render, ray tracing, global illumination, cinematic lighting, ',
            }

            enhanced_prompt = style_prompts.get(style, style_prompts['photorealistic']) + prompt

            HF_API_URL = "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0"
            headers = {"Authorization": f"Bearer {hf_token}"}

            response = req.post(
                HF_API_URL,
                headers=headers,
                json={
                    "inputs": enhanced_prompt,
                    "parameters": {
                        "num_inference_steps": 30,
                        "guidance_scale": 7.5,
                    }
                },
                timeout=120
            )

            if response.status_code == 200:
                # Convert image to base64
                image_base64 = base64.b64encode(response.content).decode('utf-8')
                return jsonify({
                    'image': f'data:image/png;base64,{image_base64}',
                    'prompt_used': enhanced_prompt,
                }), 200
            elif response.status_code == 503:
                return jsonify({
                    'error': 'Model is loading. Please wait 10-20 seconds and try again.',
                    'estimated_time': response.json().get('estimated_time', 20)
                }), 503
            else:
                error_msg = response.json().get('error', 'Unknown error from Hugging Face')
                return jsonify({'error': error_msg}), response.status_code

        except Exception as e:
            return jsonify({'error': f'Image Generation Error: {str(e)}'}), 500

    @app.route('/api/ai-designer/suggest-prompt', methods=['POST'])
    def suggest_design_prompt():
        """Generate design prompt suggestions based on user input"""
        data = request.get_json()
        room_type = data.get('room_type', 'living room')
        style_pref = data.get('style', 'modern')
        budget = data.get('budget', 'medium')

        suggestions = {
            'living room': [
                f'A {style_pref} living room with L-shaped sofa, wooden coffee table, ambient lighting, and indoor plants',
                f'Open concept {style_pref} living room with floor-to-ceiling windows, minimalist furniture, and accent wall',
                f'Cozy {style_pref} living room with bookshelf wall, sectional sofa, pendant lights, and jute rug',
            ],
            'bedroom': [
                f'A {style_pref} master bedroom with king-size bed, walk-in wardrobe, bedside tables, and soft lighting',
                f'Luxurious {style_pref} bedroom with upholstered headboard, vanity area, and panoramic window',
                f'Compact {style_pref} bedroom with space-saving furniture, murphy bed, and built-in storage',
            ],
            'kitchen': [
                f'A {style_pref} modular kitchen with island counter, chimney hood, and pendant lights',
                f'L-shaped {style_pref} kitchen with granite countertop, backsplash tiles, and breakfast bar',
                f'Open {style_pref} kitchen with dining area, wine rack, and smart appliances',
            ],
            'bathroom': [
                f'A {style_pref} bathroom with rain shower, floating vanity, and decorative tiles',
                f'Spa-inspired {style_pref} bathroom with freestanding bathtub, natural stone, and greenery',
                f'Compact {style_pref} bathroom with glass partition, wall-mounted fixtures, and LED mirror',
            ],
            'office': [
                f'A {style_pref} home office with standing desk, bookshelf, task lighting, and ergonomic chair',
                f'Creative {style_pref} workspace with whiteboard wall, modular shelving, and indoor plants',
                f'Minimalist {style_pref} office with clean desk setup, acoustic panels, and ambient lighting',
            ],
            'exterior': [
                f'A {style_pref} house exterior with landscaped garden, porch, and decorative facade',
                f'{style_pref} villa exterior with swimming pool, outdoor seating, and pergola',
                f'Two-story {style_pref} house with balcony, car porch, and boundary wall design',
            ],
        }

        return jsonify({
            'suggestions': suggestions.get(room_type, suggestions['living room'])
        }), 200

    # ═══════════════════════════════════════════════════════
    # SUBSCRIPTION ROUTES
    # ═══════════════════════════════════════════════════════

    @app.route('/api/subscriptions/plans', methods=['GET'])
    def list_subscription_plans():
        """Get available subscription plans"""
        plans = SubscriptionPlan.query.filter_by(is_active=True).all()
        return jsonify({'plans': [p.to_dict() for p in plans]}), 200

    # ═══════════════════════════════════════════════════════
    # SERVICE CATEGORIES
    # ═══════════════════════════════════════════════════════

    @app.route('/api/services', methods=['GET'])
    def list_services():
        """Get all service categories"""
        services = Service.query.filter_by(is_active=True).all()
        return jsonify({'services': [s.to_dict() for s in services]}), 200

    # ═══════════════════════════════════════════════════════
    # HEALTH CHECK
    # ═══════════════════════════════════════════════════════

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'version': '1.0.0',
            'database': 'connected',
            'timestamp': datetime.now(timezone.utc).isoformat(),
        }), 200

    return app


# ─── RUN SERVER ───────────────────────────────────────────
if __name__ == '__main__':
    app = create_app('development')
    app.run(host='0.0.0.0', port=5000, debug=True)
