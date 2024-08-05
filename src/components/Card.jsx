import React from 'react';

const Card = ({ title, price, description, addToCart, isMember, showWarning, setShowWarning }) => {
  const handleBuyNow = () => {
    if (isMember) {
      setShowWarning(true);
    } else {
      addToCart();
      setShowWarning(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto bg-grey-400 p-6 rounded-lg shadow-md border border-primary transition-transform transform hover:scale-105 mt-8">
      <h2 className="text-2xl font-bold mb-2 text-white-600">{title}</h2>
      <p className="text-sm mb-2 text-white-600">{description}</p>
      <p className="text-xl font-semibold mb-4 text-white-600 ">{price}</p>
      <button className="bg-red-500 text-white px-6 py-2 rounded-lg font-medium transition-opacity duration-300 hover:opacity-75 active:opacity-50" onClick={handleBuyNow}>
        Buy Now
      </button>
      {showWarning && isMember && (
        <div className="text-red-500 mt-2">
          You are already a member
        </div>
      )}
    </div>
  );
};

export default Card;
