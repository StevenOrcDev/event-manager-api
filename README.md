# Event Manager API

A modern event management API built with TypeScript, Node.js, and full DevOps pipeline.

## 🚀 Tech Stack

- **Backend**: Node.js, TypeScript, Express
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis
- **DevOps**: Docker, GitHub Actions, Terraform
- **Deployment**: Digital Ocean, Azure

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Git

### Local Development

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/event-manager-api.git
cd event-manager-api

# Install dependencies
npm install

# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Run database migrations
docker exec -it $(docker ps -q -f name=api) npx prisma migrate dev

# API will be available at http://localhost:3000
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint
```

## 📁 Project Structure

```
event-manager-api/
├── src/
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── repositories/    # Data access layer
│   ├── models/          # Data models
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   └── utils/           # Utilities
├── tests/               # Test files
├── docker/              # Docker configurations
├── prisma/              # Database schema and migrations
└── docs/                # Documentation
```

## 🐳 Docker

```bash
# Development
docker-compose -f docker-compose.dev.yml up

# Production
docker-compose -f docker-compose.prod.yml up
```

## 🔧 Environment Variables

```bash
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/event_manager_dev
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
```

## 📚 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Events

- `GET /api/events` - List events
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Users

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## 🚀 Deployment

This project includes automated CI/CD pipelines for:

- ✅ Linting and testing
- ✅ Docker image building
- ✅ Multi-environment deployment (staging, production)
- ✅ Infrastructure as Code with Terraform

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
