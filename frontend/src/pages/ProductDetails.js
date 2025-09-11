import React from 'react';
import { useParams, Link } from 'react-router-dom';
import products from '../data/productsData';
import './ProductDetails.css';
import { useCart } from '../context/CartContext';

const renderStars = (rating) => {
  const stars = [];
  const rounded = Math.floor(rating);
  for (let i = 0; i < rounded; i++) stars.push('★');
  if (rating - rounded >= 0.5) stars.push('☆');
  while (stars.length < 5) stars.push('☆');
  return stars.join(' ');
};

const ProductDetails = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === parseInt(id));
  const { addToCart } = useCart();

  if (!product) return <h2 className="not-found">❌ Product not found</h2>;

  return (
    <div className="product-detail-container">
      <div className="product-detail-card">
        <img src={product.image} alt={product.name} className="product-image" />
        <div className="product-info">
          <h2>{product.name}</h2>
          <p><strong>Price:</strong> ₹{product.price}/kg</p>
          <p><strong>Description:</strong> {product.description || 'No description available.'}</p>
          <p>
            <strong>Rating:</strong>{' '}
            <span style={{ color: '#ffc107', fontSize: '1.2em' }}>
              {product.rating ? renderStars(product.rating) : 'No ratings yet'}
            </span>
            {product.rating && (
              <span style={{ color: '#333', marginLeft: 8 }}>
                ({product.rating}/5)
              </span>
            )}
          </p>
          <div>
            <strong>Reviews:</strong>
            <ul style={{ paddingLeft: 18 }}>
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((review, idx) => (
                  <li key={idx}>
                    <b>{review.user}:</b> {review.comment}
                  </li>
                ))
              ) : (
                <li>No reviews yet.</li>
              )}
            </ul>
          </div>

          <div className="actions">
            <Link to="/products">
              <button className="back-btn">← Back to Products</button>
            </Link>
            <button onClick={() => addToCart(product)} className="add-cart-btn">
              🛒 Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
