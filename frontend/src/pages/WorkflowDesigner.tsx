import React, { useState, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayArrowIcon,
} from '@mui/icons-material';
import { workflowApi } from '../services/api';

/**
 * Workflow Designer Component
 * 
 * Visual workflow designer using ReactFlow for creating and editing
 * workflow definitions with drag-and-drop functionality.
 * 
 * @author WorkFlow Team
 * @version 1.0.0
 */
const WorkflowDesigner: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [nodeDialogOpen, setNodeDialogOpen] = useState(false);
  const [nodeData, setNodeData] = useState({
    label: '',
    type: 'HUMAN_TASK',
    configuration: '{}',
  });
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const nodeTypes = {
    HUMAN_TASK: ({ data }: { data: any }) => (
      <div style={{
        padding: '10px',
        background: '#e3f2fd',
        border: '2px solid #1976d2',
        borderRadius: '8px',
        minWidth: '120px',
        textAlign: 'center',
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>👤 {data.label}</div>
        <div style={{ fontSize: '12px', color: '#666' }}>Human Task</div>
      </div>
    ),
    AUTOMATED: ({ data }: { data: any }) => (
      <div style={{
        padding: '10px',
        background: '#f3e5f5',
        border: '2px solid #7b1fa2',
        borderRadius: '8px',
        minWidth: '120px',
        textAlign: 'center',
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>⚙️ {data.label}</div>
        <div style={{ fontSize: '12px', color: '#666' }}>Automated</div>
      </div>
    ),
    GATEWAY: ({ data }: { data: any }) => (
      <div style={{
        padding: '10px',
        background: '#fff3e0',
        border: '2px solid #f57c00',
        borderRadius: '8px',
        minWidth: '120px',
        textAlign: 'center',
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>🔀 {data.label}</div>
        <div style={{ fontSize: '12px', color: '#666' }}>Gateway</div>
      </div>
    ),
  };

  const onConnect = (params: Connection) => {
    setEdges((eds) => addEdge(params, eds));
  };

  const addNode = () => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: nodeData.type,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        label: nodeData.label,
        configuration: nodeData.configuration,
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setNodeDialogOpen(false);
    setNodeData({ label: '', type: 'HUMAN_TASK', configuration: '{}' });
  };

  const deleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  };

  const saveWorkflow = async () => {
    try {
      setSaving(true);
      
      const workflowDefinition = {
        name: workflowName,
        description: workflowDescription,
        status: 'DRAFT',
        definition: JSON.stringify({
          nodes: nodes.map(node => ({
            id: node.id,
            type: node.type,
            position: node.position,
            data: node.data,
          })),
          edges: edges.map(edge => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            type: edge.type,
          })),
        }),
      };

      await workflowApi.createWorkflowDefinition(workflowDefinition);
      alert('Workflow saved successfully!');
    } catch (error) {
      console.error('Error saving workflow:', error);
      alert('Failed to save workflow');
    } finally {
      setSaving(false);
    }
  };

  const loadSampleWorkflow = () => {
    const sampleNodes: Node[] = [
      {
        id: 'start',
        type: 'HUMAN_TASK',
        position: { x: 100, y: 100 },
        data: { label: 'Start Process', configuration: '{}' },
      },
      {
        id: 'review',
        type: 'HUMAN_TASK',
        position: { x: 300, y: 100 },
        data: { label: 'Review Request', configuration: '{"assignee": "manager@company.com"}' },
      },
      {
        id: 'approve',
        type: 'AUTOMATED',
        position: { x: 500, y: 100 },
        data: { label: 'Auto Approve', configuration: '{"service": "approval-service"}' },
      },
      {
        id: 'end',
        type: 'HUMAN_TASK',
        position: { x: 700, y: 100 },
        data: { label: 'Complete', configuration: '{}' },
      },
    ];

    const sampleEdges: Edge[] = [
      { id: 'e1-2', source: 'start', target: 'review' },
      { id: 'e2-3', source: 'review', target: 'approve' },
      { id: 'e3-4', source: 'approve', target: 'end' },
    ];

    setNodes(sampleNodes);
    setEdges(sampleEdges);
    setWorkflowName('Sample Approval Workflow');
    setWorkflowDescription('A simple approval workflow for demonstration');
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          Workflow Designer
        </Typography>
        <Box>
          <Button
            variant="outlined"
            onClick={loadSampleWorkflow}
            sx={{ mr: 2 }}
          >
            Load Sample
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={saveWorkflow}
            disabled={saving || !workflowName}
          >
            {saving ? 'Saving...' : 'Save Workflow'}
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Workflow Properties
              </Typography>
              <TextField
                fullWidth
                label="Workflow Name"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Description"
                value={workflowDescription}
                onChange={(e) => setWorkflowDescription(e.target.value)}
                margin="normal"
                multiline
                rows={3}
              />
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Add Node
              </Typography>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setNodeDialogOpen(true)}
                sx={{ mb: 2 }}
              >
                Add Node
              </Button>
              
              <Typography variant="subtitle2" gutterBottom>
                Node Types:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip label="Human Task" color="primary" size="small" />
                <Chip label="Automated" color="secondary" size="small" />
                <Chip label="Gateway" color="warning" size="small" />
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Instructions
              </Typography>
              <Typography variant="body2" color="textSecondary">
                1. Add nodes by clicking "Add Node"<br/>
                2. Connect nodes by dragging from one node to another<br/>
                3. Configure node properties by double-clicking<br/>
                4. Save your workflow when complete
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={9}>
          <Card>
            <CardContent sx={{ p: 0, height: '600px' }}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={(event, node) => setSelectedNode(node)}
                nodeTypes={nodeTypes}
                fitView
              >
                <Controls />
                <MiniMap />
                <Background variant="dots" gap={12} size={1} />
              </ReactFlow>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Node Configuration Dialog */}
      <Dialog open={nodeDialogOpen} onClose={() => setNodeDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Node</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Node Label"
            value={nodeData.label}
            onChange={(e) => setNodeData({ ...nodeData, label: e.target.value })}
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Node Type</InputLabel>
            <Select
              value={nodeData.type}
              onChange={(e) => setNodeData({ ...nodeData, type: e.target.value })}
              label="Node Type"
            >
              <MenuItem value="HUMAN_TASK">Human Task</MenuItem>
              <MenuItem value="AUTOMATED">Automated</MenuItem>
              <MenuItem value="GATEWAY">Gateway</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Configuration (JSON)"
            value={nodeData.configuration}
            onChange={(e) => setNodeData({ ...nodeData, configuration: e.target.value })}
            margin="normal"
            multiline
            rows={4}
            helperText="Enter node configuration as JSON"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNodeDialogOpen(false)}>Cancel</Button>
          <Button onClick={addNode} variant="contained" disabled={!nodeData.label}>
            Add Node
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkflowDesigner;
