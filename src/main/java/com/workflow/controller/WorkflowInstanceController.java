package com.workflow.controller;

import com.workflow.domain.WorkflowInstance;
import com.workflow.repository.WorkflowInstanceRepository;
import com.workflow.service.WorkflowInstanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST Controller for Workflow Instance management
 * 
 * Provides endpoints for creating, reading, updating, and managing
 * workflow instances. Supports pagination and status filtering.
 * 
 * @author WorkFlow Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/api/workflow-instances")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class WorkflowInstanceController {

    private final WorkflowInstanceService workflowInstanceService;
    private final WorkflowInstanceRepository workflowInstanceRepository;

    /**
     * Get all workflow instances with pagination
     * 
     * @param pageable pagination parameters
     * @return Page of workflow instances
     */
    @GetMapping
    public ResponseEntity<Page<WorkflowInstance>> getAllWorkflowInstances(Pageable pageable) {
        Page<WorkflowInstance> instances = workflowInstanceRepository.findAll(pageable);
        return ResponseEntity.ok(instances);
    }

    /**
     * Get workflow instance by ID
     * 
     * @param id the workflow instance ID
     * @return Workflow instance or 404 if not found
     */
    @GetMapping("/{id}")
    public ResponseEntity<WorkflowInstance> getWorkflowInstance(@PathVariable UUID id) {
        return workflowInstanceRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get workflow instances by workflow definition ID
     * 
     * @param workflowDefinitionId the workflow definition ID
     * @return List of workflow instances for the given definition
     */
    @GetMapping("/definition/{workflowDefinitionId}")
    public ResponseEntity<List<WorkflowInstance>> getWorkflowInstancesByDefinition(
            @PathVariable UUID workflowDefinitionId) {
        List<WorkflowInstance> instances = workflowInstanceRepository.findByWorkflowDefinitionId(workflowDefinitionId);
        return ResponseEntity.ok(instances);
    }

    /**
     * Get workflow instances by status
     * 
     * @param status the instance status
     * @return List of workflow instances with the given status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<WorkflowInstance>> getWorkflowInstancesByStatus(
            @PathVariable WorkflowInstance.InstanceStatus status) {
        List<WorkflowInstance> instances = workflowInstanceRepository.findByStatus(status);
        return ResponseEntity.ok(instances);
    }

    /**
     * Get running workflow instances
     * 
     * @return List of currently running workflow instances
     */
    @GetMapping("/running")
    public ResponseEntity<List<WorkflowInstance>> getRunningWorkflowInstances() {
        List<WorkflowInstance> instances = workflowInstanceRepository.findRunningInstances();
        return ResponseEntity.ok(instances);
    }

    /**
     * Create a new workflow instance
     * 
     * @param workflowInstance the workflow instance to create
     * @return Created workflow instance
     */
    @PostMapping
    public ResponseEntity<WorkflowInstance> createWorkflowInstance(
            @Valid @RequestBody WorkflowInstance workflowInstance) {
        WorkflowInstance created = workflowInstanceService.createWorkflowInstance(workflowInstance);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Start a workflow instance from a definition
     * 
     * @param workflowDefinitionId the workflow definition ID
     * @param instanceName the name for the new instance
     * @param context the initial context data
     * @return Created workflow instance
     */
    @PostMapping("/start/{workflowDefinitionId}")
    public ResponseEntity<WorkflowInstance> startWorkflowInstance(
            @PathVariable UUID workflowDefinitionId,
            @RequestParam String instanceName,
            @RequestBody(required = false) String context) {
        WorkflowInstance instance = workflowInstanceService.startWorkflowInstance(
                workflowDefinitionId, instanceName, context);
        return ResponseEntity.status(HttpStatus.CREATED).body(instance);
    }

    /**
     * Update workflow instance status
     * 
     * @param id the workflow instance ID
     * @param status the new status
     * @return Updated workflow instance or 404 if not found
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<WorkflowInstance> updateWorkflowInstanceStatus(
            @PathVariable UUID id,
            @RequestParam WorkflowInstance.InstanceStatus status) {
        return workflowInstanceService.updateInstanceStatus(id, status)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Complete a workflow instance
     * 
     * @param id the workflow instance ID
     * @return Updated workflow instance or 404 if not found
     */
    @PostMapping("/{id}/complete")
    public ResponseEntity<WorkflowInstance> completeWorkflowInstance(@PathVariable UUID id) {
        return workflowInstanceService.completeWorkflowInstance(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Cancel a workflow instance
     * 
     * @param id the workflow instance ID
     * @return Updated workflow instance or 404 if not found
     */
    @PostMapping("/{id}/cancel")
    public ResponseEntity<WorkflowInstance> cancelWorkflowInstance(@PathVariable UUID id) {
        return workflowInstanceService.cancelWorkflowInstance(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Suspend a workflow instance
     * 
     * @param id the workflow instance ID
     * @return Updated workflow instance or 404 if not found
     */
    @PostMapping("/{id}/suspend")
    public ResponseEntity<WorkflowInstance> suspendWorkflowInstance(@PathVariable UUID id) {
        return workflowInstanceService.suspendWorkflowInstance(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Resume a suspended workflow instance
     * 
     * @param id the workflow instance ID
     * @return Updated workflow instance or 404 if not found
     */
    @PostMapping("/{id}/resume")
    public ResponseEntity<WorkflowInstance> resumeWorkflowInstance(@PathVariable UUID id) {
        return workflowInstanceService.resumeWorkflowInstance(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
