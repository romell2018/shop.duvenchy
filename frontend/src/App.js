import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import PackageTracker from './components/PackageTracker';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function App() {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, color, size) => {
    setCartItems((prevItems) => {
      const stock = product.variations.find(
        (variant) => variant.color === color && variant.size === size
      )?.stock;

      if (stock === undefined || stock <= 0) {
        alert('This item is out of stock.');
        return prevItems;
      }

      const existingItemIndex = prevItems.findIndex(
        (item) => item.name === product.name && item.color === color && item.size === size
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        const currentQuantity = updatedItems[existingItemIndex].quantity;

        if (currentQuantity + 1 > stock) {
          alert('You cannot add more than the available stock.');
          return prevItems;
        }

        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: currentQuantity + 1,
        };
        return updatedItems;
      } else {
        return [...prevItems, { ...product, color, size, quantity: 1 }];
      }
    });
  };

  // Calculate total amount
  const calculateTotalAmount = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Remove item from cart by index
  const removeFromCart = (index) => {
    setCartItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  // Update quantity for a specific item
  const updateQuantity = (index, newQuantity) => {
    setCartItems((prevItems) => {
      const updatedItems = [...prevItems];
      if (newQuantity > 0) {
        updatedItems[index].quantity = newQuantity;
      } else {
        // Remove item if quantity is set to 0
        updatedItems.splice(index, 1);
      }
      return updatedItems;
    });
  };

  return (
    <Router>
      <div className="App">
        <Navbar cartItems={cartItems} />
        <main className="mt-16">
          <Routes>
            <Route path="/" element={<ProductList addToCart={addToCart} />} />
            <Route 
              path="/cart" 
              element={<Cart cartItems={cartItems} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />} 
            />
            <Route 
              path="/checkout" 
              element={
                <Elements stripe={stripePromise}>
                  <Checkout cartItems={cartItems} totalAmount={calculateTotalAmount()} />
                </Elements>
              } 
            />
            <Route path="/track-package" element={<PackageTracker />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
