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
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
} from '@mui/icons-material';
import { workflowApi } from '../services/api';

/**
 * Workflow Definitions Page
 * 
 * Displays and manages workflow definitions. Allows users to view,
 * create, edit, and activate/deactivate workflow definitions.
 * 
 * @author WorkFlow Team
 * @version 1.0.0
 */
const WorkflowDefinitions: React.FC = () => {
  const [definitions, setDefinitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDefinition, setEditingDefinition] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'DRAFT',
    definition: '{}',
  });

  useEffect(() => {
    loadDefinitions();
  }, []);

  const loadDefinitions = async () => {
    try {
      setLoading(true);
      const response = await workflowApi.getWorkflowDefinitions();
      const data = response.data.content || response.data;
      setDefinitions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to load workflow definitions');
      console.error('Error loading definitions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDefinition = () => {
    setEditingDefinition(null);
    setFormData({
      name: '',
      description: '',
      status: 'DRAFT',
      definition: '{}',
    });
    setDialogOpen(true);
  };

  const handleEditDefinition = (definition: any) => {
    setEditingDefinition(definition);
    setFormData({
      name: definition.name,
      description: definition.description || '',
      status: definition.status,
      definition: definition.definition || '{}',
    });
    setDialogOpen(true);
  };

  const handleSaveDefinition = async () => {
    try {
      if (editingDefinition) {
        await workflowApi.updateWorkflowDefinition(editingDefinition.id, formData);
      } else {
        await workflowApi.createWorkflowDefinition(formData);
      }
      setDialogOpen(false);
      loadDefinitions();
    } catch (err) {
      setError('Failed to save workflow definition');
      console.error('Error saving definition:', err);
    }
  };

  const handleDeleteDefinition = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this workflow definition?')) {
      try {
        await workflowApi.deleteWorkflowDefinition(id);
        loadDefinitions();
      } catch (err) {
        setError('Failed to delete workflow definition');
        console.error('Error deleting definition:', err);
      }
    }
  };

  const handleActivateDefinition = async (id: string) => {
    try {
      await workflowApi.activateWorkflowDefinition(id);
      loadDefinitions();
    } catch (err) {
      setError('Failed to activate workflow definition');
      console.error('Error activating definition:', err);
    }
  };

  const handleDeactivateDefinition = async (id: string) => {
    try {
      await workflowApi.deactivateWorkflowDefinition(id);
      loadDefinitions();
    } catch (err) {
      setError('Failed to deactivate workflow definition');
      console.error('Error deactivating definition:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'DRAFT':
        return 'warning';
      case 'INACTIVE':
        return 'error';
      case 'ARCHIVED':
        return 'default';
      default:
        return 'default';
    }
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
          Workflow Definitions
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateDefinition}
        >
          Create Definition
        </Button>
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
                  <TableCell>Description</TableCell>
                  <TableCell>Version</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {definitions.map((definition) => (
                  <TableRow key={definition.id}>
                    <TableCell>{definition.name}</TableCell>
                    <TableCell>{definition.description || '-'}</TableCell>
                    <TableCell>{definition.version}</TableCell>
                    <TableCell>
                      <Chip
                        label={definition.status}
                        color={getStatusColor(definition.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {definition.createdAt ? new Date(definition.createdAt).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleEditDefinition(definition)}
                        title="Edit"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteDefinition(definition.id)}
                        title="Delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                      {definition.status === 'ACTIVE' ? (
                        <IconButton
                          size="small"
                          onClick={() => handleDeactivateDefinition(definition.id)}
                          title="Deactivate"
                        >
                          <PauseIcon />
                        </IconButton>
                      ) : (
                        <IconButton
                          size="small"
                          onClick={() => handleActivateDefinition(definition.id)}
                          title="Activate"
                        >
                          <PlayArrowIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingDefinition ? 'Edit Workflow Definition' : 'Create Workflow Definition'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              multiline
              rows={3}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                label="Status"
              >
                <MenuItem value="DRAFT">Draft</MenuItem>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
                <MenuItem value="ARCHIVED">Archived</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Definition (JSON)"
              value={formData.definition}
              onChange={(e) => setFormData({ ...formData, definition: e.target.value })}
              margin="normal"
              multiline
              rows={6}
              helperText="Enter the workflow definition as JSON"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveDefinition} variant="contained">
            {editingDefinition ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkflowDefinitions;
