package com.workflow.repository;

import com.workflow.domain.WorkflowInstance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Repository interface for WorkflowInstance entity
 * 
 * Provides data access methods for workflow instances including
 * custom queries for finding instances by status and date ranges.
 * 
 * @author WorkFlow Team
 * @version 1.0.0
 */
@Repository
public interface WorkflowInstanceRepository extends JpaRepository<WorkflowInstance, UUID> {

    /**
     * Find all workflow instances by workflow definition
     * 
     * @param workflowDefinitionId the workflow definition ID
     * @return List of workflow instances for the given definition
     */
    List<WorkflowInstance> findByWorkflowDefinitionId(UUID workflowDefinitionId);

    /**
     * Find workflow instances by status
     * 
     * @param status the instance status
     * @return List of workflow instances with the given status
     */
    List<WorkflowInstance> findByStatus(WorkflowInstance.InstanceStatus status);

    /**
     * Find workflow instances created by a specific user
     * 
     * @param createdBy the creator's identifier
     * @return List of workflow instances created by the user
     */
    List<WorkflowInstance> findByCreatedBy(String createdBy);

    /**
     * Find workflow instances started within a date range
     * 
     * @param startDate the start date
     * @param endDate the end date
     * @return List of workflow instances started within the date range
     */
    List<WorkflowInstance> findByStartedAtBetween(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Find running workflow instances
     * 
     * @return List of currently running workflow instances
     */
    @Query("SELECT wi FROM WorkflowInstance wi WHERE wi.status = 'RUNNING'")
    List<WorkflowInstance> findRunningInstances();

    /**
     * Find workflow instances by current step
     * 
     * @param currentStep the current step name
     * @return List of workflow instances at the given step
     */
    List<WorkflowInstance> findByCurrentStep(String currentStep);

    /**
     * Count workflow instances by status
     * 
     * @param status the instance status
     * @return Count of workflow instances with the given status
     */
    long countByStatus(WorkflowInstance.InstanceStatus status);
}
