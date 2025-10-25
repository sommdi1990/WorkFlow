import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import WorkflowDefinitions from './pages/WorkflowDefinitions';
import WorkflowInstances from './pages/WorkflowInstances';
import WorkflowDesigner from './pages/WorkflowDesigner';
import WorkflowAnalytics from './pages/WorkflowAnalytics';

/**
 * Main App Component
 * 
 * Sets up routing and layout for the WorkFlow Engine frontend.
 * Provides navigation and main content areas.
 * 
 * @author WorkFlow Team
 * @version 1.0.0
 */
const App: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/definitions" element={<WorkflowDefinitions />} />
          <Route path="/instances" element={<WorkflowInstances />} />
          <Route path="/designer" element={<WorkflowDesigner />} />
          <Route path="/analytics" element={<WorkflowAnalytics />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default App;
