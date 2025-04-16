import React from "react";

const PaymentSuccess = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-700 mb-6">
          Thank you for your payment. Your transaction has been successfully
          completed.
        </p>
        <button
          onClick={() => (window.location.href = "/")}
          className="px-6 py-3 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition duration-300">
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
