import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, user } = location.state || {};
  const invoiceRef = useRef();

  useEffect(() => {
    if (!cart || !user) {
      navigate('/');
    }
  }, [cart, user, navigate]);

  const downloadInvoice = async () => {
    const element = invoiceRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 0, 0);
    pdf.save("invoice.pdf");
  };

  if (!cart || !cart[0]) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <h1 className="text-4xl font-bold mb-4 text-primary">Payment Successful</h1>
        <p className="text-xl mb-8">Thank you for your purchase! Your payment has been successfully processed.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-primary text-white py-2 px-4 rounded hover:bg-secondary"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4 text-primary">Payment Successful</h1>
      <p className="text-xl mb-8">Thank you for your purchase! Your payment has been successfully processed.</p>
      <button
        onClick={() => navigate('/')}
        className="bg-primary text-white py-2 px-4 rounded hover:bg-secondary"
      >
        Go to Home
      </button>

      <div className="mt-8 p-4 bg-white text-black rounded shadow-md" ref={invoiceRef}>
        <h1 className="text-3xl font-bold mb-4 text-center text-primary">FitTech</h1>
        <h2 className="text-2xl font-bold mb-4">Invoice</h2>
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Product:</strong> {cart[0]?.title}</p>
        <p><strong>Price:</strong> {cart[0]?.price}</p>
        <p><strong>Date:</strong> {new Date().toLocaleString()}</p>
      </div>

      <button
        onClick={downloadInvoice}
        className="mt-4 bg-primary text-white py-2 px-4 rounded hover:bg-secondary"
      >
        Download Invoice
      </button>
    </div>
  );
};

export default PaymentSuccess;
