package com.workflow.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Workflow Instance Entity
 * 
 * Represents a running instance of a workflow definition.
 * Each instance tracks the current state and execution progress.
 * 
 * @author WorkFlow Team
 * @version 1.0.0
 */
@Entity
@Table(name = "workflow_instances")
@Data
@EqualsAndHashCode(callSuper = false)
@EntityListeners(AuditingEntityListener.class)
public class WorkflowInstance {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workflow_definition_id", nullable = false)
    private WorkflowDefinition workflowDefinition;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InstanceStatus status = InstanceStatus.RUNNING;

    @Column(name = "current_step")
    private String currentStep;

    @Column(columnDefinition = "jsonb")
    private String context;

    @CreationTimestamp
    @Column(name = "started_at", nullable = false, updatable = false)
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;

    @OneToMany(mappedBy = "workflowInstance", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<WorkflowExecution> executions;

    /**
     * Instance Status Enumeration
     */
    public enum InstanceStatus {
        RUNNING, COMPLETED, FAILED, SUSPENDED, CANCELLED
    }
}
