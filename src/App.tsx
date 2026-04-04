import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppProvider } from './context/AppContext';

// Customer Pages
import { Landing } from './pages/Customer/Landing';
import { CustomerLayout } from './pages/Customer/CustomerLayout';
import { CustomerMenu } from './pages/Customer/CustomerMenu';
import { Checkout } from './pages/Customer/Checkout';

// Admin Pages
import { AdminLogin } from './pages/Admin/AdminLogin';
import { AdminLayout } from './pages/Admin/AdminLayout';
import { AdminDashboard } from './pages/Admin/AdminDashboard';
import { MenuEditor } from './pages/Admin/MenuEditor';
import { Orders } from './pages/Admin/Orders';
import { Calls } from './pages/Admin/Calls';
import { Tables } from './pages/Admin/Tables';
import { History } from './pages/Admin/History';
import { Finance } from './pages/Admin/Finance';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/menu" element={<CustomerLayout />}>
            <Route index element={<CustomerMenu />} />
            <Route path=":tableId" element={<CustomerMenu />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path=":tableId/checkout" element={<Checkout />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="menu" element={<MenuEditor />} />
            <Route path="orders" element={<Orders />} />
            <Route path="calls" element={<Calls />} />
            <Route path="tables" element={<Tables />} />
            <Route path="history" element={<History />} />
            <Route path="finance" element={<Finance />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-right" theme="dark" />
      </BrowserRouter>
    </AppProvider>
  );
}
