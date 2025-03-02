import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import DashboardRouter from './components/DashboardRouter';
import ProtectedRoute from './components/ProtectedRoute';
import FinancialTools from './components/financial/FinancialTools';
import TaxCompliance from './components/TaxCompliance';
import Funding from './components/Funding';
import Loans from './components/Loans';
import Community from './components/Community';
import Layout from './components/Layout';
import UserProfile from './components/UserProfile';
import Meeting from './components/Meeting';
import Notifications from './components/Notifications';
import Chatbot from './components/Chatbot';
import GovernmentSchemes from './components/GovernmentSchemes';
import './App.css';

// These will be created later or already exist
import VirtualPitch from './components/investor/VirtualPitch';
import ExploreStartups from './components/investor/ExploreStartups';
import PaymentGateway from './components/investor/PaymentGateway';
import Schemes from './components/startup/Schemes';
import Payments from './components/startup/Payments';
import Meetings from './components/Meetings';

const App = () => {
  return (
    <Router>
      <Layout>
        <Chatbot />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
            },
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Protected Routes for both user types */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/meetings"
            element={
              <ProtectedRoute>
                <Meetings />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/virtual-pitch"
            element={
              <ProtectedRoute>
                <VirtualPitch />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/community"
            element={
              <ProtectedRoute>
                <Community />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          
          {/* Startup Only Routes */}
          <Route
            path="/financial-tools"
            element={
              <ProtectedRoute allowedUserTypes={['startup']}>
                <FinancialTools />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/loans"
            element={
              <ProtectedRoute allowedUserTypes={['startup']}>
                <Loans />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/schemes"
            element={
              <ProtectedRoute allowedUserTypes={['startup']}>
                <Schemes />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/government-schemes"
            element={
              <ProtectedRoute allowedUserTypes={['startup']}>
                <GovernmentSchemes />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/tax-compliance"
            element={
              <ProtectedRoute allowedUserTypes={['startup']}>
                <TaxCompliance />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/funding"
            element={
              <ProtectedRoute allowedUserTypes={['startup']}>
                <Funding />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/payments"
            element={
              <ProtectedRoute allowedUserTypes={['startup']}>
                <Payments />
              </ProtectedRoute>
            }
          />
          
          {/* Investor Only Routes */}
          <Route
            path="/explore-startups"
            element={
              <ProtectedRoute allowedUserTypes={['investor']}>
                <ExploreStartups />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/payment"
            element={
              <ProtectedRoute allowedUserTypes={['investor']}>
                <PaymentGateway />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/meeting/:meetingId"
            element={
              <ProtectedRoute>
                <Meeting />
              </ProtectedRoute>
            }
          />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;