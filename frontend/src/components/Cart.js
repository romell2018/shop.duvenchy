import React from 'react';
import { Link } from 'react-router-dom';

const Cart = ({ cartItems, updateQuantity, removeFromCart }) => {
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold text-center my-8">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <div>
          <ul>
            {cartItems.map((item, index) => (
              <li key={`${item.name}-${item.color}-${item.selectedSize}`} className="flex justify-between items-center mb-4">
                
                {/* Item Image and Details */}
                <div className="flex items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover mr-4"
                  />
                  <div>
                    <span>{item.name} - {item.color} - {item.selectedSize}</span>
                    <br />
                    <span>Quantity: {item.quantity}</span>
                    <br />
                    <span>Price: ${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Quantity Controls */}
                <div className="flex space-x-2 items-center">
                  {/* <button
                    onClick={() => updateQuantity(index, item.quantity - 1)}
                    className="bg-gray-200 p-2 rounded"
                    disabled={item.quantity <= 1}
                  > */}
                    -
                  {/* </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(index, item.quantity + 0)}
                    className="bg-gray-200 p-2 rounded"
                  >
                    +  </button> */}
                 
                  <button
                    onClick={() => removeFromCart(index)}
                    className="bg-red-500 text-white p-2 rounded"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="text-right mt-6">
            <span className="font-bold">Subtotal: ${subtotal.toFixed(2)}</span>
            <br />
            <Link to="/checkout">
              <button className="bg-black text-white p-2 mt-4 inline-block rounded hover:bg-gray-800">
                Checkout
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
