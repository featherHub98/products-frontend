import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import NavigationBar from './components/navbar/navBar';
import AuthUsersDashboard from './components/products/products';
import Login from './components/login/login';


const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <NavigationBar />
        
        <Container fluid className="mt-4 px-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/auth/users" element={
              <PrivateRoute>
                <AuthUsersDashboard />
              </PrivateRoute>
            } />
            
            
            
            <Route path="/" element={
              <PrivateRoute>
                <Navigate to="/auth/users" replace />
              </PrivateRoute>
            } />
          </Routes>
        </Container>
      </div>
    </Router>
  );
};

export default App;