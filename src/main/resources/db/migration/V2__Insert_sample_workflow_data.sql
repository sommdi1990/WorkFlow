-- V2__Insert_sample_workflow_data.sql
-- Sample workflow definitions and steps for testing

-- Insert sample workflow definition
INSERT INTO workflow_definitions (id, name, description, version, status, definition, created_by) 
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'Employee Onboarding',
    'Complete employee onboarding process including documentation, training, and equipment setup',
    1,
    'ACTIVE',
    '{"description": "Employee onboarding workflow", "estimatedDuration": "5 days", "category": "HR"}',
    'system'
);

-- Insert workflow steps for Employee Onboarding
INSERT INTO workflow_steps (workflow_definition_id, step_name, step_type, step_order, configuration, next_steps) 
VALUES 
    ('550e8400-e29b-41d4-a716-446655440000', 'Document Collection', 'HUMAN_TASK', 1, 
     '{"assignee": "hr@company.com", "dueDays": 2, "description": "Collect all required documents"}',
     '["Background Check"]'),
    
    ('550e8400-e29b-41d4-a716-446655440000', 'Background Check', 'AUTOMATED', 2,
     '{"service": "background-check-service", "timeout": 3600}',
     '["Equipment Setup"]'),
    
    ('550e8400-e29b-41d4-a716-446655440000', 'Equipment Setup', 'HUMAN_TASK', 3,
     '{"assignee": "it@company.com", "dueDays": 1, "description": "Setup computer and access"}',
     '["Training Schedule"]'),
    
    ('550e8400-e29b-41d4-a716-446655440000', 'Training Schedule', 'HUMAN_TASK', 4,
     '{"assignee": "training@company.com", "dueDays": 3, "description": "Schedule and conduct training"}',
     '["Final Review"]'),
    
    ('550e8400-e29b-41d4-a716-446655440000', 'Final Review', 'HUMAN_TASK', 5,
     '{"assignee": "manager@company.com", "dueDays": 1, "description": "Final review and approval"}',
     '[]');

-- Insert another sample workflow definition
INSERT INTO workflow_definitions (id, name, description, version, status, definition, created_by) 
VALUES (
    '550e8400-e29b-41d4-a716-446655440001',
    'Purchase Approval',
    'Purchase request approval workflow for different amounts',
    1,
    'ACTIVE',
    '{"description": "Purchase approval workflow", "estimatedDuration": "3 days", "category": "Finance"}',
    'system'
);

-- Insert workflow steps for Purchase Approval
INSERT INTO workflow_steps (workflow_definition_id, step_name, step_type, step_order, configuration, next_steps, conditions) 
VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', 'Initial Review', 'HUMAN_TASK', 1,
     '{"assignee": "supervisor@company.com", "dueDays": 1, "description": "Initial review of purchase request"}',
     '["Manager Approval", "Director Approval"]',
     '{"amount": {"<": 1000}}'),
    
    ('550e8400-e29b-41d4-a716-446655440001', 'Manager Approval', 'HUMAN_TASK', 2,
     '{"assignee": "manager@company.com", "dueDays": 2, "description": "Manager approval for medium amounts"}',
     '["Final Approval"]',
     '{"amount": {">=": 1000, "<": 10000}}'),
    
    ('550e8400-e29b-41d4-a716-446655440001', 'Director Approval', 'HUMAN_TASK', 3,
     '{"assignee": "director@company.com", "dueDays": 3, "description": "Director approval for large amounts"}',
     '["Final Approval"]',
     '{"amount": {">=": 10000}}'),
    
    ('550e8400-e29b-41d4-a716-446655440001', 'Final Approval', 'HUMAN_TASK', 4,
     '{"assignee": "finance@company.com", "dueDays": 1, "description": "Final approval and processing"}',
     '[]',
     '{}');
