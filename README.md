# WorkFlow Engine

A comprehensive workflow management system built with Java 17, Spring Boot, CockroachDB, and TypeScript React frontend.

## 🚀 Quick Start

Get up and running in 5 minutes:

```bash
# Clone the repository
git clone <repository-url>
cd WorkFlow

# Start all services with Docker Compose
docker-compose up -d

# Wait for services to be ready (2-3 minutes)
docker-compose logs -f workflow-backend

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080/api
# Database Admin: http://localhost:8080
```

## 📋 What You'll Get

- **Dashboard** - Workflow statistics and metrics
- **Workflow Designer** - Visual workflow creation tool
- **Definition Management** - CRUD operations for workflow templates
- **Instance Monitoring** - Real-time workflow execution tracking
- **Analytics** - Performance charts and reports

## 🛠️ Technology Stack

### Backend

- Java 17
- Spring Boot 3.2.0
- Spring Data JPA
- CockroachDB (PostgreSQL compatible)
- Flyway (Database migrations)

### Frontend

- React 18
- TypeScript 5.0
- Material-UI 5.14
- ReactFlow (Workflow visualization)
- Recharts (Analytics)

### Infrastructure

- Docker & Docker Compose
- Nginx (Frontend proxy)
- Multi-stage Docker builds

## 📚 Documentation

### Complete Documentation

For comprehensive documentation, visit our [Wiki](WorkFlow.wiki/):

- **[Home](WorkFlow.wiki/Home.md)** - Complete system overview
- **[Quickstart](WorkFlow.wiki/Quickstart.md)** - 5-minute setup guide
- **[Development](WorkFlow.wiki/Development.md)** - Development environment setup
- **[API Documentation](WorkFlow.wiki/API-Documentation.md)** - REST API reference
- **[Database Schema](WorkFlow.wiki/Database-Schema.md)** - Database structure
- **[Troubleshooting](WorkFlow.wiki/Troubleshooting.md)** - Common issues and solutions

### Persian Documentation (مستندات فارسی)

- **[فهرست مستندات فارسی](WorkFlow.wiki/فهرست-مستندات-فارسی.md)** - Persian documentation index
- **[صفحه اصلی](WorkFlow.wiki/صفحه-اصلی.md)** - مستندات کامل سیستم
- **[راهنمای شروع سریع](WorkFlow.wiki/راهنمای-شروع-سریع.md)** - راهنمای شروع در 5 دقیقه

## 🔧 Development

### Prerequisites

- Docker & Docker Compose
- Java 17 (for local development)
- Node.js 18+ (for frontend development)
- Maven 3.8+ (for backend development)

### Local Development Setup

#### Backend

```bash
# Start CockroachDB
docker run -d --name cockroachdb-dev -p 26257:26257 -p 8080:8080 \
  cockroachdb/cockroach:v23.1.0 start-single-node --insecure --http-addr=0.0.0.0:8080

# Run migrations
mvn flyway:migrate

# Start Spring Boot
mvn spring-boot:run
```

#### Frontend

```bash
cd frontend
npm install
npm start
```

## 📊 Sample Data

The system includes sample workflow definitions:

- **Employee Onboarding** (5 steps)
- **Purchase Approval** (4 steps with conditions)

## 🚀 Deployment

### Production with Docker Compose

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes

```bash
kubectl apply -f k8s/
```

## 🔍 API Endpoints

### Workflow Definitions

- `GET /api/workflow-definitions` - List all definitions
- `POST /api/workflow-definitions` - Create new definition
- `PUT /api/workflow-definitions/{id}` - Update definition
- `POST /api/workflow-definitions/{id}/activate` - Activate definition

### Workflow Instances

- `GET /api/workflow-instances` - List all instances
- `POST /api/workflow-instances/start/{definitionId}` - Start new instance
- `PUT /api/workflow-instances/{id}/status` - Update instance status
- `POST /api/workflow-instances/{id}/complete` - Complete instance

## 🐛 Troubleshooting

### Common Issues

**Services not starting:**

```bash
docker-compose ps
docker-compose logs -f
```

**Database connection issues:**

```bash
docker exec -it workflow-cockroachdb cockroach sql --insecure
```

**Frontend build issues:**

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

For detailed troubleshooting, see [Troubleshooting Guide](WorkFlow.wiki/Troubleshooting.md).

## 📈 Monitoring

- **Health Check:** http://localhost:8080/actuator/health
- **Metrics:** http://localhost:8080/actuator/metrics
- **API Docs:** http://localhost:8080/swagger-ui.html
- **Database Admin:** http://localhost:8080

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation:** [Wiki](WorkFlow.wiki/)
- **Issues:** [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions:** [GitHub Discussions](https://github.com/your-repo/discussions)

---

**Quick Links:**

- [Complete Documentation](WorkFlow.wiki/Home.md)
- [Quick Start Guide](WorkFlow.wiki/Quickstart.md)
- [API Reference](WorkFlow.wiki/API-Documentation.md)
- [Persian Documentation](WorkFlow.wiki/فهرست-مستندات-فارسی.md)
