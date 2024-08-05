import React, { useState } from 'react';
import Card from './Card';

const PlansSection = ({ addToCart, isMember }) => {
  const [showWarning, setShowWarning] = useState(false);

  return (
    <div className="bg-gray-800 text-white-400  py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Choose The Best Plan
        </h2>
        <div className="flex justify-around space-x-4">
          <Card title="FitTech Elite" price="$999" description="Yearly Pass" addToCart={() => addToCart({ title: 'FitTech Elite', price: '$999' })} isMember={isMember} showWarning={showWarning} setShowWarning={setShowWarning} />
          <Card title="FitTech Pro" price="$499" description="Quarterly Pass" addToCart={() => addToCart({ title: 'FitTech Pro', price: '$499' })} isMember={isMember} showWarning={showWarning} setShowWarning={setShowWarning} />
          <Card title="FitTech Basic" price="$299" description="Monthly Pass" addToCart={() => addToCart({ title: 'FitTech Basic', price: '$299' })} isMember={isMember} showWarning={showWarning} setShowWarning={setShowWarning} />
        </div>
      </div>
    </div>
  );
};

export default PlansSection;
