import React, { useState, useEffect } from "react";
import { SidebarManager } from './components/SidebarManager';
import '../../styles/manager.css';
import api from '../../services/api'; 
import { Modal, Button } from "react-bootstrap";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [newProduct, setNewProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);

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
        item.product_name.toLowerCase().includes(term)
      );
      setProducts(filtered);
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

    if (!newProduct?.type || newProduct.type === "") {
      alert("Please select a valid product type.");
      return;
    }

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

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleDeactivate = (product) => {
    setSelectedProduct(product);
    setShowDeactivateModal(true);
  };

  const handleActivate = (product) => {
    setSelectedProduct(product);
    setShowActivateModal(true);
  };

  const confirmDeactivate = async () => {
    try {
      await api.post("/manager/products/delete", { id: selectedProduct.product_id });
      setShowDeactivateModal(false);
      setSelectedProduct(null);
      window.location.reload();
    } catch (error) {
      console.error("Error deactivating product:", error);
    }
  };

  const confirmActivate = async () => {
    try {
      await api.post("/manager/products/activate", { id: selectedProduct.product_id });
      setShowActivateModal(false);
      setSelectedProduct(null);
      window.location.reload();
    } catch (error) {
      console.error("Error reactivating product:", error);
    }
  };

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
            <button
              onClick={() => handleCardClick({ })}
              className="btn btn-success"
            >
              +
            </button>
          </div>
          <div className="row">
            {products.map((item) => (
              <div
                key={item.product_name}
                className={`col-12 col-sm-6 col-md-4 col-lg-3 mb-4`}
              >
                <div className="card h-100 w-100 d-flex justify-content-center align-items-center bg-white hover-zoom inventory-card">
                  <div className="card-body">
                    <h5 className="card-text" style={{fontSize: '1.25rem'}}>{item.product_name}</h5>
                    <img src={item.image} className="card-img-top" alt={item.product_name} />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(item);
                      }}
                      className="btn btn-primary edit-button"
                      style={{paddingRight: '10px', marginRight: '5px'}}
                    >
                      <i class="bi bi-pencil-square"></i>
                    </button>
                    {item.in_season && (<button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeactivate(item);
                        }}
                        className="btn btn-danger delete-button"
                      >
                        X
                      </button>)}
                    {!item.in_season && (<button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActivate(item);
                        }}
                        className="btn btn-success delete-button"
                      >
                        ✓
                      </button>)}
                  </div>
                </div>
              </div>
            ))}
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
                    placeholder="E.g., Sugar Chicken"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Type</label>
                  <select
                    className="form-control text-center"
                    value={newProduct?.type || ""}
                    onChange={(e) => handleInputChange(e, "type")}
                    required
                  >
                    <option value="" disabled>
                      Select Option
                    </option>
                    <option value="side">Side</option>
                    <option value="entree">Entree</option>
                    <option value="appetizer">Appetizer</option>
                    <option value="dessert">Dessert</option>
                    <option value="fountainDrink">Fountain Drink</option>
                    <option value="drink">Drink</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label>Servings Remaining</label>
                  <input
                    type="number"
                    className="form-control text-center"
                    value={newProduct.servings_remaining}
                    onChange={(e) => handleInputChange(e, "servings_remaining")}
                    required
                    placeholder="E.g., 50"
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
                    placeholder="E.g., Contains Nuts"
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
                    placeholder="E.g., 3"
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
                    placeholder="E.g., A classic dish"
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
                    placeholder="E.g., 2.00"
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
                    placeholder="E.g., 100"
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
                    placeholder="E.g., 100"
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
                    placeholder="E.g., 100"
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
                    placeholder="E.g., 100"
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
                    placeholder="E.g., 100"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Image URL</label>
                  <input
                    type="text"
                    className="form-control text-center"
                    value={newProduct.image}
                    onChange={(e) => handleInputChange(e, "image")}
                    required
                    placeholder="E.g., www.site.com/img.jpg"
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
                    placeholder="E.g., 12.99"
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
                className="btn btn-success"
              >
                Add Product
              </button>
            </form>
          </div>
        </div>
      )}
        </div>
      </div>
      <Modal show={showDeactivateModal} onHide={() => setShowDeactivateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Deactivate Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to deactivate <strong>{selectedProduct?.product_name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeactivateModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeactivate}>
            Deactivate
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showActivateModal} onHide={() => setShowActivateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reactivate Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to reactivate <strong>{selectedProduct?.product_name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowActivateModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={confirmActivate}>
            Activate
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Products;