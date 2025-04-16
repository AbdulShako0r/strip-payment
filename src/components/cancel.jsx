import React from "react";

const PaymentCancelled = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">
          Payment Cancelled!
        </h1>
        <p className="text-gray-700 mb-6">
          Your payment has been cancelled or failed. Please try again or contact
          support for further assistance.
        </p>
        <button
          onClick={() => (window.location.href = "/")}
          className="px-6 py-3 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition duration-300" >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentCancelled;
