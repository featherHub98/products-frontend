import React, { useState, useEffect } from 'react';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';


interface AuthUser {
  id: string;
  username: string;
  email: string;
  roles: string;
  realmId?: string;
}

interface AuthUsersResponse {
  users: AuthUser[];
}

const AuthUsersDashboard: React.FC = () => {
  const [authUsers, setAuthUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  const [createForm, setCreateForm] = useState({
    username: '',
    email: '',
    password: '',
    roles: '',
  });
  
  const [updateForm, setUpdateForm] = useState<AuthUser & { password?: string }>({
    id: '',
    username: '',
    email: '',
    roles: '',
    realmId: '',
  });

  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchAuthUsers = async () => {
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
        const response = await axios.get<AuthUsersResponse>('http://localhost:2000/auth/users');
        setAuthUsers(response.data.users);
      } catch (err) {
        setError('Failed to fetch auth users');
        console.error('Error fetching auth users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
      
      await axios.post('http://localhost:2000/auth/users', createForm);
      setCreateForm({ username: '', email: '', password: '', roles: '' });
      setShowCreateModal(false);
      
      const response = await axios.get<AuthUsersResponse>('http://localhost:2000/auth/users');
      setAuthUsers(response.data.users);
    } catch (err: any) {
      setError('Failed to create user. Please try again.');
      console.error('Error creating user:', err);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
      
      const updateData = { ...updateForm };
      if (!updateData.password) {
        delete updateData.password;
      }
      
      await axios.put(`http://localhost:2000/auth/users/${updateForm.id}`, updateData);
      setShowUpdateModal(false);
      
      const response = await axios.get<AuthUsersResponse>('http://localhost:2000/auth/users');
      setAuthUsers(response.data.users);
    } catch (err: any) {
      setError('Failed to update user. Please try again.');
      console.error('Error updating user:', err);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
      await axios.delete(`http://localhost:2000/auth/users/${id}`);
      
      const response = await axios.get<AuthUsersResponse>('http://localhost:2000/auth/users');
      setAuthUsers(response.data.users);
    } catch (err: any) {
      setError('Failed to delete user. Please try again.');
      console.error('Error deleting user:', err);
    }
  };

  const openUpdateModal = (user: AuthUser) => {
    setUpdateForm({
      ...user,
      password: '',
    });
    setShowUpdateModal(true);
  };

  useEffect(() => {
    if (showCreateModal || showUpdateModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showCreateModal, showUpdateModal]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      
      
      <div className="content-wrapper">
        <h1>Auth Users</h1>

        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => setError('')}></button>
          </div>
        )}

        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Roles</th>
              <th>
                <button 
                  id="create-btn" 
                  className="btn btn-primary"
                  onClick={() => setShowCreateModal(true)}
                >
                  Add User
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {authUsers.length > 0 ? (
              authUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.roles}</td>
                  <td>
                    <button 
                      className="btn btn-warning btn-sm me-2 update-btn"
                      onClick={() => openUpdateModal(user)}
                    >
                      Update
                    </button>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {showCreateModal && (
          <>
            <div className="modal-backdrop fade show"></div>
            <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Create Auth User</h5>
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setShowCreateModal(false)}
                    ></button>
                  </div>
                  <form onSubmit={handleCreateUser}>
                    <div className="modal-body">
                      <div className="mb-3">
                        <label htmlFor="createUsername" className="form-label">
                          Username:
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="createUsername"
                          value={createForm.username}
                          onChange={(e) => setCreateForm({...createForm, username: e.target.value})}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="createEmail" className="form-label">
                          Email:
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="createEmail"
                          value={createForm.email}
                          onChange={(e) => setCreateForm({...createForm, email: e.target.value})}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="createPassword" className="form-label">
                          Password:
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          id="createPassword"
                          value={createForm.password}
                          onChange={(e) => setCreateForm({...createForm, password: e.target.value})}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="createRoles" className="form-label">
                          Roles (comma-separated):
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="createRoles"
                          value={createForm.roles}
                          onChange={(e) => setCreateForm({...createForm, roles: e.target.value})}
                          required
                        />
                        <small className="text-muted">Example: admin,user</small>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="submit" className="btn btn-primary">
                        Create User
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={() => setShowCreateModal(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
        )}

        {showUpdateModal && (
          <>
            <div className="modal-backdrop fade show"></div>
            <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Update Auth User</h5>
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setShowUpdateModal(false)}
                    ></button>
                  </div>
                  <form onSubmit={handleUpdateUser}>
                    <div className="modal-body">
                      <input type="hidden" id="updateId" value={updateForm.id} />
                      
                      <div className="mb-3">
                        <label htmlFor="updateUsername" className="form-label">
                          Username:
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="updateUsername"
                          value={updateForm.username}
                          onChange={(e) => setUpdateForm({...updateForm, username: e.target.value})}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="updateEmail" className="form-label">
                          Email:
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="updateEmail"
                          value={updateForm.email}
                          onChange={(e) => setUpdateForm({...updateForm, email: e.target.value})}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="updatePassword" className="form-label">
                          Password (leave blank to keep current):
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          id="updatePassword"
                          value={updateForm.password || ''}
                          onChange={(e) => setUpdateForm({...updateForm, password: e.target.value})}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="updateRoles" className="form-label">
                          Roles (comma-separated):
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="updateRoles"
                          value={updateForm.roles}
                          onChange={(e) => setUpdateForm({...updateForm, roles: e.target.value})}
                          required
                        />
                        <small className="text-muted">Example: admin,user</small>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="submit" className="btn btn-warning">
                        Save Changes
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={() => setShowUpdateModal(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AuthUsersDashboard;