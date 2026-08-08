// src/pages/Payment.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';
import { useAuth } from '../context/auth';
import { FaCreditCard, FaPaypal, FaApplePay, FaGooglePay, FaLock, FaCheckCircle } from 'react-icons/fa';
import './Payment.css';

const Payment = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const total = getCartTotal();
  const subtotal = total;
  const shipping = total > 50 ? 0 : 5.99;
  const tax = total * 0.1;
  const grandTotal = subtotal + shipping + tax;

  // Redirect if cart is empty
  if (cartItems.length === 0 && !showSuccess) {
    navigate('/products');
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
      clearCart();

      // Redirect to success page after showing confirmation
      setTimeout(() => {
        navigate('/payment-success');
      }, 1500);
    }, 2000);
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  if (showSuccess) {
    return (
      <div className="payment-processing">
        <div className="processing-container">
          <FaCheckCircle className="processing-icon" />
          <h2>Payment Successful!</h2>
          <p>Thank you for your order. Redirecting you to confirmation...</p>
          <div className="processing-loader">
            <div className="loader-spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        {/* Order Summary */}
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="order-items">
            {cartItems.map((item) => (
              <div key={item.id} className="order-item">
                <div className="item-info">
                  <img src={item.thumbnail} alt={item.title} className="item-thumbnail" />
                  <div>
                    <p className="item-title">{item.title}</p>
                    <p className="item-quantity">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="total-row">
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="total-row grand-total">
              <span>Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {user && (
            <div className="user-info">
              <p>✅ Paying as: <strong>{user.email}</strong></p>
            </div>
          )}
        </div>

        {/* Payment Form */}
        <div className="payment-form-container">
          <h2>Payment Method</h2>
          
          <div className="payment-methods">
            <button 
              className={`payment-method ${paymentMethod === 'card' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('card')}
            >
              <FaCreditCard /> Credit Card
            </button>
            <button 
              className={`payment-method ${paymentMethod === 'paypal' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('paypal')}
            >
              <FaPaypal /> PayPal
            </button>
            <button 
              className={`payment-method ${paymentMethod === 'apple' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('apple')}
            >
              <FaApplePay /> Apple Pay
            </button>
            <button 
              className={`payment-method ${paymentMethod === 'google' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('google')}
            >
              <FaGooglePay /> Google Pay
            </button>
          </div>

          <form onSubmit={handleSubmit} className="payment-form">
            {paymentMethod === 'card' && (
              <div className="card-details">
                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    placeholder="4242 4242 4242 4242"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength="19"
                    required
                  />
                  <div className="card-icons">
                    <span>💳</span>
                    <span>🔒</span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Name on Card</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                      maxLength="5"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="password"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
                      maxLength="4"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'paypal' && (
              <div className="payment-info">
                <FaPaypal className="payment-icon" />
                <p>You will be redirected to PayPal to complete your payment.</p>
                <div className="demo-note">
                  <p>📝 Demo: Click "Pay Now" to simulate payment</p>
                </div>
              </div>
            )}

            {(paymentMethod === 'apple' || paymentMethod === 'google') && (
              <div className="payment-info">
                <div className="payment-icon-wrapper">
                  {paymentMethod === 'apple' ? <FaApplePay /> : <FaGooglePay />}
                </div>
                <p>Pay with {paymentMethod === 'apple' ? 'Apple' : 'Google'} Pay</p>
                <div className="demo-note">
                  <p>📝 Demo: Click "Pay Now" to simulate payment</p>
                </div>
              </div>
            )}

            <div className="payment-security">
              <FaLock />
              <span>Your payment is secure and encrypted</span>
            </div>

            <button 
              type="submit" 
              className="pay-button"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : `Pay $${grandTotal.toFixed(2)}`}
            </button>

            <div className="demo-note">
              <p>💡 Demo Payment: Use any card number or click "Pay Now" for simulation</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;