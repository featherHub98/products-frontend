import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import axios from 'axios';

const NavigationBar: React.FC = () => {
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await axios.post('http://localhost:2000/auth/logout');
      }
      
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    } catch (err: any) {
      console.error('Logout error:', err);

      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
  };

  const isActive = (path: string) => {
    return window.location.pathname === path;
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow">
      <Container fluid>
        <Navbar.Brand href="/" className="fw-bold">
          Admin Dashboard
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="main-navbar" />
        
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link 
              href="/auth/users" 
              active={isActive('/auth/users')}
              className={isActive('/auth/users') ? 'fw-bold' : ''}
            >
              Auth Users
            </Nav.Link>
            <Nav.Link 
              href="/realms/dashboard"
              active={isActive('/realms/dashboard')}
              className={isActive('/realms/dashboard') ? 'fw-bold' : ''}
            >
              Realms
            </Nav.Link>
          </Nav>
          
          <Nav>
            <Button 
              variant="outline-light" 
              onClick={handleLogout}
              size="sm"
            >
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;