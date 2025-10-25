import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`Response received from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Workflow API Service
 * 
 * Provides methods for interacting with the WorkFlow Engine backend API.
 * Includes all CRUD operations for workflow definitions and instances.
 * 
 * @author WorkFlow Team
 * @version 1.0.0
 */
export const workflowApi = {
  // Workflow Definitions
  getWorkflowDefinitions: (page = 0, size = 20) =>
    api.get(`/workflow-definitions?page=${page}&size=${size}`),
  
  getWorkflowDefinition: (id: string) =>
    api.get(`/workflow-definitions/${id}`),
  
  getWorkflowDefinitionByNameAndVersion: (name: string, version: number) =>
    api.get(`/workflow-definitions/name/${name}/version/${version}`),
  
  getLatestWorkflowDefinition: (name: string) =>
    api.get(`/workflow-definitions/name/${name}/latest`),
  
  getWorkflowDefinitionsByName: (name: string) =>
    api.get(`/workflow-definitions/name/${name}`),
  
  getWorkflowDefinitionsByStatus: (status: string) =>
    api.get(`/workflow-definitions/status/${status}`),
  
  createWorkflowDefinition: (data: any) =>
    api.post('/workflow-definitions', data),
  
  updateWorkflowDefinition: (id: string, data: any) =>
    api.put(`/workflow-definitions/${id}`, data),
  
  deleteWorkflowDefinition: (id: string) =>
    api.delete(`/workflow-definitions/${id}`),
  
  activateWorkflowDefinition: (id: string) =>
    api.post(`/workflow-definitions/${id}/activate`),
  
  deactivateWorkflowDefinition: (id: string) =>
    api.post(`/workflow-definitions/${id}/deactivate`),

  // Workflow Instances
  getWorkflowInstances: (page = 0, size = 20) =>
    api.get(`/workflow-instances?page=${page}&size=${size}`),
  
  getWorkflowInstance: (id: string) =>
    api.get(`/workflow-instances/${id}`),
  
  getWorkflowInstancesByDefinition: (workflowDefinitionId: string) =>
    api.get(`/workflow-instances/definition/${workflowDefinitionId}`),
  
  getWorkflowInstancesByStatus: (status: string) =>
    api.get(`/workflow-instances/status/${status}`),
  
  getRunningWorkflowInstances: () =>
    api.get('/workflow-instances/running'),
  
  createWorkflowInstance: (data: any) =>
    api.post('/workflow-instances', data),
  
  startWorkflowInstance: (workflowDefinitionId: string, instanceName: string, context?: any) =>
    api.post(`/workflow-instances/start/${workflowDefinitionId}`, context, {
      params: { instanceName }
    }),
  
  updateWorkflowInstanceStatus: (id: string, status: string) =>
    api.put(`/workflow-instances/${id}/status`, null, {
      params: { status }
    }),
  
  completeWorkflowInstance: (id: string) =>
    api.post(`/workflow-instances/${id}/complete`),
  
  cancelWorkflowInstance: (id: string) =>
    api.post(`/workflow-instances/${id}/cancel`),
  
  suspendWorkflowInstance: (id: string) =>
    api.post(`/workflow-instances/${id}/suspend`),
  
  resumeWorkflowInstance: (id: string) =>
    api.post(`/workflow-instances/${id}/resume`),
};

export default api;
