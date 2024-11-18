
import './Navbar.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo/0.png';

const Navbar = ({ cartItems }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Calculate total items in cart
  const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="navbar">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          
          {/* Mobile menu button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-black hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>

          {/* Centered clickable logo */}
          <div className="nav-logo">
            <Link to="/" className="flex-shrink-0">
              <img
                className="block h-10 w-10"
                src={logo} // Replace with your logo's path
                alt="logo"
              />
            </Link>
          </div>

          {/* Right-side: Track Package and Cart */}
          <div className="right-side">
            <Link to="/track-package" className="hidden sm:inline-block text-black hover:text-gray-700 font-medium">
              Track Package
            </Link>

            {/* Cart icon with Link */}
            <Link to="/cart" className="relative">
              <span className="sr-only">View cart</span>
              <svg className="h-6 w-6 text-black hover:text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L6.1 6h13.8m-8.9 9a2 2 0 100 4 2 2 0 000-4zm6 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              {totalItemsInCart > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {totalItemsInCart}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Track Package link in mobile menu */}
            <Link to="/track-package" className="text-black hover:bg-gray-200 hover:text-gray-700 block px-3 py-2 rounded-md text-base font-medium">Track Package</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
