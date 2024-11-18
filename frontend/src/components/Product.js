import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// Product.js

const Product = ({ name, description, price, images, sizes, colors, addToCart, variations }) => {
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [addedToCart, setAddedToCart] = useState(false);

  // Get stock for the selected color and size
  const getStockForSize = (size) => {
    const variant = variations.find(
      (v) => v.color === selectedColor && v.size === size
    );
    return variant ? variant.stock : 0;
  };

  const handleAddToCart = () => {
    const selectedVariant = variations.find(
      (variant) => variant.color === selectedColor && variant.size === selectedSize
    );

    if (selectedVariant && selectedVariant.stock > 0) {
      const product = {
        name,
        description,
        price,
        image: images[selectedColor],
        variations,  // Pass variations to access stock data
      };
      addToCart(product, selectedColor, selectedSize);
      setAddedToCart(true);
    } else {
      alert("Selected item is out of stock.");
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden mb-10">
      <img
        src={images[selectedColor]}
        alt={`${name} - ${selectedColor}`}
        className="w-full h-48 object-contain"
      />

      <div className="p-4">
        <h2 className="text-lg font-bold">{name}</h2>
        <p className="text-gray-600 text-sm">{description}</p>
        <p className="text-gray-900 text-xl font-bold">${price}</p>

        {/* Color Picker */}
        <div className="mt-4">
          <span className="text-sm">Color:</span>
          <div className="flex space-x-2 mt-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-6 h-6 rounded-full border-2 ${selectedColor === color ? 'border-black' : 'border-gray-300'}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Size Picker with Stock Information */}
        <div className="mt-4">
          <span className="text-sm">Size:</span>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="block mt-2 p-2 border border-gray-300 rounded-md"
          >
            {sizes.map((size) => {
              const stock = getStockForSize(size);
              return (
                <option key={size} value={size} disabled={stock <= 0}>
                  {size} {stock > 0 ? `(${stock} in stock)` : "(Out of stock)"}
                </option>
              );
            })}
          </select>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex space-x-2">
          <button
            onClick={handleAddToCart}
            className="w-1/2 bg-black text-white p-2 rounded-md hover:bg-gray-800"
            disabled={!variations.some(variant => variant.color === selectedColor && variant.size === selectedSize && variant.stock > 0)}
          >
            {variations.some(variant => variant.color === selectedColor && variant.size === selectedSize && variant.stock > 0)
                ? "Add to Cart"
                : "Out of Stock"}
          </button>
          
          {addedToCart && (
            <Link to="/cart" className="w-1/2 bg-blue-500 text-white p-2 rounded-md text-center hover:bg-blue-600">
              View Cart
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
