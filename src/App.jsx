import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import Kanban from './pages/Kanban';
import Archive from './pages/Archive';
import Workload from './pages/Workload';
import GlobalHistory from './pages/GlobalHistory';
import Reports from './pages/Reports';
import Roles from './pages/Roles';
import Expedientes from './pages/Expedientes';
import Calendar from './pages/Calendar';
import Turnado from './pages/Turnado';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="kanban" element={<Kanban />} />
            <Route path="expedientes" element={<Expedientes />} />
            <Route path="turnado" element={<Turnado />} />
            <Route path="archive" element={<Archive />} />
            <Route path="qr-inventory" element={<Archive />} />
            <Route path="workload" element={<Workload />} />
            <Route path="history" element={<GlobalHistory />} />
            <Route path="reports" element={<Reports />} />
            <Route path="reports-ops" element={<Reports />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="roles" element={<Roles />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
