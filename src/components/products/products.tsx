import React, { useState, useEffect } from 'react';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';


interface Product {
  id: string;
  name: string;
  price: string;
  
}

interface ProductsResponse {
  products: Product[];
}

const ProductsDashboard: React.FC = () => {
 
  const [Products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  const [createForm, setCreateForm] = useState({
    name: '',
    price: '',
    
  });
  
  const [updateForm, setUpdateForm] = useState<Product & { price?: string }>({
    id:'',
    name: '',
    price: '',
    
  });

  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [filteredProducts,setFilteredProducts] = useState<string>('')
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
        const response = await axios.get<ProductsResponse>('http://localhost:2500/products');
        setProducts(response.data.products);
      } catch (err) {
        setError('Failed to fetch auth products');
        console.error('Error fetching auth products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleCreateproduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
     
      axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
      
      await axios.post('http://localhost:2500/products', createForm);
      setCreateForm({ name: '', price: ''});
      setShowCreateModal(false);
      
      const response = await axios.get<ProductsResponse>('http://localhost:2500/products');
      setProducts(response.data.products);
    } catch (err: any) {
      setError('Failed to create product. Please try again.');
      console.error('Error creating product:', err);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
      
      const updateData = { ...updateForm };
      
      
      await axios.put(`http://localhost:2500/products/${updateForm.id}`, updateData);
      setShowUpdateModal(false);
      
      const response = await axios.get<ProductsResponse>('http://localhost:2500/products');
      setProducts(response.data.products);
    } catch (err: any) {
      setError('Failed to update product. Please try again.');
      console.error('Error updating product:', err);
    }
  };

  const handleDeleteproduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
      await axios.delete(`http://localhost:2500/products/${id}`);
      
      const response = await axios.get<ProductsResponse>('http://localhost:2500/products');
      setProducts(response.data.products);
    } catch (err: any) {
      setError('Failed to delete product. Please try again.');
      console.error('Error deleting product:', err);
    }
  };

  const openUpdateModal = (product: Product) => {
    setUpdateForm({
      ...product,
      price: '',
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

  const filterProducts = (Products:any)=>{
    return Products.filter((product:any)=> product.name.includes(filteredProducts) )
  }

  return (
    <>
      
      
      <div className="content-wrapper">
        <h1>Auth products</h1>

        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => setError('')}></button>
          </div>
        )}
        <input type='text' placeholder='filter by name' onChange={(e)=>setFilteredProducts(e.target.value)}></input>
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>name</th>
              <th>Price</th>
              <th>
                <button 
                  id="create-btn" 
                  className="btn btn-primary"
                  onClick={() => setShowCreateModal(true)}
                >
                  Add Product
                </button>
              </th>
              
            </tr>
          </thead>
          <tbody>
            {Products.length > 0 ? (
              
              filterProducts(Products).map((product:Product) => (
                <tr key={product.id}>
                  
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  
                  <td>
                    <button 
                      className="btn btn-warning btn-sm me-2 update-btn"
                      onClick={() => openUpdateModal(product)}
                    >
                      Update
                    </button>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteproduct(product.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center">
                  No products found
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
                    <h5 className="modal-title">Create product</h5>
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setShowCreateModal(false)}
                    ></button>
                  </div>
                  <form onSubmit={handleCreateproduct}>
                    <div className="modal-body">
                      
                      <div className="mb-3">
                        <label htmlFor="createName" className="form-label">
                          Name:
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="createName"
                          value={createForm.name}
                          onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="createPrice" className="form-label">
                          Price:
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="createPrice"
                          value={createForm.price}
                          onChange={(e) => setCreateForm({...createForm, price: e.target.value})}
                          required
                        />
                      </div>
                        </div>
                    <div className="modal-footer">
                      <button type="submit" className="btn btn-primary">
                        Create product
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
                    <h5 className="modal-title">Update product</h5>
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setShowUpdateModal(false)}
                    ></button>
                  </div>
                  <form onSubmit={handleUpdateProduct}>
                    <div className="modal-body">
                      <input type="hidden" id="updateId" value={updateForm.id} />
                      
                      <div className="mb-3">
                        <label htmlFor="updatename" className="form-label">
                          name:
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="updatename"
                          value={updateForm.name}
                          onChange={(e) => setUpdateForm({...updateForm, name: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="updatePrice" className="form-label">
                          Price (leave blank to keep current):
                        </label>
                        <input
                          type="price"
                          className="form-control"
                          id="updatePrice"
                          value={updateForm.price || ''}
                          onChange={(e) => setUpdateForm({...updateForm, price: e.target.value})}
                        />
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

export default ProductsDashboard;