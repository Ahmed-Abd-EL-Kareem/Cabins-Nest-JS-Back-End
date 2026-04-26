<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<h1 align="center">Cabins Booking API</h1>

<p align="center">
  A production-ready GraphQL backend for a cabin booking platform — built with NestJS, TypeORM, and PostgreSQL.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-11-red?logo=nestjs" alt="NestJS" />
  <img src="https://img.shields.io/badge/GraphQL-Apollo-blue?logo=graphql" alt="GraphQL" />
  <img src="https://img.shields.io/badge/TypeORM-0.3-orange" alt="TypeORM" />
  <img src="https://img.shields.io/badge/PostgreSQL-ready-blue?logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Deploy-Railway-purple" alt="Railway" />
</p>

---

## About

This is the backend API for a full-stack cabin booking application. It powers both the customer-facing booking website and the admin dashboard. The API is built entirely on GraphQL, handling everything from authentication and cabin management to bookings and application settings.

### Key Features

- **GraphQL API** — single endpoint, type-safe, auto-generated schema
- **JWT Authentication** — access + refresh token pattern with automatic rotation
- **Google OAuth 2.0** — sign in with Google using token-based strategy
- **Role-based access control** — `CUSTOMER` and `ADMIN` roles with guard decorators
- **Cabin management** — full CRUD for cabin listings
- **Booking lifecycle** — create, update, check-in, check-out, delete bookings
- **Password reset flow** — email-based token reset with 1-hour expiry
- **Application settings** — configurable booking constraints (min/max nights, guests, breakfast price)
- **Input validation** — class-validator on all DTOs with whitelist mode

---

## Tech Stack

| Layer      | Technology                                              |
| ---------- | ------------------------------------------------------- |
| Framework  | NestJS 11                                               |
| API        | GraphQL (Apollo Server 5, code-first)                   |
| ORM        | TypeORM 0.3                                             |
| Database   | PostgreSQL (Neon / Railway)                             |
| Auth       | Passport.js — Local, JWT, JWT-Refresh, Google OAuth 2.0 |
| Hashing    | bcrypt                                                  |
| Email      | Nodemailer (SMTP / SendGrid)                            |
| Validation | class-validator + class-transformer                     |
| Language   | TypeScript                                              |

---

## Project Structure

```
src/
├── app.module.ts              # Root module — global guards, GraphQL config, TypeORM
├── main.ts                    # Bootstrap — ValidationPipe, port
│
├── auth/                      # Authentication domain
│   ├── config/                # JWT, Google OAuth, Mail config namespaces
│   ├── dtos/                  # LoginDto, ResetPasswordDto, ForgotPasswordDto, etc.
│   ├── guards/                # GqlJwtAuthGuard, GqlAuthGuard, GqlJwtRefreshGuard
│   ├── interfaces/            # JwtPayload, AuthenticatedUser
│   └── provider/              # AuthService, LocalStrategy, JwtStrategy, GoogleStrategy, MailService
│
├── users/                     # User domain
│   ├── dtos/                  # UserDto
│   ├── enums/                 # UserRole (CUSTOMER | ADMIN)
│   ├── provider/              # UsersService
│   ├── users.entity.ts        # User TypeORM entity
│   └── users.resolver.ts      # GraphQL resolver
│
├── cabins/                    # Cabin domain
│   ├── dtos/                  # CabinDto, CabinUpdateDto
│   ├── provider/              # CabinsService
│   ├── cabins.entity.ts       # Cabin TypeORM entity
│   └── cabins.resolver.ts     # GraphQL resolver
│
├── bookings/                  # Booking domain
│   ├── dtos/                  # BookingDto, BookingUpdateDto
│   ├── enums/                 # BookingStatus (UNCONFIRMED | CHECKED_IN | CHECKED_OUT)
│   ├── provider/              # BookingsService
│   ├── bookings.entity.ts     # Booking TypeORM entity
│   └── bookings.resolver.ts   # GraphQL resolver
│
├── settings/                  # App settings domain
│   ├── dtos/                  # SettingsDto
│   ├── provider/              # SettingsService
│   ├── settings.entity.ts     # Settings TypeORM entity
│   └── settings.resolver.ts   # GraphQL resolver
│
├── common/                    # Shared utilities
│   ├── decorators/            # @CurrentUser(), @Roles()
│   ├── guards/                # RolesGuard
│   └── public.ts              # @Public() decorator
│
├── config/                    # Database & app config namespaces
└── schema.gql                 # Auto-generated GraphQL schema (do not edit)
```

---

## Getting Started

### Prerequisites

- Node.js >= 20
- PostgreSQL database (local or [Neon](https://neon.tech) / [Railway](https://railway.app))
- SMTP credentials for email (Mailtrap for dev)

### Installation

```bash
npm install
```

### Environment Variables

Create `.development.env` in the project root:

```env
# App
NODE_ENV=development

# Database
NEON_DATABASE=postgresql://user:password@host/dbname
DATABASE_SYNC=true
DATABASE_AUTOLOAD=true

# JWT
JWT_SECRET=your_secret_key_minimum_32_characters
JWT_REFRESH_SECRET=your_refresh_secret_key_minimum_32_characters
JWT_TOKEN_AUDIENCE=cabins-app
JWT_TOKEN_ISSUER=cabins-app
JWT_ACCESS_TOKEN_TTL=3600
JWT_REFRESH_TOKEN_TTL=86400

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# Mail (use Mailtrap for development)
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=587
MAIL_USER=your_mailtrap_user
MAIL_PASSWORD=your_mailtrap_password
MAIL_FROM=noreply@cabins.dev
FRONTEND_URL=http://localhost:5173
```

### Running the App

```bash
# Development (watch mode)
npm run start:dev

# Production
npm run build
npm run start:prod
```

GraphQL Playground available at: `http://localhost:3000/graphql`

---

## API Overview

The full GraphQL schema is at `src/schema.gql`. Key operations:

### Public (no auth required)

| Operation        | Type     | Description                  |
| ---------------- | -------- | ---------------------------- |
| `getAllCabins`   | Query    | List all cabin listings      |
| `getCabinById`   | Query    | Get a single cabin           |
| `getSettings`    | Query    | Get booking constraints      |
| `login`          | Mutation | Email + password login       |
| `googleLogin`    | Mutation | Google OAuth login           |
| `refreshToken`   | Mutation | Refresh JWT access token     |
| `forgotPassword` | Mutation | Trigger password reset email |
| `resetPassword`  | Mutation | Reset password via token     |
| `createUser`     | Mutation | Register a new customer      |

### Authenticated (any logged-in user)

| Operation       | Type     | Description                 |
| --------------- | -------- | --------------------------- |
| `getMyBookings` | Query    | Get current user's bookings |
| `createBooking` | Mutation | Create a new booking        |

### Admin only

| Operation         | Type     | Description                   |
| ----------------- | -------- | ----------------------------- |
| `getAllBookings`  | Query    | All bookings in the system    |
| `getBookingById`  | Query    | Any booking by ID             |
| `getAllCustomers` | Query    | All customer accounts         |
| `updateBooking`   | Mutation | Update booking status/details |
| `deleteBooking`   | Mutation | Remove a booking              |
| `createCabin`     | Mutation | Add a new cabin               |
| `updateCabin`     | Mutation | Edit cabin details            |
| `deleteCabin`     | Mutation | Remove a cabin                |
| `createSettings`  | Mutation | Initialize app settings       |
| `updateSettings`  | Mutation | Update app settings           |
| `createAdminUser` | Mutation | Create an admin account       |

---

## Deployment (Railway)

1. Push to GitHub and connect repository to [Railway](https://railway.app)
2. Add a **PostgreSQL** plugin in Railway
3. Set all environment variables in Railway → Variables (see `.development.env` above, adapted for production)
4. Set `DATABASE_SYNC=false` in production — use migrations instead
5. Railway will auto-detect NestJS and run `npm run build` → `npm run start:prod`

Key production env adjustments:

```env
NODE_ENV=production
DATABASE_SYNC=false
NEON_DATABASE=<Railway Postgres URL or Neon URL>
FRONTEND_URL=https://your-frontend-domain.com
GOOGLE_CALLBACK_URL=https://your-railway-domain.up.railway.app/auth/google/callback
```

---

## Entity Relationships

```
User ─────────────────────── Booking (OneToMany)
Cabin ────────────────────── Booking (OneToMany)
Booking ──── cabin (ManyToOne, eager)
Booking ──── guest (ManyToOne, eager)
```

---

## Booking Lifecycle

```
UNCONFIRMED → (check-in) → CHECKED_IN → (check-out) → CHECKED_OUT
```

Status transitions are managed via `updateBooking` mutation with the `status` field.

---

## Running Tests

```bash
# Unit tests
npm run test

# Test coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

---

## License

UNLICENSED — private project.
