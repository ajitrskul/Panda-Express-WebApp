import React, { useState, useEffect } from "react";
import { SidebarManager } from './components/SidebarManager';
import '../../styles/manager.css';
import api from '../../services/api'; 

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [newProduct, setNewProduct] = useState(null);
  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    const authenticate = async () => {
      try {
        const response = await api.get("/auth/manager/permission");
        if (response.data.authenticate) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch (error) {
        console.error("Error Authenticating", error);
        setAuthenticated(false); // Deny access on error
      }
    };
    authenticate();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/manager/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = async (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (term === "") {
      const response = await api.get("/manager/products");
      setProducts(response.data);
    } else {
      const filtered = products.filter((item) =>
        item.name.toLowerCase().includes(term)
      );
      setProducts(filtered);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await api.post("/manager/products/delete", { id });
      window.location.reload();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleInputChange = (e, field) => {
    const { value, type, checked } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [field]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCardClick = (product) => {
    setNewProduct(product);
  };

  const saveModal = async (e) => {
    e.preventDefault();
    try {
      await api.post("/manager/products/update", newProduct);
      window.location.reload();
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      closeModal();
    }
  };

  const closeModal = async () => {
    setNewProduct(null);
  };

  if (authenticated === null) {
    return <div>Checking Permission...</div>;
  }

  if (!authenticated) {
    return <div>Access Denied</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-fluid page">
      <SidebarManager />
      <div className="page-background-container">
        <div className="container page-background">
          <h2 className="page-title text-center">Product Management</h2>
          <hr className="page-divider-big" />
          <div className="d-flex justify-content-between align-items-center mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              className="form-control w-50"
              placeholder="Search Products"
            />
          </div>
          <div className="row">
            {products.map((item) => (
              <div
                key={item.product_name}
                className={`col-12 col-sm-6 col-md-4 col-lg-3 mb-4`}
                onClick={() => handleCardClick(item)}
              >
                <div className="card h-100 w-100 d-flex justify-content-center align-items-center bg-white inventory-card">
                  <div className="card-body">
                    <h5 className="card-text">{item.product_name}</h5>
                    <button
                        onClick={() => deleteProduct(item.product_id)}
                        className="btn btn-danger delete-button"
                      >
                        Delete
                      </button>
                  </div>
                </div>
              </div>
            ))}
            <div
              className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
              onClick={() => handleCardClick({ })}
            >
              <div className="card h-100 w-100 text-center d-flex justify-content-center align-items-center bg-a3080c inventory-card">
                <div className="card-body">
                  <h5 className="card-text text-center">Add New Product</h5>
                </div>
              </div>
            </div>
          </div>
          {newProduct && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={(e) => saveModal(e)} className="form-product">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Product Name</label>
                  <input
                    type="text"
                    className="form-control text-center"
                    value={newProduct.product_name}
                    onChange={(e) => handleInputChange(e, "product_name")}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Type</label>
                  <input
                    type="text"
                    className="form-control text-center"
                    value={newProduct.type}
                    onChange={(e) => handleInputChange(e, "type")}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Servings Remaining</label>
                  <input
                    type="number"
                    className="form-control text-center"
                    value={newProduct.servings_remaining}
                    onChange={(e) => handleInputChange(e, "servings_remaining")}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Allergens</label>
                  <input
                    type="text"
                    className="form-control text-center"
                    value={newProduct.allergens}
                    onChange={(e) => handleInputChange(e, "allergens")}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Display Icons</label>
                  <input
                    type="number"
                    className="form-control text-center"
                    value={newProduct.display_icons}
                    onChange={(e) => handleInputChange(e, "display_icons")}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Product Description</label>
                  <input
                    type="text"
                    className="form-control text-center"
                    value={newProduct.product_description}
                    onChange={(e) => handleInputChange(e, "product_description")}
                    required
                  ></input>
                </div>
                <div className="col-md-6 mb-3">
                  <label>Premium Addition</label>
                  <input
                    type="number"
                    className="form-control text-center"
                    value={newProduct.premium_addition}
                    onChange={(e) => handleInputChange(e, "premium_addition")}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Serving Size</label>
                  <input
                    type="number"
                    className="form-control text-center"
                    value={newProduct.serving_size}
                    onChange={(e) => handleInputChange(e, "serving_size")}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Calories</label>
                  <input
                    type="number"
                    className="form-control text-center"
                    value={newProduct.calories}
                    onChange={(e) => handleInputChange(e, "calories")}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Saturated Fat</label>
                  <input
                    type="number"
                    className="form-control text-center"
                    value={newProduct.saturated_fat}
                    onChange={(e) => handleInputChange(e, "saturated_fat")}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Carbohydrate</label>
                  <input
                    type="number"
                    className="form-control text-center"
                    value={newProduct.carbohydrate}
                    onChange={(e) => handleInputChange(e, "carbohydrate")}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Protein</label>
                  <input
                    type="number"
                    className="form-control text-center"
                    value={newProduct.protein}
                    onChange={(e) => handleInputChange(e, "protein")}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Image</label>
                  <input
                    type="text"
                    className="form-control text-center"
                    value={newProduct.image}
                    onChange={(e) => handleInputChange(e, "image")}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Price Per Case</label>
                  <input
                    type="number"
                    className="form-control text-center"
                    value={newProduct.cpc}
                    onChange={(e) => handleInputChange(e, "cpc")}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="check-label">Premium</label>
                  <input
                    type="checkbox"
                    checked={newProduct.is_premium}
                    onChange={(e) => handleInputChange(e, "is_premium")}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="check-label">Seasonal</label>
                  <input
                    type="checkbox"
                    checked={newProduct.is_seasonal}
                    onChange={(e) => handleInputChange(e, "is_seasonal")}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="check-label">Available</label>
                  <input
                    type="checkbox"
                    checked={newProduct.is_available}
                    onChange={(e) => handleInputChange(e, "is_available")}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
}

export default Products;
