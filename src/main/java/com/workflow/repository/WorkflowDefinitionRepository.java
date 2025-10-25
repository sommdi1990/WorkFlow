package com.workflow.repository;

import com.workflow.domain.WorkflowDefinition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for WorkflowDefinition entity
 * 
 * Provides data access methods for workflow definitions including
 * custom queries for finding active workflows and versions.
 * 
 * @author WorkFlow Team
 * @version 1.0.0
 */
@Repository
public interface WorkflowDefinitionRepository extends JpaRepository<WorkflowDefinition, UUID> {

    /**
     * Find workflow definition by name and version
     * 
     * @param name the workflow name
     * @param version the workflow version
     * @return Optional containing the workflow definition if found
     */
    Optional<WorkflowDefinition> findByNameAndVersion(String name, Integer version);

    /**
     * Find all workflow definitions by name
     * 
     * @param name the workflow name
     * @return List of workflow definitions with the given name
     */
    List<WorkflowDefinition> findByName(String name);

    /**
     * Find all active workflow definitions
     * 
     * @return List of active workflow definitions
     */
    List<WorkflowDefinition> findByStatus(WorkflowDefinition.WorkflowStatus status);

    /**
     * Find the latest version of a workflow by name
     * 
     * @param name the workflow name
     * @return Optional containing the latest workflow definition
     */
    @Query("SELECT wd FROM WorkflowDefinition wd WHERE wd.name = :name ORDER BY wd.version DESC LIMIT 1")
    Optional<WorkflowDefinition> findLatestVersionByName(@Param("name") String name);

    /**
     * Find workflow definitions created by a specific user
     * 
     * @param createdBy the creator's identifier
     * @return List of workflow definitions created by the user
     */
    List<WorkflowDefinition> findByCreatedBy(String createdBy);

    /**
     * Check if a workflow definition exists with the given name and version
     * 
     * @param name the workflow name
     * @param version the workflow version
     * @return true if exists, false otherwise
     */
    boolean existsByNameAndVersion(String name, Integer version);
}
