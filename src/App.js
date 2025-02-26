import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register';
import DashboardRouter from './components/DashboardRouter';
import ProtectedRoute from './components/ProtectedRoute';
import FinancialTools from './components/financial/FinancialTools';
import TaxCompliance from './components/TaxCompliance';
import Funding from './components/Funding';
import Loans from './components/Loans';
import Community from './components/Community';
import Layout from './components/Layout';
import './App.css';

const App = () => {
  return (
    <Router>
      <Layout>
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
          
          {/* Protected Routes */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/financial-tools"
            element={
              <ProtectedRoute>
                <FinancialTools />
              </ProtectedRoute>
            }
          />
          <Route
            path="/meetings"
            element={
              <ProtectedRoute>
                <div>Meetings Page</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/loans"
            element={
              <ProtectedRoute>
                <Loans />
              </ProtectedRoute>
            }
          />
          <Route
            path="/schemes"
            element={
              <ProtectedRoute>
                <div>Schemes Page</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tax-filing"
            element={
              <ProtectedRoute>
                <div>Tax Filing Page</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/compliance"
            element={
              <ProtectedRoute>
                <div>Compliance Page</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tax-compliance"
            element={
              <ProtectedRoute>
                <TaxCompliance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/funding"
            element={
              <ProtectedRoute>
                <Funding />
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
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;