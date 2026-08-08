// src/pages/PaymentSuccess.jsx
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
  return (
    <div className="payment-success">
      <div className="success-container">
        <FaCheckCircle className="success-icon" />
        <h1>Payment Successful! 🎉</h1>
        <p>Thank you for your purchase. Your order has been confirmed.</p>
        <p className="order-info">
          We'll send you a confirmation email with your order details.
        </p>
        <div className="success-actions">
          <Link to="/" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;