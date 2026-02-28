# BuildBid Backend - Python Flask + SQLite

## Architecture

```
backend/
├── app.py              # Main Flask application with all API routes
├── config.py           # Configuration (dev/prod/test)
├── models.py           # SQLAlchemy ORM models (20+ tables)
├── schema.sql          # Raw SQL schema with triggers & views
├── seed_data.py        # Database seeder with comprehensive sample data
├── requirements.txt    # Python dependencies
├── buildbid.db         # SQLite database (auto-generated)
└── README.md           # This file
```

## Setup & Installation

```bash
# 1. Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# 2. Install dependencies
pip install -r requirements.txt

# 3. Seed the database
python seed_data.py

# 4. Run the server
python app.py
```

The server starts at `http://localhost:5000`

## Database Schema (20+ Tables)

### Core Tables
| Table | Description |
|-------|-------------|
| `users` | All users (customers, company owners, admins) |
| `companies` | Company profiles with verification fields |
| `services` | Service categories (Construction, Interior, etc.) |
| `company_services` | Many-to-many: companies ↔ services |
| `certifications` | Company certifications & licenses |

### Feed & Projects
| Table | Description |
|-------|-------------|
| `feed_projects` | Instagram-style project posts |
| `project_images` | Images for feed projects |
| `liked_projects` | User likes on projects |
| `saved_projects` | User saves on projects |

### Quotations & Bidding
| Table | Description |
|-------|-------------|
| `quotation_requests` | User quotation requests |
| `quotation_images` | Reference images for quotations |
| `bids` | Company bids with price breakdown |
| `projects` | Active/completed work projects |
| `milestones` | Project milestones with payments |

### Payments & Warranty
| Table | Description |
|-------|-------------|
| `payments` | Escrow, milestone, final payments |
| `warranties` | Digital warranty cards |

### Communication
| Table | Description |
|-------|-------------|
| `chat_rooms` | Chat rooms between users & companies |
| `chat_messages` | Individual chat messages |
| `notifications` | Push notifications |

### Admin & Analytics
| Table | Description |
|-------|-------------|
| `reviews` | User reviews for companies |
| `reports` | Moderation reports |
| `materials` | Material prices with tracking |
| `material_price_history` | Historical price data |
| `platform_stats` | Daily platform analytics |
| `ai_estimation_logs` | AI estimator usage logs |
| `subscription_plans` | Company subscription tiers |

## API Endpoints (60+)

### Authentication
```
POST /api/auth/register     - Register (user/company)
POST /api/auth/login        - Login
POST /api/auth/refresh      - Refresh token
GET  /api/auth/me           - Current user profile
```

### Users
```
PUT  /api/users/profile     - Update profile
GET  /api/users/dashboard   - User dashboard stats
```

### Companies
```
GET  /api/companies              - List companies (with filters)
GET  /api/companies/:id          - Company details
PUT  /api/companies/profile      - Update company profile
GET  /api/companies/dashboard    - Company dashboard stats
```

### Feed
```
GET  /api/feed              - Feed projects (filterable)
POST /api/feed              - Create feed post (company)
POST /api/feed/:id/like     - Like/unlike
POST /api/feed/:id/save     - Save/unsave
```

### Quotations
```
GET  /api/quotations        - List quotations
POST /api/quotations        - Create quotation request
GET  /api/quotations/:id    - Quotation details + bids
```

### Bids
```
POST /api/bids              - Submit bid
POST /api/bids/:id/accept   - Accept bid → creates project
POST /api/bids/:id/reject   - Reject bid
```

### Projects
```
GET  /api/projects           - List projects
GET  /api/projects/:id       - Project details
POST /api/projects/:id/milestone/:mid/complete - Complete milestone
```

### Materials
```
GET  /api/materials           - Material prices
GET  /api/materials/:id/history - Price history
GET  /api/materials/categories  - Categories
```

### AI Estimator
```
POST /api/ai-estimate         - Get AI cost estimate
```

### AI Designer (Gemini + Stable Diffusion)
```
POST /api/ai-designer/chat           - AI architecture chat (Gemini proxy)
POST /api/ai-designer/generate-image - Generate design image (HuggingFace SDXL proxy)
POST /api/ai-designer/suggest-prompt - Get AI design prompt suggestions
```

### Chat
```
GET  /api/chat/rooms          - List chat rooms
POST /api/chat/rooms          - Create/get room
GET  /api/chat/rooms/:id/messages - Get messages
POST /api/chat/rooms/:id/messages - Send message
```

### Reviews
```
POST /api/reviews              - Submit review
GET  /api/reviews/company/:id  - Company reviews
```

### Notifications
```
GET  /api/notifications        - Get notifications
POST /api/notifications/read   - Mark as read
```

### Admin
```
GET  /api/admin/stats           - Platform statistics
GET  /api/admin/users           - List all users
POST /api/admin/users/:id/toggle-status - Activate/suspend
POST /api/admin/companies/verify/:id    - Verify/reject company
GET  /api/admin/reports         - Moderation reports
POST /api/admin/reports/:id/resolve     - Resolve report
GET  /api/admin/projects        - All projects oversight
GET  /api/admin/analytics/growth        - Growth analytics
```

### Other
```
GET  /api/services              - Service categories
GET  /api/subscriptions/plans   - Subscription plans
GET  /api/health                - Health check
```

## Authentication
- JWT (JSON Web Tokens) with access + refresh tokens
- Role-based access control: `user`, `company`, `admin`
- Password hashing with bcrypt
- Token expiry: 24h access, 30d refresh

## Default Login Credentials
```
Admin:   admin@buildbid.com / admin123
User:    rajesh@email.com / user123
Company: buildcraft@email.com / company123
```

## Database Triggers
- Auto-update company rating on review insert
- Auto-update bid count on quotation
- Auto-update like/save counts on feed projects

## Database Views
- `v_company_leaderboard` - Company rankings
- `v_active_quotations` - Active quotations with bid counts
- `v_revenue_summary` - Monthly revenue breakdown
