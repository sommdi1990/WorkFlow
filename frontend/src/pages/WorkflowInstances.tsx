import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  Pause as PauseIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { workflowApi } from '../services/api';

/**
 * Workflow Instances Page
 * 
 * Displays and manages workflow instances. Allows users to view,
 * start, monitor, and control workflow executions.
 * 
 * @author WorkFlow Team
 * @version 1.0.0
 */
const WorkflowInstances: React.FC = () => {
  const [instances, setInstances] = useState<any[]>([]);
  const [definitions, setDefinitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDialogOpen, setStartDialogOpen] = useState(false);
  const [selectedDefinition, setSelectedDefinition] = useState('');
  const [instanceName, setInstanceName] = useState('');
  const [instanceContext, setInstanceContext] = useState('{}');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [instancesResponse, definitionsResponse] = await Promise.all([
        workflowApi.getWorkflowInstances(),
        workflowApi.getWorkflowDefinitions(),
      ]);
      
      const instancesData = instancesResponse.data.content || instancesResponse.data;
      const definitionsData = definitionsResponse.data.content || definitionsResponse.data;
      
      setInstances(Array.isArray(instancesData) ? instancesData : []);
      setDefinitions(Array.isArray(definitionsData) ? definitionsData : []);
    } catch (err) {
      setError('Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartInstance = async () => {
    try {
      await workflowApi.startWorkflowInstance(
        selectedDefinition,
        instanceName,
        instanceContext
      );
      setStartDialogOpen(false);
      setInstanceName('');
      setInstanceContext('{}');
      setSelectedDefinition('');
      loadData();
    } catch (err) {
      setError('Failed to start workflow instance');
      console.error('Error starting instance:', err);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await workflowApi.updateWorkflowInstanceStatus(id, status);
      loadData();
    } catch (err) {
      setError('Failed to update instance status');
      console.error('Error updating status:', err);
    }
  };

  const handleCompleteInstance = async (id: string) => {
    try {
      await workflowApi.completeWorkflowInstance(id);
      loadData();
    } catch (err) {
      setError('Failed to complete instance');
      console.error('Error completing instance:', err);
    }
  };

  const handleCancelInstance = async (id: string) => {
    try {
      await workflowApi.cancelWorkflowInstance(id);
      loadData();
    } catch (err) {
      setError('Failed to cancel instance');
      console.error('Error cancelling instance:', err);
    }
  };

  const handleSuspendInstance = async (id: string) => {
    try {
      await workflowApi.suspendWorkflowInstance(id);
      loadData();
    } catch (err) {
      setError('Failed to suspend instance');
      console.error('Error suspending instance:', err);
    }
  };

  const handleResumeInstance = async (id: string) => {
    try {
      await workflowApi.resumeWorkflowInstance(id);
      loadData();
    } catch (err) {
      setError('Failed to resume instance');
      console.error('Error resuming instance:', err);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'RUNNING':
        return <ScheduleIcon color="primary" />;
      case 'COMPLETED':
        return <CheckCircleIcon color="success" />;
      case 'FAILED':
        return <ErrorIcon color="error" />;
      case 'SUSPENDED':
        return <PauseIcon color="warning" />;
      case 'CANCELLED':
        return <StopIcon color="error" />;
      default:
        return <ScheduleIcon color="action" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RUNNING':
        return 'primary';
      case 'COMPLETED':
        return 'success';
      case 'FAILED':
        return 'error';
      case 'SUSPENDED':
        return 'warning';
      case 'CANCELLED':
        return 'default';
      default:
        return 'default';
    }
  };

  const getActionButtons = (instance: any) => {
    const buttons = [];
    
    if (instance.status === 'RUNNING') {
      buttons.push(
        <IconButton
          key="complete"
          size="small"
          onClick={() => handleCompleteInstance(instance.id)}
          title="Complete"
        >
          <CheckCircleIcon />
        </IconButton>,
        <IconButton
          key="suspend"
          size="small"
          onClick={() => handleSuspendInstance(instance.id)}
          title="Suspend"
        >
          <PauseIcon />
        </IconButton>,
        <IconButton
          key="cancel"
          size="small"
          onClick={() => handleCancelInstance(instance.id)}
          title="Cancel"
        >
          <StopIcon />
        </IconButton>
      );
    } else if (instance.status === 'SUSPENDED') {
      buttons.push(
        <IconButton
          key="resume"
          size="small"
          onClick={() => handleResumeInstance(instance.id)}
          title="Resume"
        >
          <PlayArrowIcon />
        </IconButton>
      );
    }
    
    return buttons;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          Workflow Instances
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadData}
            sx={{ mr: 2 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<PlayArrowIcon />}
            onClick={() => setStartDialogOpen(true)}
          >
            Start Instance
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Definition</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Started</TableCell>
                  <TableCell>Current Step</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {instances.map((instance) => (
                  <TableRow key={instance.id}>
                    <TableCell>{instance.name}</TableCell>
                    <TableCell>{instance.workflowDefinition?.name}</TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(instance.status)}
                        label={instance.status}
                        color={getStatusColor(instance.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {instance.startedAt ? new Date(instance.startedAt).toLocaleString() : '-'}
                    </TableCell>
                    <TableCell>{instance.currentStep || '-'}</TableCell>
                    <TableCell>
                      {getActionButtons(instance)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Start Instance Dialog */}
      <Dialog open={startDialogOpen} onClose={() => setStartDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Start Workflow Instance</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Workflow Definition</InputLabel>
              <Select
                value={selectedDefinition}
                onChange={(e) => setSelectedDefinition(e.target.value)}
                label="Workflow Definition"
              >
                {definitions.map((definition) => (
                  <MenuItem key={definition.id} value={definition.id}>
                    {definition.name} (v{definition.version})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Instance Name"
              value={instanceName}
              onChange={(e) => setInstanceName(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Context (JSON)"
              value={instanceContext}
              onChange={(e) => setInstanceContext(e.target.value)}
              margin="normal"
              multiline
              rows={4}
              helperText="Enter initial context data as JSON"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStartDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleStartInstance} 
            variant="contained"
            disabled={!selectedDefinition || !instanceName}
          >
            Start Instance
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkflowInstances;
