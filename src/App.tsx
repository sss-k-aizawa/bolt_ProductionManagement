import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import InventoryAdd from './pages/InventoryAdd';
import InventoryEdit from './pages/InventoryEdit';
import InventoryDailyEdit from './pages/InventoryDailyEdit';
import InventoryOrder from './pages/InventoryOrder';
import InventoryOrderConfirm from './pages/InventoryOrderConfirm';
import InventoryOrderHistory from './pages/InventoryOrderHistory';
import PalletPlanning from './pages/PalletPlanning';
import PalletPlanningEdit from './pages/PalletPlanningEdit';
import Production from './pages/Production';
import ProductionScheduleEdit from './pages/ProductionScheduleEdit';
import ProductShipmentEdit from './pages/ProductShipmentEdit';
import ManufacturingInstructionList from './pages/ManufacturingInstructionList';
import ManufacturingInstruction from './pages/ManufacturingInstruction';
import ProductInventoryEdit from './pages/ProductInventoryEdit';
import Settings from './pages/Settings';
import MasterManagement from './pages/MasterManagement';
import CustomerAdd from './pages/CustomerAdd';
import ProductCustomerMappingAdd from './pages/ProductCustomerMappingAdd';
import AuthGuard from './components/auth/AuthGuard';

function App() {
  return (
    <AuthGuard>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/inventory/add" element={<InventoryAdd />} />
            <Route path="/inventory/edit/:id" element={<InventoryEdit />} />
            <Route path="/inventory/daily/edit" element={<InventoryDailyEdit />} />
            <Route path="/inventory/order" element={<InventoryOrder />} />
            <Route path="/inventory/order/confirm" element={<InventoryOrderConfirm />} />
            <Route path="/inventory/order/history" element={<InventoryOrderHistory />} />
            <Route path="/pallet-planning" element={<PalletPlanning />} />
            <Route path="/pallet-planning/edit" element={<PalletPlanningEdit />} />
            <Route path="/production" element={<Production />} />
            <Route path="/production/schedule/edit" element={<ProductionScheduleEdit />} />
            <Route path="/production/shipment/edit" element={<ProductShipmentEdit />} />
            <Route path="/production/manufacturing-instruction" element={<ManufacturingInstruction />} />
            <Route path="/manufacturing-instructions" element={<ManufacturingInstructionList />} />
            <Route path="/manufacturing-instructions/new" element={<ManufacturingInstruction />} />
            <Route path="/manufacturing-instructions/:id" element={<ManufacturingInstruction />} />
            <Route path="/manufacturing-instructions/:id/edit" element={<ManufacturingInstruction />} />
            <Route path="/master-management" element={<MasterManagement />} />
            <Route path="/master-management/customer/add" element={<CustomerAdd />} />
            <Route path="/master-management/product-customer/add" element={<ProductCustomerMappingAdd />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </Router>
    </AuthGuard>
  );
}

export default App;