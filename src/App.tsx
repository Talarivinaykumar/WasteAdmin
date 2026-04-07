import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { MockDataProvider } from './context/MockDataContext';
import AppTheme from './dashboard/shared-theme/AppTheme';
import './App.css';

import DashboardLayout from './dashboard/DashboardLayout';
import DashboardHome from './dashboard/pages/DashboardHome';
import PageUnderConstruction from './dashboard/pages/PageUnderConstruction';

import CategoryList from './dashboard/pages/CategoryManagement/CategoryList';
import SpecificationMaster from './dashboard/pages/CategoryManagement/SpecificationMaster';
import ProductList from './dashboard/pages/ProductManagement/ProductList';
import ProductDetail from './dashboard/pages/ProductManagement/ProductDetail';
import UserList from './dashboard/pages/UserManagement/UserList';
import UserDetail from './dashboard/pages/UserManagement/UserDetail';
import SellerVerificationList from './dashboard/pages/UserManagement/SellerVerificationList';
import SellerVerificationDetail from './dashboard/pages/UserManagement/SellerVerificationDetail';
import BannerManagement from './dashboard/pages/CMS/BannerManagement';
import StaticPageManagement from './dashboard/pages/CMS/StaticPageManagement';
import AdList from './dashboard/pages/AdsManagement/AdList';
import ReportList from './dashboard/pages/Reports/ReportList';
import SendNotification from './dashboard/pages/Notifications/SendNotification';
import NotificationHistory from './dashboard/pages/Notifications/NotificationHistory';
import StateList from './dashboard/pages/LocationManagement/StateList';
import CityList from './dashboard/pages/LocationManagement/CityList';
import ProfileSettings from './dashboard/pages/Settings/ProfileSettings';
import RoleManagement from './dashboard/pages/Settings/RoleManagement';
import ActivityLogs from './dashboard/pages/Analytics/ActivityLogs';
import ApprovalLogs from './dashboard/pages/Analytics/ApprovalLogs';
import AdminLogin from './pages/AdminLogin';
import ChangePasswordForm from './pages/ChangePassword';

function App() {
  return (
    <MockDataProvider>
      <AppTheme>
        <CssBaseline enableColorScheme />
        <Router>
          <Routes>
            <Route path="/" element={<AdminLogin />} />
            <Route path="/change-password" element={<ChangePasswordForm />} />

            {/* Dashboard Layout with Nested Routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />

              {/* User Management */}
              <Route path="users/all" element={<UserList variant="all" />} />
              <Route path="users/buyers" element={<UserList variant="buyer" />} />
              <Route path="users/sellers" element={<UserList variant="seller" />} />
              <Route path="users/blocked" element={<UserList variant="blocked" />} />
              <Route path="users/detail/:id" element={<UserDetail />} />

              {/* Category Management */}
              <Route path="categories/main" element={<CategoryList type="main" />} />
              <Route path="categories/sub" element={<CategoryList type="sub" />} />
              <Route path="categories/specs" element={<SpecificationMaster />} />

              {/* Product Management */}
              <Route path="products/pending" element={<ProductList status="pending" />} />
              <Route path="products/approved" element={<ProductList status="approved" />} />
              <Route path="products/rejected" element={<ProductList status="rejected" />} />
              <Route path="products/blocked" element={<ProductList status="blocked" />} />
              <Route path="products/detail/:id" element={<ProductDetail />} />

              {/* Seller Verification */}
              <Route path="verification/pending" element={<SellerVerificationList status="pending" />} />
              <Route path="verification/approved" element={<SellerVerificationList status="approved" />} />
              <Route path="verification/rejected" element={<SellerVerificationList status="rejected" />} />
              <Route path="verification/detail/:id" element={<SellerVerificationDetail />} />

              {/* Reports */}
              <Route path="reports/products" element={<ReportList targetType="product" />} />
              <Route path="reports/users" element={<ReportList targetType="user" />} />

              {/* CMS */}
              <Route path="cms/banners" element={<BannerManagement />} />
              <Route path="cms/featured" element={<PageUnderConstruction title="Featured Products" />} />
              <Route path="cms/static" element={<StaticPageManagement />} />
              <Route path="cms/ads" element={<AdList />} />

              {/* Notifications */}
              <Route path="notifications/send" element={<SendNotification />} />
              <Route path="notifications/history" element={<NotificationHistory />} />

              {/* Locations */}
              <Route path="locations/states" element={<StateList />} />
              <Route path="locations/cities" element={<CityList />} />

              {/* Analytics */}
              <Route path="analytics/activity" element={<ActivityLogs />} />
              <Route path="analytics/approvals" element={<ApprovalLogs />} />

              {/* Settings */}
              <Route path="settings/profile" element={<ProfileSettings />} />
              <Route path="settings/security" element={<ChangePasswordForm />} />
              <Route path="settings/roles" element={<RoleManagement />} />
            </Route>
          </Routes>
        </Router>
      </AppTheme>
    </MockDataProvider>
  );
}

export default App;