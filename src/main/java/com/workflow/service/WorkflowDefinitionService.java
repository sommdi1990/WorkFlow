package com.workflow.service;

import com.workflow.domain.WorkflowDefinition;
import com.workflow.repository.WorkflowDefinitionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

/**
 * Service class for Workflow Definition business logic
 * 
 * Handles the creation, updating, and management of workflow definitions
 * including version control and status management.
 * 
 * @author WorkFlow Team
 * @version 1.0.0
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class WorkflowDefinitionService {

    private final WorkflowDefinitionRepository workflowDefinitionRepository;

    /**
     * Create a new workflow definition
     * 
     * @param workflowDefinition the workflow definition to create
     * @return the created workflow definition
     */
    public WorkflowDefinition createWorkflowDefinition(WorkflowDefinition workflowDefinition) {
        log.info("Creating workflow definition: {}", workflowDefinition.getName());
        
        // Set default values
        if (workflowDefinition.getVersion() == null) {
            workflowDefinition.setVersion(1);
        }
        if (workflowDefinition.getStatus() == null) {
            workflowDefinition.setStatus(WorkflowDefinition.WorkflowStatus.DRAFT);
        }
        
        // Check if version already exists
        if (workflowDefinitionRepository.existsByNameAndVersion(
                workflowDefinition.getName(), workflowDefinition.getVersion())) {
            throw new IllegalArgumentException(
                String.format("Workflow definition with name '%s' and version %d already exists",
                    workflowDefinition.getName(), workflowDefinition.getVersion()));
        }
        
        WorkflowDefinition saved = workflowDefinitionRepository.save(workflowDefinition);
        log.info("Created workflow definition with ID: {}", saved.getId());
        return saved;
    }

    /**
     * Update an existing workflow definition
     * 
     * @param id the workflow definition ID
     * @param workflowDefinition the updated workflow definition
     * @return the updated workflow definition or empty if not found
     */
    public Optional<WorkflowDefinition> updateWorkflowDefinition(UUID id, WorkflowDefinition workflowDefinition) {
        log.info("Updating workflow definition: {}", id);
        
        return workflowDefinitionRepository.findById(id)
                .map(existing -> {
                    existing.setName(workflowDefinition.getName());
                    existing.setDescription(workflowDefinition.getDescription());
                    existing.setDefinition(workflowDefinition.getDefinition());
                    existing.setUpdatedBy(workflowDefinition.getUpdatedBy());
                    
                    WorkflowDefinition updated = workflowDefinitionRepository.save(existing);
                    log.info("Updated workflow definition: {}", updated.getId());
                    return updated;
                });
    }

    /**
     * Activate a workflow definition
     * 
     * @param id the workflow definition ID
     * @return the activated workflow definition or empty if not found
     */
    public Optional<WorkflowDefinition> activateWorkflowDefinition(UUID id) {
        log.info("Activating workflow definition: {}", id);
        
        return workflowDefinitionRepository.findById(id)
                .map(definition -> {
                    definition.setStatus(WorkflowDefinition.WorkflowStatus.ACTIVE);
                    WorkflowDefinition activated = workflowDefinitionRepository.save(definition);
                    log.info("Activated workflow definition: {}", activated.getId());
                    return activated;
                });
    }

    /**
     * Deactivate a workflow definition
     * 
     * @param id the workflow definition ID
     * @return the deactivated workflow definition or empty if not found
     */
    public Optional<WorkflowDefinition> deactivateWorkflowDefinition(UUID id) {
        log.info("Deactivating workflow definition: {}", id);
        
        return workflowDefinitionRepository.findById(id)
                .map(definition -> {
                    definition.setStatus(WorkflowDefinition.WorkflowStatus.INACTIVE);
                    WorkflowDefinition deactivated = workflowDefinitionRepository.save(definition);
                    log.info("Deactivated workflow definition: {}", deactivated.getId());
                    return deactivated;
                });
    }

    /**
     * Create a new version of an existing workflow definition
     * 
     * @param name the workflow name
     * @param workflowDefinition the new version data
     * @return the created workflow definition
     */
    public WorkflowDefinition createNewVersion(String name, WorkflowDefinition workflowDefinition) {
        log.info("Creating new version for workflow: {}", name);
        
        // Find the latest version
        Optional<WorkflowDefinition> latestVersion = workflowDefinitionRepository.findLatestVersionByName(name);
        
        int newVersion = latestVersion.map(WorkflowDefinition::getVersion).orElse(0) + 1;
        workflowDefinition.setName(name);
        workflowDefinition.setVersion(newVersion);
        workflowDefinition.setStatus(WorkflowDefinition.WorkflowStatus.DRAFT);
        
        WorkflowDefinition saved = workflowDefinitionRepository.save(workflowDefinition);
        log.info("Created new version {} for workflow: {}", newVersion, name);
        return saved;
    }
}
