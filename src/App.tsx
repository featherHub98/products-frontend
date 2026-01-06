import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {getUserRoles, verifyToken} from './services/JwtService'
import NavigationBar from './components/navbar/navBar';
import ProductsDashboard from './components/products/products';
import Login from './components/login/login';
import Dashboard from './components/dashboard/dashboard';


  interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

 
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredRole }) => {
  const isAuthenticated = verifyToken();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    const userRoles = getUserRoles();
    if (!userRoles.includes(requiredRole)) {
      return <Navigate to="/dashboard" replace />;
    }
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
            
           <Route path="/products" element={
              <PrivateRoute requiredRole='admin'>
                <ProductsDashboard />
              </PrivateRoute>
            } />
            <Route path="/dashboard" element={<Dashboard />} />
            
            
          
          </Routes>
        </Container>
      </div>
    </Router>
  );
};

export default App;