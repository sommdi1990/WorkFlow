# WorkFlow Engine - Development Setup Guide

## 🛠️ Development Environment Setup

### Prerequisites
- Java 17 JDK
- Node.js 18+
- Maven 3.8+
- Docker & Docker Compose

### Backend Development

#### 1. Database Setup
```bash
# Start CockroachDB
docker run -d \
  --name cockroachdb-dev \
  -p 26257:26257 \
  -p 8080:8080 \
  cockroachdb/cockroach:v23.1.0 \
  start-single-node --insecure --http-addr=0.0.0.0:8080

# Wait for database to be ready
sleep 10

# Create database
docker exec -it cockroachdb-dev cockroach sql --insecure -e "CREATE DATABASE IF NOT EXISTS workflow_db;"
```

#### 2. Run Migrations
```bash
# Navigate to project root
cd /home/soroush/java/WorkFlow

# Run Flyway migrations
mvn flyway:migrate
```

#### 3. Start Backend
```bash
# Run Spring Boot application
mvn spring-boot:run

# Or build and run JAR
mvn clean package
java -jar target/workflow-engine-*.jar
```

### Frontend Development

#### 1. Install Dependencies
```bash
cd frontend
npm install
```

#### 2. Start Development Server
```bash
npm start
```

#### 3. Access Application
- Frontend: http://localhost:3000
- Backend: http://localhost:8080/api
- Database Admin: http://localhost:8080

### Testing

#### Backend Tests
```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=WorkflowDefinitionServiceTest

# Run with coverage
mvn test jacoco:report
```

#### Frontend Tests
```bash
cd frontend

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

### Code Quality

#### Backend
```bash
# Check code style
mvn checkstyle:check

# Run SpotBugs
mvn spotbugs:check

# Format code
mvn spring-javaformat:apply
```

#### Frontend
```bash
cd frontend

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Type check
npm run type-check
```

### Database Management

#### Connect to Database
```bash
# Using Docker
docker exec -it cockroachdb-dev cockroach sql --insecure

# Using psql (if installed)
psql "postgresql://root@localhost:26257/workflow_db?sslmode=disable"
```

#### Common Database Commands
```sql
-- Show databases
SHOW DATABASES;

-- Use workflow database
USE workflow_db;

-- Show tables
SHOW TABLES;

-- Show workflow definitions
SELECT * FROM workflow_definitions;

-- Show workflow instances
SELECT * FROM workflow_instances;
```

#### Reset Database
```bash
# Stop and remove database container
docker stop cockroachdb-dev
docker rm cockroachdb-dev

# Remove data volume
docker volume rm $(docker volume ls -q | grep cockroach)

# Restart database
docker run -d \
  --name cockroachdb-dev \
  -p 26257:26257 \
  -p 8080:8080 \
  cockroachdb/cockroach:v23.1.0 \
  start-single-node --insecure --http-addr=0.0.0.0:8080
```

### IDE Setup

#### IntelliJ IDEA
1. Import as Maven project
2. Configure Java 17 SDK
3. Install plugins:
   - Lombok
   - Spring Boot
   - Database Tools

#### VS Code
1. Install extensions:
   - Extension Pack for Java
   - Spring Boot Extension Pack
   - TypeScript and JavaScript Language Features
   - ES7+ React/Redux/React-Native snippets

### Debugging

#### Backend Debugging
```bash
# Run with debug port
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"

# Connect debugger to localhost:5005
```

#### Frontend Debugging
```bash
cd frontend

# Start with debug mode
npm start

# Use browser dev tools or VS Code debugger
```

### Performance Profiling

#### Backend Profiling
```bash
# Run with JProfiler
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-agentpath:/path/to/jprofiler/bin/linux-x64/libjprofilerti.so=port=8849"

# Run with VisualVM
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Dcom.sun.management.jmxremote -Dcom.sun.management.jmxremote.port=9999 -Dcom.sun.management.jmxremote.authenticate=false -Dcom.sun.management.jmxremote.ssl=false"
```

### Hot Reload

#### Backend Hot Reload
```bash
# Add spring-boot-devtools dependency to pom.xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
    <optional>true</optional>
</dependency>

# Run with devtools
mvn spring-boot:run
```

#### Frontend Hot Reload
```bash
cd frontend

# Start with hot reload (default)
npm start
```

### Environment Variables

#### Backend Environment
```bash
export SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:26257/workflow_db?sslmode=disable"
export SPRING_DATASOURCE_USERNAME="root"
export SPRING_DATASOURCE_PASSWORD=""
export SPRING_PROFILES_ACTIVE="dev"
```

#### Frontend Environment
```bash
cd frontend

# Create .env file
echo "REACT_APP_API_URL=http://localhost:8080/api" > .env
echo "REACT_APP_ENVIRONMENT=development" >> .env
```

### Common Development Tasks

#### Add New Entity
1. Create entity class in `src/main/java/com/workflow/domain/`
2. Create repository interface in `src/main/java/com/workflow/repository/`
3. Create service class in `src/main/java/com/workflow/service/`
4. Create controller in `src/main/java/com/workflow/controller/`
5. Create Flyway migration in `src/main/resources/db/migration/`

#### Add New Frontend Page
1. Create page component in `frontend/src/pages/`
2. Add route in `frontend/src/App.tsx`
3. Add navigation item in `frontend/src/components/Navbar.tsx`
4. Add API methods in `frontend/src/services/api.ts`

#### Database Schema Changes
1. Create new Flyway migration file: `V{version}__{description}.sql`
2. Test migration: `mvn flyway:migrate`
3. Update entity classes if needed
4. Test with sample data

### Troubleshooting Development Issues

#### Backend Won't Start
```bash
# Check Java version
java -version

# Check Maven version
mvn -version

# Check database connectivity
docker exec -it cockroachdb-dev cockroach sql --insecure -e "SELECT 1;"

# Check port availability
netstat -tulpn | grep :8080
```

#### Frontend Won't Start
```bash
cd frontend

# Check Node.js version
node --version

# Check npm version
npm --version

# Clear cache
rm -rf node_modules package-lock.json
npm install

# Check port availability
netstat -tulpn | grep :3000
```

#### Database Connection Issues
```bash
# Check CockroachDB status
docker ps | grep cockroachdb

# Check database logs
docker logs cockroachdb-dev

# Test connection
docker exec -it cockroachdb-dev cockroach sql --insecure -e "SHOW DATABASES;"
```

### Useful Development Commands

```bash
# Backend
mvn clean compile                    # Clean and compile
mvn spring-boot:run                  # Run application
mvn test                            # Run tests
mvn flyway:migrate                  # Run database migrations
mvn flyway:info                     # Show migration info

# Frontend
npm start                           # Start dev server
npm run build                       # Build for production
npm test                            # Run tests
npm run lint                        # Lint code
npm run type-check                  # Type check

# Docker
docker-compose up -d                # Start all services
docker-compose down                 # Stop all services
docker-compose logs -f              # Follow logs
docker-compose restart              # Restart services
```
