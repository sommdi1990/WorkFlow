package com.workflow.controller;

import com.workflow.domain.WorkflowDefinition;
import com.workflow.repository.WorkflowDefinitionRepository;
import com.workflow.service.WorkflowDefinitionService;
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
 * REST Controller for Workflow Definition management
 * 
 * Provides endpoints for creating, reading, updating, and deleting
 * workflow definitions. Supports pagination and filtering.
 * 
 * @author WorkFlow Team
 * @version 1.0.0
 */
@RestController
@RequestMapping("/api/workflow-definitions")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class WorkflowDefinitionController {

    private final WorkflowDefinitionService workflowDefinitionService;
    private final WorkflowDefinitionRepository workflowDefinitionRepository;

    /**
     * Get all workflow definitions with pagination
     * 
     * @param pageable pagination parameters
     * @return Page of workflow definitions
     */
    @GetMapping
    public ResponseEntity<Page<WorkflowDefinition>> getAllWorkflowDefinitions(Pageable pageable) {
        Page<WorkflowDefinition> definitions = workflowDefinitionRepository.findAll(pageable);
        return ResponseEntity.ok(definitions);
    }

    /**
     * Get workflow definition by ID
     * 
     * @param id the workflow definition ID
     * @return Workflow definition or 404 if not found
     */
    @GetMapping("/{id}")
    public ResponseEntity<WorkflowDefinition> getWorkflowDefinition(@PathVariable UUID id) {
        return workflowDefinitionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get workflow definition by name and version
     * 
     * @param name the workflow name
     * @param version the workflow version
     * @return Workflow definition or 404 if not found
     */
    @GetMapping("/name/{name}/version/{version}")
    public ResponseEntity<WorkflowDefinition> getWorkflowDefinitionByNameAndVersion(
            @PathVariable String name, 
            @PathVariable Integer version) {
        return workflowDefinitionRepository.findByNameAndVersion(name, version)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get latest version of workflow definition by name
     * 
     * @param name the workflow name
     * @return Latest workflow definition or 404 if not found
     */
    @GetMapping("/name/{name}/latest")
    public ResponseEntity<WorkflowDefinition> getLatestWorkflowDefinition(@PathVariable String name) {
        return workflowDefinitionRepository.findLatestVersionByName(name)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get all versions of a workflow definition by name
     * 
     * @param name the workflow name
     * @return List of workflow definitions with the given name
     */
    @GetMapping("/name/{name}")
    public ResponseEntity<List<WorkflowDefinition>> getWorkflowDefinitionsByName(@PathVariable String name) {
        List<WorkflowDefinition> definitions = workflowDefinitionRepository.findByName(name);
        return ResponseEntity.ok(definitions);
    }

    /**
     * Get workflow definitions by status
     * 
     * @param status the workflow status
     * @return List of workflow definitions with the given status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<WorkflowDefinition>> getWorkflowDefinitionsByStatus(
            @PathVariable WorkflowDefinition.WorkflowStatus status) {
        List<WorkflowDefinition> definitions = workflowDefinitionRepository.findByStatus(status);
        return ResponseEntity.ok(definitions);
    }

    /**
     * Create a new workflow definition
     * 
     * @param workflowDefinition the workflow definition to create
     * @return Created workflow definition
     */
    @PostMapping
    public ResponseEntity<WorkflowDefinition> createWorkflowDefinition(
            @Valid @RequestBody WorkflowDefinition workflowDefinition) {
        WorkflowDefinition created = workflowDefinitionService.createWorkflowDefinition(workflowDefinition);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Update an existing workflow definition
     * 
     * @param id the workflow definition ID
     * @param workflowDefinition the updated workflow definition
     * @return Updated workflow definition or 404 if not found
     */
    @PutMapping("/{id}")
    public ResponseEntity<WorkflowDefinition> updateWorkflowDefinition(
            @PathVariable UUID id,
            @Valid @RequestBody WorkflowDefinition workflowDefinition) {
        return workflowDefinitionService.updateWorkflowDefinition(id, workflowDefinition)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Delete a workflow definition
     * 
     * @param id the workflow definition ID
     * @return 204 No Content if successful, 404 if not found
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkflowDefinition(@PathVariable UUID id) {
        if (workflowDefinitionRepository.existsById(id)) {
            workflowDefinitionRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Activate a workflow definition
     * 
     * @param id the workflow definition ID
     * @return Updated workflow definition or 404 if not found
     */
    @PostMapping("/{id}/activate")
    public ResponseEntity<WorkflowDefinition> activateWorkflowDefinition(@PathVariable UUID id) {
        return workflowDefinitionService.activateWorkflowDefinition(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Deactivate a workflow definition
     * 
     * @param id the workflow definition ID
     * @return Updated workflow definition or 404 if not found
     */
    @PostMapping("/{id}/deactivate")
    public ResponseEntity<WorkflowDefinition> deactivateWorkflowDefinition(@PathVariable UUID id) {
        return workflowDefinitionService.deactivateWorkflowDefinition(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
