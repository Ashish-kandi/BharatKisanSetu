  import React, { useState } from 'react';
  import ProductCard from '../components/ProductCard';
  import productsData from '../data/productsData';
  import VoiceCommand from '../components/VoiceCommand';
  import './ProductsPage.css';

  const ProductsPage = ({ addToCart }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Filter products by search
    const filteredProducts = productsData.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="container py-5 products-page">
        <VoiceCommand />

        <h2 className="text-center mb-4">🛍️ Our Fresh Products</h2>

        {/* 🔍 Search Box */}
        <div className="row justify-content-center mb-4">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Search for a product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* 🧺 Product Grid */}
        <div className="row">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="col-md-3 col-sm-6 mb-4">
                <ProductCard product={product} addToCart={addToCart} />
              </div>
            ))
          ) : (
            <div className="text-center w-100">
              <p>No products found.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  export default ProductsPage;
