# WorkFlow Engine - Complete Documentation

## Overview

WorkFlow Engine is a comprehensive workflow management system built with Java 17, Spring Boot, CockroachDB, and TypeScript React frontend. It provides a complete solution for designing, executing, and monitoring business processes.

## Table of Contents

1. [Architecture](#architecture)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [API Documentation](#api-documentation)
6. [Frontend Guide](#frontend-guide)
7. [Database Schema](#database-schema)
8. [Development](#development)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

## Architecture

### System Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │  Spring Boot    │    │  CockroachDB    │
│   (TypeScript)  │◄──►│   Backend       │◄──►│   Database      │
│   Port: 3000    │    │   Port: 8080     │    │   Port: 26257   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

**Backend:**
- Java 17
- Spring Boot 3.2.0
- Spring Data JPA
- Spring Web
- Flyway (Database Migration)
- CockroachDB (PostgreSQL compatible)

**Frontend:**
- React 18
- TypeScript 5.0
- Material-UI 5.14
- ReactFlow (Workflow Visualization)
- Recharts (Analytics)
- Axios (HTTP Client)

**Infrastructure:**
- Docker & Docker Compose
- Nginx (Frontend Proxy)
- Multi-stage Docker builds

## Prerequisites

### Required Software

1. **Docker & Docker Compose**
   ```bash
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   
   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

2. **Java 17** (for local development)
   ```bash
   # Install OpenJDK 17
   sudo apt update
   sudo apt install openjdk-17-jdk
   ```

3. **Node.js 18+** (for frontend development)
   ```bash
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **Maven 3.8+** (for backend development)
   ```bash
   # Install Maven
   sudo apt install maven
   ```

## Installation

### Quick Start with Docker Compose

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd WorkFlow
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Verify installation**
   ```bash
   # Check service status
   docker-compose ps
   
   # Check logs
   docker-compose logs -f workflow-backend
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080/api
   - CockroachDB Admin UI: http://localhost:8080
   - Database: localhost:26257

### Manual Installation

#### Backend Setup

1. **Navigate to project root**
   ```bash
   cd /home/soroush/java/WorkFlow
   ```

2. **Start CockroachDB**
   ```bash
   docker run -d \
     --name cockroachdb \
     -p 26257:26257 \
     -p 8080:8080 \
     cockroachdb/cockroach:v23.1.0 \
     start-single-node --insecure --http-addr=0.0.0.0:8080
   ```

3. **Run database migrations**
   ```bash
   mvn flyway:migrate
   ```

4. **Start Spring Boot application**
   ```bash
   mvn spring-boot:run
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

## Configuration

### Environment Variables

#### Backend Configuration (`application.yml`)

```yaml
# Database Configuration
spring:
  datasource:
    url: jdbc:postgresql://localhost:26257/workflow_db?sslmode=disable
    username: root
    password: ""
    
# Flyway Configuration
  flyway:
    enabled: true
    locations: classpath:db/migration
    
# CORS Configuration
  web:
    cors:
      allowed-origins: http://localhost:3000
```

#### Frontend Configuration

Create `.env` file in frontend directory:
```env
REACT_APP_API_URL=http://localhost:8080/api
```

### Docker Configuration

#### Backend Dockerfile
- Multi-stage build for optimized image size
- Health checks for container monitoring
- Non-root user for security

#### Frontend Dockerfile
- Nginx-based production build
- Static asset optimization
- API proxy configuration

## API Documentation

### Base URL
```
http://localhost:8080/api
```

### Workflow Definitions

#### Get All Definitions
```http
GET /workflow-definitions?page=0&size=20
```

#### Get Definition by ID
```http
GET /workflow-definitions/{id}
```

#### Create Definition
```http
POST /workflow-definitions
Content-Type: application/json

{
  "name": "Employee Onboarding",
  "description": "Complete employee onboarding process",
  "status": "DRAFT",
  "definition": "{\"steps\": []}"
}
```

#### Update Definition
```http
PUT /workflow-definitions/{id}
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated description"
}
```

#### Activate Definition
```http
POST /workflow-definitions/{id}/activate
```

### Workflow Instances

#### Get All Instances
```http
GET /workflow-instances?page=0&size=20
```

#### Start Instance
```http
POST /workflow-instances/start/{workflowDefinitionId}?instanceName=My Instance
Content-Type: application/json

{
  "employeeId": "123",
  "department": "Engineering"
}
```

#### Update Instance Status
```http
PUT /workflow-instances/{id}/status?status=COMPLETED
```

#### Complete Instance
```http
POST /workflow-instances/{id}/complete
```

## Frontend Guide

### Application Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   └── Navbar.tsx
│   ├── pages/               # Page components
│   │   ├── Dashboard.tsx
│   │   ├── WorkflowDefinitions.tsx
│   │   ├── WorkflowInstances.tsx
│   │   ├── WorkflowDesigner.tsx
│   │   └── WorkflowAnalytics.tsx
│   ├── services/            # API services
│   │   └── api.ts
│   ├── App.tsx              # Main app component
│   └── index.tsx            # Entry point
├── package.json
└── Dockerfile
```

### Key Features

1. **Dashboard**
   - Workflow statistics
   - Recent activity
   - Performance charts

2. **Workflow Designer**
   - Visual workflow creation
   - Drag-and-drop interface
   - Node configuration

3. **Definition Management**
   - CRUD operations
   - Version control
   - Status management

4. **Instance Monitoring**
   - Real-time status tracking
   - Execution history
   - Performance metrics

### Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

## Database Schema

### Core Tables

#### workflow_definitions
- `id` (UUID, Primary Key)
- `name` (VARCHAR, Unique with version)
- `description` (TEXT)
- `version` (INTEGER)
- `status` (ENUM: DRAFT, ACTIVE, INACTIVE, ARCHIVED)
- `definition` (JSONB)
- `created_at`, `updated_at` (TIMESTAMP)
- `created_by`, `updated_by` (VARCHAR)

#### workflow_instances
- `id` (UUID, Primary Key)
- `workflow_definition_id` (UUID, Foreign Key)
- `name` (VARCHAR)
- `status` (ENUM: RUNNING, COMPLETED, FAILED, SUSPENDED, CANCELLED)
- `current_step` (VARCHAR)
- `context` (JSONB)
- `started_at`, `completed_at` (TIMESTAMP)

#### workflow_steps
- `id` (UUID, Primary Key)
- `workflow_definition_id` (UUID, Foreign Key)
- `step_name` (VARCHAR)
- `step_type` (ENUM: HUMAN_TASK, AUTOMATED, GATEWAY, TIMER, SCRIPT, SERVICE_CALL)
- `step_order` (INTEGER)
- `configuration` (JSONB)
- `next_steps` (JSONB)
- `conditions` (JSONB)

#### workflow_executions
- `id` (UUID, Primary Key)
- `workflow_instance_id` (UUID, Foreign Key)
- `step_name` (VARCHAR)
- `status` (ENUM: PENDING, RUNNING, COMPLETED, FAILED, SKIPPED, CANCELLED)
- `input_data`, `output_data` (JSONB)
- `error_message` (TEXT)
- `started_at`, `completed_at` (TIMESTAMP)

#### workflow_assignments
- `id` (UUID, Primary Key)
- `workflow_execution_id` (UUID, Foreign Key)
- `assignee` (VARCHAR)
- `assigned_at`, `completed_at` (TIMESTAMP)
- `status` (ENUM: ASSIGNED, IN_PROGRESS, COMPLETED, REJECTED, DELEGATED)
- `comments` (TEXT)

### Sample Data

The system includes sample workflow definitions:
- Employee Onboarding (5 steps)
- Purchase Approval (4 steps with conditions)

## Development

### Backend Development

#### Project Structure
```
src/main/java/com/workflow/
├── WorkflowApplication.java          # Main application class
├── controller/                       # REST controllers
│   ├── WorkflowDefinitionController.java
│   └── WorkflowInstanceController.java
├── domain/                          # JPA entities
│   ├── WorkflowDefinition.java
│   ├── WorkflowInstance.java
│   ├── WorkflowStep.java
│   ├── WorkflowExecution.java
│   └── WorkflowAssignment.java
├── repository/                      # Data repositories
│   ├── WorkflowDefinitionRepository.java
│   └── WorkflowInstanceRepository.java
└── service/                         # Business logic
    ├── WorkflowDefinitionService.java
    └── WorkflowInstanceService.java
```

#### Adding New Features

1. **Create Entity**
   ```java
   @Entity
   @Table(name = "new_table")
   public class NewEntity {
       // Entity fields
   }
   ```

2. **Create Repository**
   ```java
   @Repository
   public interface NewEntityRepository extends JpaRepository<NewEntity, UUID> {
       // Custom queries
   }
   ```

3. **Create Service**
   ```java
   @Service
   public class NewEntityService {
       // Business logic
   }
   ```

4. **Create Controller**
   ```java
   @RestController
   @RequestMapping("/api/new-entities")
   public class NewEntityController {
       // REST endpoints
   }
   ```

5. **Create Migration**
   ```sql
   -- V3__Create_new_table.sql
   CREATE TABLE new_table (
       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       -- other columns
   );
   ```

### Frontend Development

#### Adding New Pages

1. **Create Page Component**
   ```typescript
   const NewPage: React.FC = () => {
     return (
       <Box>
         <Typography variant="h4">New Page</Typography>
       </Box>
     );
   };
   ```

2. **Add Route**
   ```typescript
   <Route path="/new-page" element={<NewPage />} />
   ```

3. **Add Navigation**
   ```typescript
   // In Navbar.tsx
   { label: 'New Page', path: '/new-page', icon: <NewIcon /> }
   ```

#### API Integration

```typescript
// Add to api.ts
export const newApi = {
  getNewItems: () => api.get('/new-items'),
  createNewItem: (data: any) => api.post('/new-items', data),
};
```

## Deployment

### Production Deployment

#### Docker Compose Production

1. **Create production compose file**
   ```yaml
   # docker-compose.prod.yml
   version: '3.8'
   services:
     workflow-backend:
       image: workflow-backend:latest
       environment:
         - SPRING_PROFILES_ACTIVE=prod
         - SPRING_DATASOURCE_URL=jdbc:postgresql://cockroachdb:26257/workflow_db
     workflow-frontend:
       image: workflow-frontend:latest
   ```

2. **Deploy**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

#### Kubernetes Deployment

1. **Create Kubernetes manifests**
   ```yaml
   # k8s/deployment.yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: workflow-backend
   spec:
     replicas: 3
     selector:
       matchLabels:
         app: workflow-backend
     template:
       metadata:
         labels:
           app: workflow-backend
       spec:
         containers:
         - name: workflow-backend
           image: workflow-backend:latest
           ports:
           - containerPort: 8080
   ```

2. **Deploy to Kubernetes**
   ```bash
   kubectl apply -f k8s/
   ```

### Environment-Specific Configuration

#### Development
```yaml
spring:
  profiles: dev
  datasource:
    url: jdbc:postgresql://localhost:26257/workflow_db
```

#### Production
```yaml
spring:
  profiles: prod
  datasource:
    url: jdbc:postgresql://prod-cockroachdb:26257/workflow_db
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Issues

**Problem:** Cannot connect to CockroachDB
```bash
Error: Connection refused
```

**Solution:**
```bash
# Check if CockroachDB is running
docker ps | grep cockroachdb

# Check logs
docker logs workflow-cockroachdb

# Restart database
docker-compose restart cockroachdb
```

#### 2. Frontend Build Issues

**Problem:** Frontend build fails
```bash
npm ERR! peer dep missing
```

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be 18+
```

#### 3. Backend Startup Issues

**Problem:** Spring Boot fails to start
```bash
Caused by: java.sql.SQLException: Connection refused
```

**Solution:**
```bash
# Check database connectivity
docker exec -it workflow-cockroachdb cockroach sql --insecure

# Check application logs
docker logs workflow-backend

# Verify database exists
docker exec -it workflow-cockroachdb cockroach sql --insecure -e "SHOW DATABASES;"
```

#### 4. CORS Issues

**Problem:** Frontend cannot access backend API
```bash
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
```yaml
# In application.yml
spring:
  web:
    cors:
      allowed-origins: http://localhost:3000
      allowed-methods: GET,POST,PUT,DELETE,OPTIONS
      allowed-headers: "*"
```

### Performance Optimization

#### Database Optimization

1. **Add Indexes**
   ```sql
   CREATE INDEX idx_workflow_instances_status ON workflow_instances(status);
   CREATE INDEX idx_workflow_executions_instance ON workflow_executions(workflow_instance_id);
   ```

2. **Connection Pooling**
   ```yaml
   spring:
     datasource:
       hikari:
         maximum-pool-size: 20
         minimum-idle: 5
   ```

#### Frontend Optimization

1. **Code Splitting**
   ```typescript
   const LazyComponent = React.lazy(() => import('./LazyComponent'));
   ```

2. **Bundle Analysis**
   ```bash
   npm install -g webpack-bundle-analyzer
   npm run build
   webpack-bundle-analyzer build/static/js/*.js
   ```

### Monitoring and Logging

#### Application Monitoring

1. **Health Checks**
   ```bash
   curl http://localhost:8080/actuator/health
   ```

2. **Metrics**
   ```bash
   curl http://localhost:8080/actuator/metrics
   ```

#### Logging Configuration

```yaml
logging:
  level:
    com.workflow: DEBUG
    org.springframework.web: DEBUG
    org.hibernate.SQL: DEBUG
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} - %msg%n"
    file: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"
```

## Support

For additional support and documentation:

1. **API Documentation:** http://localhost:8080/swagger-ui.html
2. **Database Admin:** http://localhost:8080 (CockroachDB UI)
3. **Application Health:** http://localhost:8080/actuator/health

## License

This project is licensed under the MIT License - see the LICENSE file for details.
