package com.workflow.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Workflow Assignment Entity
 * 
 * Represents the assignment of a human task to a specific user.
 * Tracks the assignment status and any comments provided.
 * 
 * @author WorkFlow Team
 * @version 1.0.0
 */
@Entity
@Table(name = "workflow_assignments")
@Data
@EqualsAndHashCode(callSuper = false)
@EntityListeners(AuditingEntityListener.class)
public class WorkflowAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workflow_execution_id", nullable = false)
    private WorkflowExecution workflowExecution;

    @Column(nullable = false)
    private String assignee;

    @CreationTimestamp
    @Column(name = "assigned_at", nullable = false, updatable = false)
    private LocalDateTime assignedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AssignmentStatus status = AssignmentStatus.ASSIGNED;

    @Column(columnDefinition = "TEXT")
    private String comments;

    /**
     * Assignment Status Enumeration
     */
    public enum AssignmentStatus {
        ASSIGNED, IN_PROGRESS, COMPLETED, REJECTED, DELEGATED
    }
}
