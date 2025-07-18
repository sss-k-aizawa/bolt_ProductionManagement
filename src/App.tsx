import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import InventoryAdd from './pages/InventoryAdd';
import InventoryDailyEdit from './pages/InventoryDailyEdit';
import InventoryOrder from './pages/InventoryOrder';
import InventoryOrderConfirm from './pages/InventoryOrderConfirm';
import InventoryOrderHistory from './pages/InventoryOrderHistory';
import Production from './pages/Production';
import ProductionScheduleEdit from './pages/ProductionScheduleEdit';
import ProductShipmentEdit from './pages/ProductShipmentEdit';
import ShipmentHistory from './pages/ShipmentHistory';
import ProductInventoryEdit from './pages/ProductInventoryEdit';
import Settings from './pages/Settings';
import MasterManagement from './pages/MasterManagement';
import CustomerAdd from './pages/CustomerAdd';
import ProductCustomerMappingAdd from './pages/ProductCustomerMappingAdd';
import Shipment from './pages/Shipment';
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
            <Route path="/inventory/daily/edit" element={<InventoryDailyEdit />} />
            <Route path="/inventory/order" element={<InventoryOrder />} />
            <Route path="/inventory/order/confirm" element={<InventoryOrderConfirm />} />
            <Route path="/inventory/order/history" element={<InventoryOrderHistory />} />
            <Route path="/production" element={<Production />} />
            <Route path="/production/schedule/edit" element={<ProductionScheduleEdit />} />
            <Route path="/shipment" element={<Shipment />} />
            <Route path="/shipment/edit" element={<ProductShipmentEdit />} />
            <Route path="/shipment-history" element={<ShipmentHistory />} />
            <Route path="/shipment-history/:customerId" element={<ShipmentHistory />} />
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