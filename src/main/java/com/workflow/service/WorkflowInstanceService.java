package com.workflow.service;

import com.workflow.domain.WorkflowDefinition;
import com.workflow.domain.WorkflowInstance;
import com.workflow.domain.WorkflowStep;
import com.workflow.repository.WorkflowDefinitionRepository;
import com.workflow.repository.WorkflowInstanceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Service class for Workflow Instance business logic
 * 
 * Handles the creation, execution, and management of workflow instances
 * including status transitions and step execution.
 * 
 * @author WorkFlow Team
 * @version 1.0.0
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class WorkflowInstanceService {

    private final WorkflowInstanceRepository workflowInstanceRepository;
    private final WorkflowDefinitionRepository workflowDefinitionRepository;

    /**
     * Create a new workflow instance
     * 
     * @param workflowInstance the workflow instance to create
     * @return the created workflow instance
     */
    public WorkflowInstance createWorkflowInstance(WorkflowInstance workflowInstance) {
        log.info("Creating workflow instance: {}", workflowInstance.getName());
        
        // Set default values
        if (workflowInstance.getStatus() == null) {
            workflowInstance.setStatus(WorkflowInstance.InstanceStatus.RUNNING);
        }
        if (workflowInstance.getStartedAt() == null) {
            workflowInstance.setStartedAt(LocalDateTime.now());
        }
        
        WorkflowInstance saved = workflowInstanceRepository.save(workflowInstance);
        log.info("Created workflow instance with ID: {}", saved.getId());
        return saved;
    }

    /**
     * Start a workflow instance from a definition
     * 
     * @param workflowDefinitionId the workflow definition ID
     * @param instanceName the name for the new instance
     * @param context the initial context data
     * @return the created workflow instance
     */
    public WorkflowInstance startWorkflowInstance(UUID workflowDefinitionId, String instanceName, String context) {
        log.info("Starting workflow instance from definition: {}", workflowDefinitionId);
        
        WorkflowDefinition definition = workflowDefinitionRepository.findById(workflowDefinitionId)
                .orElseThrow(() -> new IllegalArgumentException("Workflow definition not found: " + workflowDefinitionId));
        
        if (definition.getStatus() != WorkflowDefinition.WorkflowStatus.ACTIVE) {
            throw new IllegalStateException("Cannot start instance from inactive workflow definition");
        }
        
        WorkflowInstance instance = new WorkflowInstance();
        instance.setWorkflowDefinition(definition);
        instance.setName(instanceName);
        instance.setContext(context);
        instance.setStatus(WorkflowInstance.InstanceStatus.RUNNING);
        instance.setStartedAt(LocalDateTime.now());
        
        // Set current step to the first step
        List<WorkflowStep> steps = definition.getSteps();
        if (!steps.isEmpty()) {
            WorkflowStep firstStep = steps.stream()
                    .min((s1, s2) -> Integer.compare(s1.getStepOrder(), s2.getStepOrder()))
                    .orElse(null);
            if (firstStep != null) {
                instance.setCurrentStep(firstStep.getStepName());
            }
        }
        
        WorkflowInstance saved = workflowInstanceRepository.save(instance);
        log.info("Started workflow instance with ID: {}", saved.getId());
        return saved;
    }

    /**
     * Update workflow instance status
     * 
     * @param id the workflow instance ID
     * @param status the new status
     * @return the updated workflow instance or empty if not found
     */
    public Optional<WorkflowInstance> updateInstanceStatus(UUID id, WorkflowInstance.InstanceStatus status) {
        log.info("Updating workflow instance status: {} to {}", id, status);
        
        return workflowInstanceRepository.findById(id)
                .map(instance -> {
                    instance.setStatus(status);
                    if (status == WorkflowInstance.InstanceStatus.COMPLETED) {
                        instance.setCompletedAt(LocalDateTime.now());
                    }
                    WorkflowInstance updated = workflowInstanceRepository.save(instance);
                    log.info("Updated workflow instance status: {}", updated.getId());
                    return updated;
                });
    }

    /**
     * Complete a workflow instance
     * 
     * @param id the workflow instance ID
     * @return the completed workflow instance or empty if not found
     */
    public Optional<WorkflowInstance> completeWorkflowInstance(UUID id) {
        log.info("Completing workflow instance: {}", id);
        
        return workflowInstanceRepository.findById(id)
                .map(instance -> {
                    instance.setStatus(WorkflowInstance.InstanceStatus.COMPLETED);
                    instance.setCompletedAt(LocalDateTime.now());
                    WorkflowInstance completed = workflowInstanceRepository.save(instance);
                    log.info("Completed workflow instance: {}", completed.getId());
                    return completed;
                });
    }

    /**
     * Cancel a workflow instance
     * 
     * @param id the workflow instance ID
     * @return the cancelled workflow instance or empty if not found
     */
    public Optional<WorkflowInstance> cancelWorkflowInstance(UUID id) {
        log.info("Cancelling workflow instance: {}", id);
        
        return workflowInstanceRepository.findById(id)
                .map(instance -> {
                    instance.setStatus(WorkflowInstance.InstanceStatus.CANCELLED);
                    instance.setCompletedAt(LocalDateTime.now());
                    WorkflowInstance cancelled = workflowInstanceRepository.save(instance);
                    log.info("Cancelled workflow instance: {}", cancelled.getId());
                    return cancelled;
                });
    }

    /**
     * Suspend a workflow instance
     * 
     * @param id the workflow instance ID
     * @return the suspended workflow instance or empty if not found
     */
    public Optional<WorkflowInstance> suspendWorkflowInstance(UUID id) {
        log.info("Suspending workflow instance: {}", id);
        
        return workflowInstanceRepository.findById(id)
                .map(instance -> {
                    if (instance.getStatus() != WorkflowInstance.InstanceStatus.RUNNING) {
                        throw new IllegalStateException("Only running instances can be suspended");
                    }
                    instance.setStatus(WorkflowInstance.InstanceStatus.SUSPENDED);
                    WorkflowInstance suspended = workflowInstanceRepository.save(instance);
                    log.info("Suspended workflow instance: {}", suspended.getId());
                    return suspended;
                });
    }

    /**
     * Resume a suspended workflow instance
     * 
     * @param id the workflow instance ID
     * @return the resumed workflow instance or empty if not found
     */
    public Optional<WorkflowInstance> resumeWorkflowInstance(UUID id) {
        log.info("Resuming workflow instance: {}", id);
        
        return workflowInstanceRepository.findById(id)
                .map(instance -> {
                    if (instance.getStatus() != WorkflowInstance.InstanceStatus.SUSPENDED) {
                        throw new IllegalStateException("Only suspended instances can be resumed");
                    }
                    instance.setStatus(WorkflowInstance.InstanceStatus.RUNNING);
                    WorkflowInstance resumed = workflowInstanceRepository.save(instance);
                    log.info("Resumed workflow instance: {}", resumed.getId());
                    return resumed;
                });
    }
}
