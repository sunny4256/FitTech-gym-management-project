import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection, Timestamp } from 'firebase/firestore';

const stripePromise = loadStripe('pk_test_51PaP3FF7ZVUCzs04OV3XWC5bQ2yYlJFePgBvbdwcGNNoVm7KlXFbsxNwF6ZnXgFf1SfXEWjSNenbPSSe49tYkqFm00GEDzF6q2');

const cardElementOptions = {
  style: {
    base: {
      color: '#f1f1f1',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

const CheckoutForm = ({ cart, clearCart }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [name, setName] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/login', { state: { from: '/checkout', cart } });
      } else {
        setUser(currentUser);
      }
    });
    return unsubscribe;
  }, [navigate, cart]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      console.log('Stripe.js has not loaded yet.');
      return;
    }

    setIsProcessing(true);

    const card = elements.getElement(CardElement);
    const result = await stripe.createToken(card);

    if (result.error) {
      console.log('Stripe token creation error:', result.error.message);
      setIsProcessing(false);
    } else {
      console.log('Token created:', result.token);

      const membershipStart = new Date();
      let membershipEnds;

      switch (cart[0].title) {
        case 'FitTech Elite':
          membershipEnds = new Date(membershipStart);
          membershipEnds.setFullYear(membershipEnds.getFullYear() + 1);
          break;
        case 'FitTech Pro':
          membershipEnds = new Date(membershipStart);
          membershipEnds.setMonth(membershipEnds.getMonth() + 6);
          break;
        case 'FitTech Basic':
          membershipEnds = new Date(membershipStart);
          membershipEnds.setMonth(membershipEnds.getMonth() + 1);
          break;
        default:
          membershipEnds = membershipStart;
      }

      try {
        await addDoc(collection(db, 'members'), {
          name,
          email: user.email,
          pass_type: cart[0].title,
          membership_start: Timestamp.fromDate(membershipStart),
          membership_ends: Timestamp.fromDate(membershipEnds),
        });
        clearCart();
        navigate('/payment-success', {
          state: { cart: cart.map((item) => ({ title: item.title, price: item.price })), user: { email: user.email, name } },
        });
      } catch (error) {
        console.error('Error adding member:', error);
      }

      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center bg-gray-900 text-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-2xl font-bold mb-4">Order Details</h2>
      <p className="mb-2">Title: {cart[0]?.title}</p>
      <p className="mb-4">Price: {cart[0]?.price}</p>

      <label className="block mb-2 w-full">
        Name
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border border-gray-700 rounded mt-1 w-full text-black"
          required
        />
      </label>

      <label className="block mb-2 w-full">
        Card Details
        <CardElement options={cardElementOptions} className="p-2 border border-gray-700 rounded mt-1 w-full" />
      </label>

      <button
        type="submit"
        className="bg-primary text-white py-2 px-4 rounded mt-4 hover:bg-secondary"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Pay'}
      </button>
    </form>
  );
};

const Checkout = ({ clearCart }) => {
  const location = useLocation();
  const cart = location.state?.cart || [];

  if (cart.length === 0) {
    return <p className="text-center mt-8 text-gray-400">Cart is empty</p>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800 text-white">
      <Elements stripe={stripePromise}>
        <CheckoutForm cart={cart} clearCart={clearCart} />
      </Elements>
    </div>
  );
};

export default Checkout;
