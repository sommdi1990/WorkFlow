package com.workflow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Main Spring Boot Application for WorkFlow Engine
 * 
 * This application provides a complete workflow management system with:
 * - Workflow definition and execution
 * - Task management and assignment
 * - Process monitoring and analytics
 * - RESTful API for frontend integration
 * 
 * @author WorkFlow Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableJpaAuditing
public class WorkflowApplication {

    public static void main(String[] args) {
        SpringApplication.run(WorkflowApplication.class, args);
    }
}
