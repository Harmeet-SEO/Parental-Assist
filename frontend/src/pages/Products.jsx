
import React, { useState, useEffect } from "react";
import "./Products.css";
import productsData from "../data/productsData";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function Products() {
  const [filters, setFilters] = useState({ age: "", price: "", category: "" });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showTopButton, setShowTopButton] = useState(false);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setShowModal(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowTopButton(true);
      } else {
        setShowTopButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredProducts = productsData.filter((product) => {
    const matchAge = !filters.age || product.ageGroup === filters.age;
    const matchPrice =
      !filters.price ||
      (filters.price === "low" && product.price < 2000) ||
      (filters.price === "medium" && product.price >= 2000 && product.price <= 5000) ||
      (filters.price === "high" && product.price > 5000);
    const matchCategory =
      !filters.category || product.category.toLowerCase() === filters.category.toLowerCase();

    return matchAge && matchPrice && matchCategory;
  });

  return (
    <>
      <Navbar />
      <main className="products-page">
        <Link to="/" className="home-icon">🏠</Link>
        <h1 className="products-title">✨ Browse Our Curated Products</h1>
        <p className="products-subtitle">Smart picks to support your child's growth and your parenting journey.</p>

        <div className="filter-panel">
          <div className="filter-group">
            <label htmlFor="age">Age</label>
            <select name="age" value={filters.age} onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="0-2">0-2</option>
              <option value="3-5">3-5</option>
              <option value="6-8">6-8</option>
              <option value="9+">9+</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="price">Price</label>
            <select name="price" value={filters.price} onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="low">Low (&lt; ₹2000)</option>
              <option value="medium">Medium (₹2000 - ₹5000)</option>
              <option value="high">High (&gt; ₹5000)</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="category">Category</label>
            <select name="category" value={filters.category} onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="toys">Toys</option>
              <option value="books">Books</option>
              <option value="clothing">Clothing</option>
              <option value="gear">Gear</option>
            </select>
          </div>
        </div>

        <div className="product-grid">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => openModal(product)}
            >
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>₹{product.price}</p>
            </div>
          ))}
        </div>

        {showModal && selectedProduct && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-button" onClick={closeModal}>X</button>
              <img src={selectedProduct.image} alt={selectedProduct.name} />
              <h2>{selectedProduct.name}</h2>
              <p>Price: ₹{selectedProduct.price}</p>
              <p>Category: {selectedProduct.category}</p>
              <p>Age Group: {selectedProduct.ageGroup}</p>
              <p>Description: {selectedProduct.description}</p>
            </div>
          </div>
        )}

        {showTopButton && (
          <button
            className="back-to-top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            ↑ Back to Top
          </button>
        )}

      </main>
    </>
  );
}
