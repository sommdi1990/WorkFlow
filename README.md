# Workflow definitions and instance tracking

A React interface and a Spring backend manage reusable workflow definitions and individual runs. The instance service loads a definition, saves a new instance and records later status changes.

The frontend separates definitions, the designer and instances into distinct pages. The service distinguishes starting, completing and cancelling an instance. Compare the instance methods with the migration to see which state survives a request.

- [WorkflowDefinitions.tsx](frontend/src/pages/WorkflowDefinitions.tsx)
- [WorkflowInstanceService.java](src/main/java/com/workflow/service/WorkflowInstanceService.java)
- [WorkflowInstanceRepository.java](src/main/java/com/workflow/repository/WorkflowInstanceRepository.java)
- [V1__Create_workflow_tables.sql](src/main/resources/db/migration/V1__Create_workflow_tables.sql)

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

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
