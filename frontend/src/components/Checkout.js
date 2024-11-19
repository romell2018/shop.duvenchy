import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './Checkout.css'; // Ensure you have CSS for styling

const Checkout = ({ cartItems, totalAmount }) => {

    const apiBaseUrl = process.env.REACT_APP_BACKEND_URL;

    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);  // Corrected this line
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [shippingCost] = useState(5.99); // Placeholder for shipping cost
    const [taxRate] = useState(0.08); // 8% tax rate, adjust as needed

    // Shipping info state
    const [shippingInfo, setShippingInfo] = useState({
        name: '',
        address: '',
        city: '',
        zip: ''
    });

    // Billing info state
    const [billingInfo, setBillingInfo] = useState({
        name: '',
        address: '',
        city: '',
        zip: ''
    });

    // State for toggling "same as shipping"
    const [sameAsShipping, setSameAsShipping] = useState(false);

    // Calculate subtotal
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = subtotal * taxRate;
    const orderTotal = subtotal + shippingCost + tax;

    // Handle submitting the payment form
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null); // Reset error before starting

        const cardElement = elements.getElement(CardElement);

        if (!stripe || !cardElement) {
            setLoading(false);
            return;
        }

        // Create a payment intent with your server
        const response = await fetch(`${apiBaseUrl}/create-payment-intent`, { // Change this to your backend URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount: totalAmount * 100 }) // Amount in cents
        });

        const paymentData = await response.json();

        if (paymentData.error) {
            setError(paymentData.error);
            setLoading(false);
            return;
        }

        const { clientSecret } = paymentData;

        // Confirm the payment
        const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    name: billingInfo.name || 'Customer Name', // Replace with actual billing name
                },
            },
        });

        if (stripeError) {
            setError(stripeError.message);
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);
            console.log('Payment Successful!');
        }
    };

    // Handle shipping and billing info changes
    const handleShippingChange = (e) => {
        setShippingInfo({
            ...shippingInfo,
            [e.target.name]: e.target.value,
        });
    };

    const handleBillingChange = (e) => {
        setBillingInfo({
            ...billingInfo,
            [e.target.name]: e.target.value,
        });
    };

    // Handle same as shipping toggle
    const handleSameAsShippingChange = () => {
        setSameAsShipping(!sameAsShipping);
        if (!sameAsShipping) {
            setBillingInfo(shippingInfo); // Automatically copy shipping to billing when checked
        } else {
            setBillingInfo({ name: '', address: '', city: '', zip: '' }); // Clear billing when unchecked
        }
    };

    return (
        <div className="checkout-container">
            <h2 className="checkout-title">Order Summary</h2>

            <div className="order-summary">
                <div className="product-details">
                    <h3>Product Details</h3>
                    <ul>
                        {cartItems.map((item) => (
                            <li key={item.id}>
                                <span>{item.name}</span> - {item.color} - {item.size} - Quantity: {item.quantity} - ${item.price.toFixed(2)}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="pricing-details">
                    <h3>Pricing Breakdown</h3>
                    <div className="pricing-item">
                        <span>Subtotal:</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="pricing-item">
                        <span>Shipping:</span>
                        <span>${shippingCost.toFixed(2)}</span>
                    </div>
                    <div className="pricing-item">
                        <span>Tax:</span>
                        <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="total">
                        <span>Total:</span>
                        <span>${orderTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <h2 className="checkout-title">Contact & Delivery Information</h2>
            <form onSubmit={handleSubmit} className="checkout-form">
                {/* Contact Info */}
                <label htmlFor="email">Email Address:</label>
                <input type="email" id="email" placeholder="Enter your email address" required />

                {/* Shipping Info */}
                <h3>Shipping Information</h3>
                <label htmlFor="shipping-name">Full Name:</label>
                <input
                    type="text"
                    id="shipping-name"
                    name="name"
                    placeholder="Enter your full name"
                    value={shippingInfo.name}
                    onChange={handleShippingChange}
                    required
                />
                <label htmlFor="shipping-address">Address:</label>
                <input
                    type="text"
                    id="shipping-address"
                    name="address"
                    placeholder="Enter your shipping address"
                    value={shippingInfo.address}
                    onChange={handleShippingChange}
                    required
                />
                <label htmlFor="shipping-city">City:</label>
                <input
                    type="text"
                    id="shipping-city"
                    name="city"
                    placeholder="Enter your city"
                    value={shippingInfo.city}
                    onChange={handleShippingChange}
                    required
                />
                <label htmlFor="shipping-zip">Zip Code:</label>
                <input
                    type="text"
                    id="shipping-zip"
                    name="zip"
                    placeholder="Enter your zip code"
                    value={shippingInfo.zip}
                    onChange={handleShippingChange}
                    required
                />

                {/* Checkbox to toggle same as shipping */}
                <label>
                    <input
                        type="checkbox"
                        checked={sameAsShipping}
                        onChange={handleSameAsShippingChange}
                    />
                    Billing address is the same as shipping address
                </label>

                {/* Billing Info - Conditionally Rendered */}
                {!sameAsShipping && (
                    <div>
                        <h3>Billing Information</h3>
                        <label htmlFor="billing-name">Billing Name:</label>
                        <input
                            type="text"
                            id="billing-name"
                            name="name"
                            placeholder="Enter billing name"
                            value={billingInfo.name}
                            onChange={handleBillingChange}
                            required
                        />
                        <label htmlFor="billing-address">Billing Address:</label>
                        <input
                            type="text"
                            id="billing-address"
                            name="address"
                            placeholder="Enter billing address"
                            value={billingInfo.address}
                            onChange={handleBillingChange}
                            required
                        />
                        <label htmlFor="billing-city">Billing City:</label>
                        <input
                            type="text"
                            id="billing-city"
                            name="city"
                            placeholder="Enter billing city"
                            value={billingInfo.city}
                            onChange={handleBillingChange}
                            required
                        />
                        <label htmlFor="billing-zip">Billing Zip Code:</label>
                        <input
                            type="text"
                            id="billing-zip"
                            name="zip"
                            placeholder="Enter billing zip code"
                            value={billingInfo.zip}
                            onChange={handleBillingChange}
                            required
                        />
                    </div>
                )}

                {/* Payment Details */}
                <h3>Payment Details</h3>
                <div className="payment-info">
                    <label htmlFor="card-info">Card Information:</label>
                    <CardElement
                        id="card-info"
                        className="StripeElement"
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    lineHeight: '24px',
                                    color: '#333',
                                    letterSpacing: '0.025em',
                                    fontFamily: 'Arial, sans-serif',
                                    iconColor: '#666',
                                },
                                invalid: {
                                    color: '#f44336',
                                    iconColor: '#f44336',
                                },
                                focus: {
                                    borderColor: '#4CAF50',
                                },
                            },
                        }}
                    />
                    {/* Trust Signal / Security Notice */}
                    <div className="security-notice">
                        <small>Your payment is secured with SSL encryption. We do not store your card details.</small>
                    </div>
                    {/* Error Message */}
                {error && <div className="error-message">{error}</div>}


                    {/* Payment Summary */}
                    <div className="payment-summary">
                        <h4>Payment Summary</h4>
                        <div className="summary-item">
                            <span>Subtotal:</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-item">
                            <span>Shipping:</span>
                            <span>${shippingCost.toFixed(2)}</span>
                        </div>
                        <div className="summary-item">
                            <span>Tax:</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>
                        <div className="summary-item">
                            <span>Total:</span>
                            <span>${orderTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="buttons">
                    <button type="submit" disabled={!stripe || loading} className="submit-button">
                        {loading ? 'Processing...' : 'Pay Now'}
                    </button>
                    <button type="button" className="cancel-button" onClick={() => console.log('Payment Cancelled')}>
                        Cancel
                    </button>
                </div>
            </form>

            {success && <div className="success-message">Payment Successful!</div>}
        </div>
    );
};


export default Checkout;
