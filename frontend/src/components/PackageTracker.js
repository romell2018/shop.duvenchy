import React, { useState } from 'react';

const PackageTracker = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingInfo, setTrackingInfo] = useState(null);

  const handleTrack = () => {
    // Here you'd make a call to the backend to fetch tracking info based on the trackingNumber
    // For now, we'll simulate tracking data.
    setTrackingInfo({
      status: 'In Transit',
      estimatedDelivery: 'October 15, 2024',
    });
  };

  return (
    <div className="container mx-auto mt-6">
      <h1 className="text-4xl font-bold">Track Your Order</h1>

      <div className="mt-6">
        <input
          type="text"
          placeholder="Enter tracking number"
          className="border p-2 w-full"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white py-2 px-4 rounded-md mt-4"
          onClick={handleTrack}
        >
          Track
        </button>
      </div>

      {trackingInfo && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold">Status: {trackingInfo.status}</h2>
          <p>Estimated Delivery: {trackingInfo.estimatedDelivery}</p>
        </div>
      )}
    </div>
  );
};

export default PackageTracker;
