import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import SectionTabs from './components/SectionTabs.jsx';

import Home from './pages/Home.jsx';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';

import RestaurantList from './pages/customer/RestaurantList.jsx';
import RestaurantDetail from './pages/customer/RestaurantDetail.jsx';
import Cart from './pages/customer/Cart.jsx';
import MyOrders from './pages/customer/MyOrders.jsx';

import OwnerDashboard from './pages/owner/OwnerDashboard.jsx';
import ManageMenu from './pages/owner/ManageMenu.jsx';
import OwnerOrders from './pages/owner/OwnerOrders.jsx';

import AvailableOrders from './pages/delivery/AvailableOrders.jsx';
import MyDeliveries from './pages/delivery/MyDeliveries.jsx';
import Earnings from './pages/delivery/Earnings.jsx';

const OWNER_TABS = [
  { label: 'Restaurants', to: '/owner' },
  { label: 'Orders', to: '/owner/orders' },
];

const DELIVERY_TABS = [
  { label: 'Available', to: '/delivery' },
  { label: 'My deliveries', to: '/delivery/mine' },
  { label: 'Earnings', to: '/delivery/earnings' },
];

function App() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Box sx={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/restaurants" element={<RestaurantList />} />
          <Route path="/restaurants/:id" element={<RestaurantDetail />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute roles={['customer']}>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute roles={['customer']}>
                <MyOrders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner"
            element={
              <ProtectedRoute roles={['owner']}>
                <>
                  <SectionTabs tabs={OWNER_TABS} />
                  <OwnerDashboard />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/orders"
            element={
              <ProtectedRoute roles={['owner']}>
                <>
                  <SectionTabs tabs={OWNER_TABS} />
                  <OwnerOrders />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/restaurants/:id/menu"
            element={
              <ProtectedRoute roles={['owner']}>
                <ManageMenu />
              </ProtectedRoute>
            }
          />

          <Route
            path="/delivery"
            element={
              <ProtectedRoute roles={['delivery']}>
                <>
                  <SectionTabs tabs={DELIVERY_TABS} />
                  <AvailableOrders />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/delivery/mine"
            element={
              <ProtectedRoute roles={['delivery']}>
                <>
                  <SectionTabs tabs={DELIVERY_TABS} />
                  <MyDeliveries />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/delivery/earnings"
            element={
              <ProtectedRoute roles={['delivery']}>
                <>
                  <SectionTabs tabs={DELIVERY_TABS} />
                  <Earnings />
                </>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
