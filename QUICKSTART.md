# WorkFlow Engine - Quick Start Guide

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Docker and Docker Compose installed
- Ports 3000, 8080, and 26257 available

### Step 1: Start the Application
```bash
# Clone and navigate to project
cd /home/soroush/java/WorkFlow

# Start all services
docker-compose up -d

# Wait for services to be ready (about 2-3 minutes)
docker-compose logs -f workflow-backend
```

### Step 2: Verify Installation
```bash
# Check all services are running
docker-compose ps

# Test backend API
curl http://localhost:8080/api/workflow-definitions

# Test frontend
open http://localhost:3000
```

### Step 3: Access the Application
- **Frontend Dashboard:** http://localhost:3000
- **Backend API:** http://localhost:8080/api
- **Database Admin:** http://localhost:8080 (CockroachDB UI)

## 📋 What You'll See

### Dashboard
- Workflow statistics and metrics
- Recent workflow instances
- Performance charts

### Workflow Designer
- Visual workflow creation tool
- Drag-and-drop interface
- Sample workflows included

### Definitions Management
- Create, edit, and manage workflow definitions
- Version control and status management
- Sample workflows: Employee Onboarding, Purchase Approval

## 🔧 Troubleshooting

### Services Not Starting
```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs workflow-backend
docker-compose logs workflow-frontend
docker-compose logs cockroachdb

# Restart services
docker-compose restart
```

### Database Issues
```bash
# Check database connectivity
docker exec -it workflow-cockroachdb cockroach sql --insecure

# Verify database exists
docker exec -it workflow-cockroachdb cockroach sql --insecure -e "SHOW DATABASES;"
```

### Port Conflicts
```bash
# Check what's using ports
sudo netstat -tulpn | grep :3000
sudo netstat -tulpn | grep :8080
sudo netstat -tulpn | grep :26257

# Stop conflicting services or change ports in docker-compose.yml
```

## 🎯 Next Steps

1. **Explore the Dashboard** - View workflow statistics and recent activity
2. **Create a Workflow** - Use the Designer to create your first workflow
3. **Start an Instance** - Run a workflow instance and monitor its progress
4. **View Analytics** - Check performance metrics and charts

## 📚 Full Documentation

For complete documentation, see [README.md](./README.md)

## 🆘 Need Help?

- Check the logs: `docker-compose logs -f`
- Verify all services: `docker-compose ps`
- Restart if needed: `docker-compose restart`
- Full reset: `docker-compose down && docker-compose up -d`
