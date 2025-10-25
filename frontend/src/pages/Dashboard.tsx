import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';
import { workflowApi } from '../services/api';

/**
 * Dashboard Component
 * 
 * Main dashboard showing workflow overview, statistics, and recent activity.
 * Displays charts and metrics for workflow performance monitoring.
 * 
 * @author WorkFlow Team
 * @version 1.0.0
 */
const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalDefinitions: 0,
    totalInstances: 0,
    runningInstances: 0,
    completedInstances: 0,
  });
  const [recentInstances, setRecentInstances] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load workflow definitions
      const definitionsResponse = await workflowApi.getWorkflowDefinitions();
      const definitions = definitionsResponse.data.content || definitionsResponse.data;
      
      // Load workflow instances
      const instancesResponse = await workflowApi.getWorkflowInstances();
      const instances = instancesResponse.data.content || instancesResponse.data;
      
      // Calculate statistics
      const runningInstances = instances.filter((i: any) => i.status === 'RUNNING');
      const completedInstances = instances.filter((i: any) => i.status === 'COMPLETED');
      
      setStats({
        totalDefinitions: Array.isArray(definitions) ? definitions.length : 0,
        totalInstances: Array.isArray(instances) ? instances.length : 0,
        runningInstances: runningInstances.length,
        completedInstances: completedInstances.length,
      });
      
      // Set recent instances (last 10)
      setRecentInstances(instances.slice(0, 10));
      
      // Generate chart data (mock data for now)
      setChartData([
        { name: 'Mon', instances: 4 },
        { name: 'Tue', instances: 3 },
        { name: 'Wed', instances: 6 },
        { name: 'Thu', instances: 2 },
        { name: 'Fri', instances: 8 },
        { name: 'Sat', instances: 1 },
        { name: 'Sun', instances: 3 },
      ]);
      
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
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

  const pieData = [
    { name: 'Running', value: stats.runningInstances, color: '#1976d2' },
    { name: 'Completed', value: stats.completedInstances, color: '#2e7d32' },
    { name: 'Failed', value: stats.totalInstances - stats.runningInstances - stats.completedInstances, color: '#d32f2f' },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      
      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Definitions
              </Typography>
              <Typography variant="h4">
                {stats.totalDefinitions}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Instances
              </Typography>
              <Typography variant="h4">
                {stats.totalInstances}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Running Instances
              </Typography>
              <Typography variant="h4" color="primary">
                {stats.runningInstances}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Completed Instances
              </Typography>
              <Typography variant="h4" color="success.main">
                {stats.completedInstances}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Instance Activity (Last 7 Days)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="instances" stroke="#1976d2" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Instance Status Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Instances */}
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6">
              Recent Workflow Instances
            </Typography>
            <Button variant="outlined" size="small">
              View All
            </Button>
          </Box>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Definition</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Started</TableCell>
                  <TableCell>Current Step</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentInstances.map((instance) => (
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
                      {instance.startedAt ? format(new Date(instance.startedAt), 'MMM dd, yyyy HH:mm') : '-'}
                    </TableCell>
                    <TableCell>{instance.currentStep || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;
