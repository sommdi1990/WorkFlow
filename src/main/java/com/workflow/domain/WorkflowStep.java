package com.workflow.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Workflow Step Entity
 * 
 * Represents a single step in a workflow definition.
 * Each step defines the action to be performed and its configuration.
 * 
 * @author WorkFlow Team
 * @version 1.0.0
 */
@Entity
@Table(name = "workflow_steps")
@Data
@EqualsAndHashCode(callSuper = false)
@EntityListeners(AuditingEntityListener.class)
public class WorkflowStep {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workflow_definition_id", nullable = false)
    private WorkflowDefinition workflowDefinition;

    @Column(name = "step_name", nullable = false)
    private String stepName;

    @Enumerated(EnumType.STRING)
    @Column(name = "step_type", nullable = false)
    private StepType stepType;

    @Column(name = "step_order", nullable = false)
    private Integer stepOrder;

    @Column(columnDefinition = "jsonb")
    private String configuration;

    @Column(columnDefinition = "jsonb")
    private String nextSteps;

    @Column(columnDefinition = "jsonb")
    private String conditions;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * Step Type Enumeration
     */
    public enum StepType {
        HUMAN_TASK, AUTOMATED, GATEWAY, TIMER, SCRIPT, SERVICE_CALL
    }
}
