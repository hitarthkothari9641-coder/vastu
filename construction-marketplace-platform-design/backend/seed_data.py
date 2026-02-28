"""
BuildBid - Database Seed Script
Populates the SQLite database with comprehensive sample data
Run: python seed_data.py
"""
import json
from datetime import datetime, timezone, timedelta, date
import bcrypt
from app import create_app
from models import (
    db, User, Company, Service, Certification, FeedProject, ProjectImage,
    QuotationRequest, Bid, Project, Milestone, Payment, Review,
    Material, MaterialPriceHistory, Warranty, ChatRoom, ChatMessage,
    Notification, Report, PlatformStats, SubscriptionPlan
)


def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def seed():
    app = create_app('development')
    with app.app_context():
        print("🗑️  Dropping all tables...")
        db.drop_all()
        print("📦 Creating all tables...")
        db.create_all()

        # ─── SERVICES ────────────────────────────────────
        print("🔧 Seeding services...")
        services = [
            Service(name='Construction', slug='construction', icon='🏗️',
                    description='New construction projects'),
            Service(name='Renovation', slug='renovation', icon='🏠',
                    description='Upgrade & remodel spaces'),
            Service(name='Interior', slug='interior', icon='🎨',
                    description='Complete interior solutions'),
            Service(name='Furniture', slug='furniture', icon='🪑',
                    description='Custom furniture making'),
            Service(name='Electrical', slug='electrical', icon='⚡',
                    description='Wiring & electrical work'),
            Service(name='Plumbing', slug='plumbing', icon='🔧',
                    description='Pipes, fittings & fixtures'),
        ]
        db.session.add_all(services)
        db.session.flush()

        # ─── SUBSCRIPTION PLANS ──────────────────────────
        print("💳 Seeding subscription plans...")
        plans = [
            SubscriptionPlan(name='Free', price_monthly=0, price_yearly=0,
                             max_bids_per_month=5, features='["Basic profile","5 bids/month"]'),
            SubscriptionPlan(name='Basic', price_monthly=999, price_yearly=9999,
                             max_bids_per_month=25, priority_listing=True,
                             features='["Priority listing","25 bids/month","Basic analytics"]'),
            SubscriptionPlan(name='Premium', price_monthly=2499, price_yearly=24999,
                             max_bids_per_month=100, priority_listing=True,
                             analytics_access=True, premium_leads=True, verified_badge=True,
                             features='["Top listing","Unlimited bids","Full analytics","Premium leads","Verified badge"]'),
            SubscriptionPlan(name='Enterprise', price_monthly=4999, price_yearly=49999,
                             max_bids_per_month=999, priority_listing=True,
                             analytics_access=True, premium_leads=True, verified_badge=True,
                             features='["Everything in Premium","Dedicated manager","Custom branding","API access"]'),
        ]
        db.session.add_all(plans)
        db.session.flush()

        # ─── ADMIN USER ─────────────────────────────────
        print("👤 Seeding admin user...")
        admin = User(email='admin@buildbid.com', password_hash=hash_password('admin123'),
                     full_name='Admin', phone='+919999900000', role='admin',
                     location='Mumbai, India', is_active=True, is_verified=True)
        db.session.add(admin)
        db.session.flush()

        # ─── REGULAR USERS ──────────────────────────────
        print("👥 Seeding users...")
        users_data = [
            ('Rajesh Kumar', 'rajesh@email.com', '+919876543210', 'Mumbai, Maharashtra'),
            ('Priya Sharma', 'priya@email.com', '+919876543211', 'Delhi, NCR'),
            ('Amit Patel', 'amit@email.com', '+919876543212', 'Ahmedabad, Gujarat'),
            ('Sneha Reddy', 'sneha@email.com', '+919876543213', 'Hyderabad, Telangana'),
            ('Vikram Singh', 'vikram@email.com', '+919876543214', 'Jaipur, Rajasthan'),
            ('Anita Gupta', 'anita@email.com', '+919876543215', 'Pune, Maharashtra'),
            ('Rohit Mehta', 'rohit@email.com', '+919876543216', 'Bangalore, Karnataka'),
            ('Kavita Nair', 'kavita@email.com', '+919876543217', 'Chennai, Tamil Nadu'),
            ('Suresh Yadav', 'suresh@email.com', '+919876543218', 'Lucknow, UP'),
            ('Deepika Joshi', 'deepika@email.com', '+919876543219', 'Kolkata, West Bengal'),
        ]
        users = []
        for name, email, phone, location in users_data:
            u = User(email=email, password_hash=hash_password('user123'),
                     full_name=name, phone=phone, role='user',
                     location=location, is_active=True, is_verified=True)
            db.session.add(u)
            users.append(u)
        db.session.flush()

        # Mark one user as inactive for admin demo
        users[3].is_active = False

        # ─── COMPANY USERS & PROFILES ────────────────────
        print("🏢 Seeding companies...")
        companies_data = [
            {
                'user': ('BuildCraft India Owner', 'buildcraft@email.com', '+919800000001', 'Mumbai, Maharashtra'),
                'company': {
                    'name': 'BuildCraft India', 'logo_emoji': '🏗️',
                    'description': 'Leading construction company specializing in residential and commercial projects with over 12 years of experience.',
                    'location': 'Mumbai, Maharashtra', 'city': 'Mumbai', 'state': 'Maharashtra',
                    'experience_years': 12, 'gst_number': '27AABCU9603R1ZM',
                    'gst_verified': True, 'licensed': True, 'platform_verified': True,
                    'verification_status': 'approved', 'rating': 4.8, 'total_reviews': 234,
                    'completed_projects': 189, 'success_rate': 96.0,
                    'total_earnings': 4560000, 'subscription_plan': 'premium',
                    'services': ['Construction', 'Renovation'],
                },
            },
            {
                'user': ('DesignHub Studios Owner', 'designhub@email.com', '+919800000002', 'Bangalore, Karnataka'),
                'company': {
                    'name': 'DesignHub Studios', 'logo_emoji': '🎨',
                    'description': 'Award-winning interior design studio with modern aesthetics and cutting-edge technology.',
                    'location': 'Bangalore, Karnataka', 'city': 'Bangalore', 'state': 'Karnataka',
                    'experience_years': 8, 'gst_number': '29AADCD1234F1ZP',
                    'gst_verified': True, 'licensed': True, 'platform_verified': True,
                    'verification_status': 'approved', 'rating': 4.9, 'total_reviews': 178,
                    'completed_projects': 145, 'success_rate': 98.0,
                    'total_earnings': 3800000, 'subscription_plan': 'premium',
                    'services': ['Interior', 'Furniture'],
                },
            },
            {
                'user': ('WoodWorks Pro Owner', 'woodworks@email.com', '+919800000003', 'Jaipur, Rajasthan'),
                'company': {
                    'name': 'WoodWorks Pro', 'logo_emoji': '🪵',
                    'description': 'Master craftsmen creating bespoke furniture since 2009. Specializing in teak and rosewood.',
                    'location': 'Jaipur, Rajasthan', 'city': 'Jaipur', 'state': 'Rajasthan',
                    'experience_years': 15, 'gst_number': '08AABCW5678G1ZR',
                    'gst_verified': True, 'licensed': True, 'platform_verified': True,
                    'verification_status': 'approved', 'rating': 4.7, 'total_reviews': 156,
                    'completed_projects': 312, 'success_rate': 94.0,
                    'total_earnings': 2900000, 'subscription_plan': 'basic',
                    'services': ['Furniture', 'Interior'],
                },
            },
            {
                'user': ('PowerGrid Solutions Owner', 'powergrid@email.com', '+919800000004', 'Delhi, NCR'),
                'company': {
                    'name': 'PowerGrid Solutions', 'logo_emoji': '⚡',
                    'description': 'Certified electrical contractors for residential and commercial projects with safety compliance.',
                    'location': 'Delhi NCR', 'city': 'Delhi', 'state': 'Delhi',
                    'experience_years': 10, 'gst_number': '07AABCP9012H1ZQ',
                    'gst_verified': True, 'licensed': True, 'platform_verified': True,
                    'verification_status': 'approved', 'rating': 4.6, 'total_reviews': 98,
                    'completed_projects': 456, 'success_rate': 97.0,
                    'total_earnings': 2100000, 'subscription_plan': 'basic',
                    'services': ['Electrical'],
                },
            },
            {
                'user': ('AquaFix Plumbers Owner', 'aquafix@email.com', '+919800000005', 'Chennai, Tamil Nadu'),
                'company': {
                    'name': 'AquaFix Plumbers', 'logo_emoji': '🔧',
                    'description': 'Professional plumbing services with 24/7 emergency support and licensed technicians.',
                    'location': 'Chennai, Tamil Nadu', 'city': 'Chennai', 'state': 'Tamil Nadu',
                    'experience_years': 7, 'gst_number': '33AABCA3456I1ZS',
                    'gst_verified': True, 'licensed': False, 'platform_verified': True,
                    'verification_status': 'approved', 'rating': 4.5, 'total_reviews': 87,
                    'completed_projects': 234, 'success_rate': 93.0,
                    'total_earnings': 1800000, 'subscription_plan': 'free',
                    'services': ['Plumbing', 'Renovation'],
                },
            },
            {
                'user': ('GreenBuild Eco Owner', 'greenbuild@email.com', '+919800000006', 'Pune, Maharashtra'),
                'company': {
                    'name': 'GreenBuild Eco', 'logo_emoji': '🌱',
                    'description': 'Eco-friendly construction using sustainable materials and green building practices.',
                    'location': 'Pune, Maharashtra', 'city': 'Pune', 'state': 'Maharashtra',
                    'experience_years': 5, 'gst_number': '27AABCG7890J1ZT',
                    'gst_verified': True, 'licensed': True, 'platform_verified': True,
                    'verification_status': 'approved', 'rating': 4.8, 'total_reviews': 67,
                    'completed_projects': 78, 'success_rate': 99.0,
                    'total_earnings': 1500000, 'subscription_plan': 'premium',
                    'services': ['Construction', 'Renovation'],
                },
            },
        ]

        company_objects = []
        for cd in companies_data:
            udata = cd['user']
            cu = User(email=udata[1], password_hash=hash_password('company123'),
                      full_name=udata[0], phone=udata[2], role='company',
                      location=udata[3], is_active=True, is_verified=True)
            db.session.add(cu)
            db.session.flush()

            cdata = cd['company']
            service_names = cdata.pop('services')
            company = Company(user_id=cu.id, **cdata)
            db.session.add(company)
            db.session.flush()

            for sname in service_names:
                svc = Service.query.filter_by(name=sname).first()
                if svc:
                    company.services.append(svc)

            # Add certifications
            cert = Certification(
                company_id=company.id,
                name='ISO 9001:2015 Quality Management',
                issuer='Bureau Veritas',
                issue_date=date(2022, 1, 15),
                expiry_date=date(2025, 1, 14),
                verified=True
            )
            db.session.add(cert)

            company_objects.append(company)

        db.session.flush()

        # ─── FEED PROJECTS ──────────────────────────────
        print("📸 Seeding feed projects...")
        feed_data = [
            {
                'company_id': company_objects[0].id, 'title': 'Modern Kitchen Renovation',
                'category': 'Renovation', 'description': 'Complete kitchen overhaul with modular cabinets, granite countertops, and smart lighting system.',
                'cost_range_display': '₹3,50,000 - ₹5,00,000', 'cost_min': 350000, 'cost_max': 500000,
                'timeline': '45 days', 'materials_used': json.dumps(['Italian Marble', 'Teak Wood', 'SS Hardware']),
                'likes_count': 234, 'saves_count': 89, 'is_featured': True,
                'images': ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600'],
            },
            {
                'company_id': company_objects[1].id, 'title': 'Luxury Living Room Interior',
                'category': 'Interior', 'description': 'Elegant living room with custom furniture, ambient lighting, and premium wall paneling.',
                'cost_range_display': '₹5,00,000 - ₹8,00,000', 'cost_min': 500000, 'cost_max': 800000,
                'timeline': '60 days', 'materials_used': json.dumps(['Walnut Veneer', 'Imported Fabric', 'LED Panels']),
                'likes_count': 456, 'saves_count': 167, 'is_featured': True,
                'images': ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600'],
            },
            {
                'company_id': company_objects[2].id, 'title': 'Custom Wardrobe & Study',
                'category': 'Furniture', 'description': 'Space-saving wardrobe with integrated study desk and bookshelves.',
                'cost_range_display': '₹1,50,000 - ₹2,50,000', 'cost_min': 150000, 'cost_max': 250000,
                'timeline': '20 days', 'materials_used': json.dumps(['Plywood BWR', 'Laminate Finish', 'Soft-close Hinges']),
                'likes_count': 178, 'saves_count': 45,
                'images': ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600'],
            },
            {
                'company_id': company_objects[3].id, 'title': 'Complete Home Wiring',
                'category': 'Electrical', 'description': 'Full home electrical rewiring with smart switch integration and safety compliance.',
                'cost_range_display': '₹80,000 - ₹1,50,000', 'cost_min': 80000, 'cost_max': 150000,
                'timeline': '15 days', 'materials_used': json.dumps(['Havells Wire', 'Legrand Switches', 'Anchor Panels']),
                'likes_count': 92, 'saves_count': 34,
                'images': ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600'],
            },
            {
                'company_id': company_objects[4].id, 'title': 'Bathroom Renovation',
                'category': 'Plumbing', 'description': 'Complete bathroom makeover with rain shower, wall-hung toilet, and heated flooring.',
                'cost_range_display': '₹2,00,000 - ₹3,50,000', 'cost_min': 200000, 'cost_max': 350000,
                'timeline': '25 days', 'materials_used': json.dumps(['Jaquar Fittings', 'Kajaria Tiles', 'Waterproofing Membrane']),
                'likes_count': 145, 'saves_count': 56,
                'images': ['https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600'],
            },
            {
                'company_id': company_objects[0].id, 'title': '3BHK Full Construction',
                'category': 'Construction', 'description': 'Complete 3BHK residential construction from foundation to finishing.',
                'cost_range_display': '₹25,00,000 - ₹40,00,000', 'cost_min': 2500000, 'cost_max': 4000000,
                'timeline': '8 months', 'materials_used': json.dumps(['UltraTech Cement', 'TATA Steel TMT', 'AAC Blocks']),
                'likes_count': 567, 'saves_count': 234, 'is_featured': True,
                'images': ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600'],
            },
        ]
        for fd in feed_data:
            images = fd.pop('images', [])
            fp = FeedProject(**fd)
            db.session.add(fp)
            db.session.flush()
            for i, url in enumerate(images):
                img = ProjectImage(project_id=fp.id, url=url, sort_order=i)
                db.session.add(img)

        db.session.flush()

        # ─── QUOTATION REQUESTS ──────────────────────────
        print("📋 Seeding quotation requests...")
        quotations = [
            QuotationRequest(
                request_code='QR001', user_id=users[0].id,
                title='2BHK Interior Design', description='Complete interior design for 2BHK apartment.',
                service_type='Interior', area_sqft=1200, num_rooms=5,
                budget_min=600000, budget_max=800000,
                budget_display='₹6,00,000 - ₹8,00,000',
                timeline='3 months', status='active', total_bids=3,
                material_preferences=json.dumps({'Wood': 'Teak', 'Tiles': 'Italian Marble'}),
            ),
            QuotationRequest(
                request_code='QR002', user_id=users[1].id,
                title='Kitchen Renovation', description='Complete kitchen renovation with modular design.',
                service_type='Renovation', area_sqft=150, num_rooms=1,
                budget_min=200000, budget_max=350000,
                budget_display='₹2,00,000 - ₹3,50,000',
                timeline='45 days', status='active', total_bids=2,
                material_preferences=json.dumps({'Cement': 'UltraTech'}),
            ),
            QuotationRequest(
                request_code='QR003', user_id=users[2].id,
                title='Complete Wiring', description='Rewiring for entire house with smart switches.',
                service_type='Electrical', area_sqft=1800, num_rooms=6,
                budget_min=100000, budget_max=150000,
                budget_display='₹1,00,000 - ₹1,50,000',
                timeline='15 days', status='closed', total_bids=3,
                material_preferences=json.dumps({'Wire': 'Havells', 'Switches': 'Legrand'}),
            ),
            QuotationRequest(
                request_code='QR004', user_id=users[3].id,
                title='Full Home Construction', description='New 4BHK villa construction with garden.',
                service_type='Construction', area_sqft=3000, num_rooms=10,
                budget_min=3000000, budget_max=5000000,
                budget_display='₹30,00,000 - ₹50,00,000',
                timeline='12 months', status='active', total_bids=4,
                green_mode=True,
            ),
            QuotationRequest(
                request_code='QR005', user_id=users[4].id,
                title='Custom Bedroom Furniture', description='Custom wardrobe, bed, and dressing table.',
                service_type='Furniture', area_sqft=300, num_rooms=1,
                budget_min=150000, budget_max=250000,
                budget_display='₹1,50,000 - ₹2,50,000',
                timeline='30 days', status='active', total_bids=2,
            ),
        ]
        db.session.add_all(quotations)
        db.session.flush()

        # ─── BIDS ────────────────────────────────────────
        print("💰 Seeding bids...")
        bids = [
            Bid(bid_code='B001', quotation_id=quotations[0].id, company_id=company_objects[0].id,
                total_price=720000, labor_cost=250000, material_cost=400000, overhead_cost=70000,
                timeline_days=75, timeline_display='75 days', warranty_months=24,
                warranty_terms='2 years comprehensive warranty', status='pending'),
            Bid(bid_code='B002', quotation_id=quotations[0].id, company_id=company_objects[1].id,
                total_price=680000, labor_cost=220000, material_cost=390000, overhead_cost=70000,
                timeline_days=90, timeline_display='90 days', warranty_months=36,
                warranty_terms='3 years comprehensive warranty', status='pending'),
            Bid(bid_code='B003', quotation_id=quotations[0].id, company_id=company_objects[2].id,
                total_price=750000, labor_cost=280000, material_cost=410000, overhead_cost=60000,
                timeline_days=60, timeline_display='60 days', warranty_months=60,
                warranty_terms='5 years comprehensive warranty', status='pending'),
            Bid(bid_code='B004', quotation_id=quotations[1].id, company_id=company_objects[0].id,
                total_price=280000, labor_cost=90000, material_cost=160000, overhead_cost=30000,
                timeline_days=40, timeline_display='40 days', warranty_months=24,
                warranty_terms='2 years warranty', status='pending'),
            Bid(bid_code='B005', quotation_id=quotations[1].id, company_id=company_objects[5].id,
                total_price=310000, labor_cost=100000, material_cost=175000, overhead_cost=35000,
                timeline_days=35, timeline_display='35 days', warranty_months=36,
                warranty_terms='3 years warranty with eco-materials', status='pending'),
            Bid(bid_code='B006', quotation_id=quotations[2].id, company_id=company_objects[3].id,
                total_price=125000, labor_cost=60000, material_cost=55000, overhead_cost=10000,
                timeline_days=12, timeline_display='12 days', warranty_months=24,
                warranty_terms='2 years warranty', status='accepted'),
        ]
        db.session.add_all(bids)
        db.session.flush()

        # ─── PROJECTS (Active & Completed) ───────────────
        print("🏗️  Seeding projects...")
        project1 = Project(
            project_code='P001', quotation_id=quotations[0].id, bid_id=bids[1].id,
            company_id=company_objects[1].id, user_id=users[0].id,
            title='2BHK Interior Design', description='Complete interior design project',
            total_cost=680000, status='in_progress', progress=65,
            start_date=date(2024, 2, 1), expected_end_date=date(2024, 4, 15),
            total_paid=340000, escrow_amount=170000, platform_commission=34000,
        )
        db.session.add(project1)
        db.session.flush()

        milestones1 = [
            Milestone(project_id=project1.id, name='Planning & Design', status='completed',
                      sort_order=0, expected_date=date(2024, 2, 10),
                      completed_date=date(2024, 2, 8), payment_amount=136000, payment_released=True),
            Milestone(project_id=project1.id, name='Material Procurement', status='completed',
                      sort_order=1, expected_date=date(2024, 2, 25),
                      completed_date=date(2024, 2, 23), payment_amount=204000, payment_released=True),
            Milestone(project_id=project1.id, name='Carpentry Work', status='in_progress',
                      sort_order=2, expected_date=date(2024, 3, 15), payment_amount=204000),
            Milestone(project_id=project1.id, name='Painting & Finishing', status='pending',
                      sort_order=3, expected_date=date(2024, 4, 1), payment_amount=102000),
            Milestone(project_id=project1.id, name='Final Inspection', status='pending',
                      sort_order=4, expected_date=date(2024, 4, 15), payment_amount=34000),
        ]
        db.session.add_all(milestones1)

        # Completed project
        project2 = Project(
            project_code='P002', quotation_id=quotations[2].id, bid_id=bids[5].id,
            company_id=company_objects[3].id, user_id=users[2].id,
            title='Home Wiring', description='Complete home electrical wiring',
            total_cost=125000, status='completed', progress=100,
            start_date=date(2023, 10, 1), expected_end_date=date(2023, 11, 15),
            actual_end_date=date(2023, 11, 12),
            total_paid=125000, platform_commission=6250,
        )
        db.session.add(project2)
        db.session.flush()

        # Warranty for completed project
        warranty = Warranty(
            project_id=project2.id, warranty_code='WR-P002-2023',
            start_date=date(2023, 11, 12), end_date=date(2025, 11, 12),
            terms='2 years comprehensive warranty covering all electrical work',
            coverage_details='Wiring, switches, panel boards, earthing',
            next_service_date=date(2024, 5, 12), service_interval_months=6,
        )
        db.session.add(warranty)

        # ─── PAYMENTS ────────────────────────────────────
        print("💳 Seeding payments...")
        payments = [
            Payment(payment_code='PAY001', project_id=project1.id,
                    payer_id=users[0].id, payee_company_id=company_objects[1].id,
                    milestone_id=milestones1[0].id,
                    amount=136000, commission=6800, net_amount=129200,
                    payment_type='milestone', status='completed',
                    payment_method='UPI', transaction_id='UPI202402080001'),
            Payment(payment_code='PAY002', project_id=project1.id,
                    payer_id=users[0].id, payee_company_id=company_objects[1].id,
                    milestone_id=milestones1[1].id,
                    amount=204000, commission=10200, net_amount=193800,
                    payment_type='milestone', status='completed',
                    payment_method='Bank Transfer', transaction_id='NEFT202402230002'),
            Payment(payment_code='PAY003', project_id=project1.id,
                    payer_id=users[0].id, payee_company_id=company_objects[1].id,
                    amount=170000, commission=8500, net_amount=161500,
                    payment_type='escrow', status='in_escrow',
                    payment_method='UPI'),
            Payment(payment_code='PAY004', project_id=project2.id,
                    payer_id=users[2].id, payee_company_id=company_objects[3].id,
                    amount=125000, commission=6250, net_amount=118750,
                    payment_type='final', status='completed',
                    payment_method='UPI', transaction_id='UPI202311120003'),
        ]
        db.session.add_all(payments)

        # ─── REVIEWS ────────────────────────────────────
        print("⭐ Seeding reviews...")
        reviews = [
            Review(user_id=users[0].id, company_id=company_objects[1].id,
                   project_id=project1.id, rating=4.9,
                   title='Outstanding work!', comment='Excellent interior design work. The team was professional and delivered beyond expectations.',
                   is_verified=True),
            Review(user_id=users[2].id, company_id=company_objects[3].id,
                   project_id=project2.id, rating=4.8,
                   title='Great electrical work', comment='Professional team, completed on time. Safety compliance was top-notch.',
                   is_verified=True),
            Review(user_id=users[1].id, company_id=company_objects[0].id,
                   rating=4.7, title='Good construction quality',
                   comment='Solid construction work. Minor delays but overall satisfied with the quality.'),
            Review(user_id=users[4].id, company_id=company_objects[2].id,
                   rating=4.5, title='Beautiful furniture',
                   comment='Custom furniture crafted beautifully. The teak wood quality was premium.'),
            Review(user_id=users[5].id, company_id=company_objects[5].id,
                   rating=5.0, title='Eco-friendly excellence',
                   comment='Amazing green construction approach. Carbon footprint was minimal. Highly recommend!'),
            Review(user_id=users[6].id, company_id=company_objects[1].id,
                   rating=4.8, title='Modern aesthetics',
                   comment='DesignHub transformed our space completely. Love the modern minimalist approach.'),
            Review(user_id=users[7].id, company_id=company_objects[4].id,
                   rating=4.3, title='Reliable plumbing service',
                   comment='Fixed all issues efficiently. 24/7 support is really helpful.'),
        ]
        db.session.add_all(reviews)

        # ─── MATERIALS ───────────────────────────────────
        print("📦 Seeding material prices...")
        materials_data = [
            ('UltraTech Cement (50kg)', 'UltraTech', 'Cement', 'bag', 380, 372, 2.1, [365, 370, 372, 375, 378, 380]),
            ('ACC Cement (50kg)', 'ACC', 'Cement', 'bag', 370, 372, -0.5, [360, 365, 372, 375, 373, 370]),
            ('Ambuja Cement (50kg)', 'Ambuja', 'Cement', 'bag', 375, 370, 1.2, [362, 365, 368, 370, 373, 375]),
            ('Birla Gold Cement (50kg)', 'Birla', 'Cement', 'bag', 365, 360, 1.4, [355, 358, 360, 362, 364, 365]),
            ('TATA Steel TMT 8mm (kg)', 'TATA', 'Steel', 'kg', 72, 69, 3.5, [65, 67, 68, 70, 71, 72]),
            ('JSW Steel TMT 10mm (kg)', 'JSW', 'Steel', 'kg', 70, 68, 2.8, [64, 65, 67, 68, 69, 70]),
            ('SAIL TMT 12mm (kg)', 'SAIL', 'Steel', 'kg', 68, 69, -1.2, [65, 67, 69, 70, 69, 68]),
            ('Vizag Steel TMT 16mm (kg)', 'Vizag', 'Steel', 'kg', 74, 72, 2.7, [68, 69, 71, 72, 73, 74]),
            ('Teak Wood (cu.ft)', 'Grade A', 'Wood', 'cu.ft', 3500, 3325, 5.2, [3200, 3250, 3300, 3400, 3450, 3500]),
            ('Sal Wood (cu.ft)', 'Grade A', 'Wood', 'cu.ft', 1800, 1768, 1.8, [1700, 1720, 1750, 1770, 1790, 1800]),
            ('Plywood BWR 18mm (sheet)', 'Century', 'Wood', 'sheet', 1450, 1462, -0.8, [1400, 1420, 1440, 1460, 1455, 1450]),
            ('MDF Board 18mm (sheet)', 'GreenPly', 'Wood', 'sheet', 1200, 1190, 0.8, [1150, 1170, 1180, 1190, 1195, 1200]),
            ('Havells Wire 1.5mm (90m)', 'Havells', 'Electrical', 'roll', 2200, 2167, 1.5, [2100, 2120, 2150, 2170, 2190, 2200]),
            ('Polycab Wire 2.5mm (90m)', 'Polycab', 'Electrical', 'roll', 3500, 3450, 1.4, [3350, 3380, 3400, 3430, 3470, 3500]),
            ('Legrand Switch (unit)', 'Legrand', 'Electrical', 'piece', 180, 180, 0, [175, 178, 180, 180, 180, 180]),
            ('Anchor Switch (unit)', 'Anchor', 'Electrical', 'piece', 120, 118, 1.7, [110, 112, 115, 118, 119, 120]),
            ('Jaquar Basin Mixer', 'Jaquar', 'Plumbing', 'piece', 4500, 4596, -2.1, [4800, 4700, 4650, 4600, 4550, 4500]),
            ('Hindware Basin (unit)', 'Hindware', 'Plumbing', 'piece', 3200, 3150, 1.6, [3050, 3080, 3100, 3150, 3180, 3200]),
            ('CPVC Pipe 1" (3m)', 'Astral', 'Plumbing', 'piece', 320, 310, 3.0, [295, 300, 305, 310, 315, 320]),
            ('Asian Paints Royale (L)', 'Asian Paints', 'Paint', 'liter', 420, 415, 1.2, [400, 405, 410, 415, 418, 420]),
            ('Berger Silk (L)', 'Berger', 'Paint', 'liter', 380, 375, 1.3, [365, 368, 372, 375, 378, 380]),
        ]
        for name, brand, cat, unit, price, prev, change, history in materials_data:
            mat = Material(
                name=name, brand=brand, category=cat, unit=unit,
                current_price=price, previous_price=prev,
                price_change_pct=change,
                is_eco_friendly=(brand in ['GreenPly', 'Asian Paints']),
                carbon_score=round(price * 0.001, 1),
            )
            db.session.add(mat)
            db.session.flush()

            # Add price history
            months_ago = [datetime.now(timezone.utc) - timedelta(days=30 * (6 - i)) for i in range(6)]
            for i, h_price in enumerate(history):
                ph = MaterialPriceHistory(
                    material_id=mat.id, price=h_price, recorded_at=months_ago[i])
                db.session.add(ph)

        # ─── CHAT ROOMS & MESSAGES ───────────────────────
        print("💬 Seeding chat data...")
        room1 = ChatRoom(user_id=users[0].id, company_id=company_objects[1].id,
                          quotation_id=quotations[0].id, project_id=project1.id)
        db.session.add(room1)
        db.session.flush()

        chat_messages = [
            ChatMessage(room_id=room1.id, sender_id=users[0].id,
                        message='Hi, I have a question about the cabinet wood quality.',
                        is_read=True),
            ChatMessage(room_id=room1.id, sender_id=company_objects[1].user_id,
                        message='Sure! We use premium Grade A teak wood for all cabinets. Would you like to see samples?',
                        is_read=True),
            ChatMessage(room_id=room1.id, sender_id=users[0].id,
                        message='Yes, that would be great. Can you share some photos?',
                        is_read=True),
            ChatMessage(room_id=room1.id, sender_id=company_objects[1].user_id,
                        message='I have uploaded some sample images. The carpentry work is progressing well!',
                        is_read=False),
        ]
        db.session.add_all(chat_messages)

        # ─── NOTIFICATIONS ──────────────────────────────
        print("🔔 Seeding notifications...")
        notifications = [
            Notification(user_id=users[0].id, title='New bid received',
                         message='BuildCraft India submitted a bid of ₹7,20,000',
                         notification_type='bid_received', reference_type='bid', reference_id=bids[0].id),
            Notification(user_id=users[0].id, title='Milestone completed',
                         message='Material Procurement phase is complete',
                         notification_type='project_update', reference_type='project', reference_id=project1.id),
            Notification(user_id=users[0].id, title='New message',
                         message='DesignHub Studios sent you a message',
                         notification_type='message', reference_type='chat'),
            Notification(user_id=company_objects[0].user_id, title='New quotation request',
                         message='2BHK Interior Design - ₹6L - ₹8L',
                         notification_type='new_quotation', reference_type='quotation',
                         reference_id=quotations[0].id),
        ]
        db.session.add_all(notifications)

        # ─── REPORTS ─────────────────────────────────────
        print("🚨 Seeding reports...")
        reports = [
            Report(reporter_id=users[0].id, report_type='fake_bid',
                   target_type='company', target_id=99,
                   description='Suspicious bid from unverified company',
                   severity='high', status='open'),
            Report(reporter_id=users[1].id, report_type='delayed_project',
                   target_type='company', target_id=company_objects[0].id,
                   description='Project delayed by 2 weeks without notification',
                   severity='medium', status='investigating'),
            Report(reporter_id=admin.id, report_type='fake_review',
                   target_type='review', target_id=1,
                   description='AI flagged this review as potentially fake',
                   severity='low', status='open'),
            Report(reporter_id=users[2].id, report_type='payment_dispute',
                   target_type='project', target_id=project2.id,
                   description='Discrepancy in final payment amount',
                   severity='high', status='open'),
        ]
        db.session.add_all(reports)

        # ─── PLATFORM STATS ─────────────────────────────
        print("📊 Seeding platform stats...")
        for i in range(180):
            d = date.today() - timedelta(days=180 - i)
            stat = PlatformStats(
                date=d,
                total_users=10000 + i * 15,
                total_companies=700 + i * 1,
                active_projects=1000 + (i % 30) * 10,
                completed_projects=i * 5,
                total_quotations=2000 + i * 8,
                total_bids=5000 + i * 20,
                total_revenue=3000000 + i * 8000,
                total_commission=150000 + i * 400,
                avg_quotation_value=380000 + (i % 50) * 1000,
                project_success_rate=93 + (i % 10) * 0.2,
                new_users_today=10 + (i % 20),
                new_companies_today=1 + (i % 5),
            )
            db.session.add(stat)

        db.session.commit()
        print("\n✅ Database seeded successfully!")
        print(f"📊 Summary:")
        print(f"   Users: {User.query.count()}")
        print(f"   Companies: {Company.query.count()}")
        print(f"   Services: {Service.query.count()}")
        print(f"   Feed Projects: {FeedProject.query.count()}")
        print(f"   Quotations: {QuotationRequest.query.count()}")
        print(f"   Bids: {Bid.query.count()}")
        print(f"   Projects: {Project.query.count()}")
        print(f"   Materials: {Material.query.count()}")
        print(f"   Reviews: {Review.query.count()}")
        print(f"   Payments: {Payment.query.count()}")
        print(f"   Reports: {Report.query.count()}")
        print(f"   Notifications: {Notification.query.count()}")
        print(f"\n🔑 Login Credentials:")
        print(f"   Admin:   admin@buildbid.com / admin123")
        print(f"   User:    rajesh@email.com / user123")
        print(f"   Company: buildcraft@email.com / company123")


if __name__ == '__main__':
    seed()
