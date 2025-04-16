import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Truck, Calendar, CheckCircle } from "lucide-react";
import axios from "axios";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedSkip, setSelectedSkip] = useState(null);
  const [placement, setPlacement] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });
  const [cardErrors, setCardErrors] = useState({});
  const [paypalDetails, setPaypalDetails] = useState({
    email: "",
    password: "",
  });
  const [paypalErrors, setPaypalErrors] = useState({});
  const [orderComplete, setOrderComplete] = useState(false);

  // Calculate costs
  const subtotal = selectedSkip?.price_before_vat || 0;
  const vat = subtotal * 0.2;
  const permitFee = placement?.placementType === "public" ? 84 : 0;
  const total = subtotal + vat + permitFee;
  const unitPrice = selectedSkip
    ? selectedSkip.price_before_vat / selectedSkip.size
    : 0;

  const buyFunction = async () => {
    try {
      const response = await axios.post("http://localhost:5000/payment", {
        total: total,
        email: "shakoor11664.as@gmail.com",
      });
      if (response.status === 200) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  useEffect(() => {
    const skipData = JSON.parse(localStorage.getItem("selectedSkip"));
    const placementData = JSON.parse(localStorage.getItem("placementData"));
    const dateData = JSON.parse(localStorage.getItem("deliveryDate"));

    if (skipData) setSelectedSkip(skipData);
    if (placementData) setPlacement(placementData);
    if (dateData) setDeliveryDate(new Date(dateData));

    setLoading(false);
  }, []);

  const validateCardDetails = () => {
    const errors = {};
    const cleanedNumber = cardDetails.number.replace(/\s+/g, "");
    if (!/^\d{16}$/.test(cleanedNumber)) {
      errors.number = "Card number must be 16 digits.";
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiry)) {
      errors.expiry = "Expiry must be in MM/YY format.";
    }
    if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
      errors.cvv = "CVC must be 3 or 4 digits.";
    }
    if (!cardDetails.name.trim()) {
      errors.name = "Cardholder name is required.";
    }
    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePaypalDetails = () => {
    const errors = {};
    if (!/^\S+@\S+\.\S+$/.test(paypalDetails.email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!paypalDetails.password.trim()) {
      errors.password = "Password is required.";
    }
    setPaypalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;
    if (paymentMethod === "card") {
      isValid = validateCardDetails();
    } else if (paymentMethod === "paypal") {
      isValid = validatePaypalDetails();
    }

    if (!isValid) return;

    console.log("Processing payment with:", {
      skip: selectedSkip,
      placement,
      deliveryDate,
      paymentMethod,
      details: paymentMethod === "card" ? cardDetails : paypalDetails,
    });

    if (paymentMethod === "paypal") {
      await buyFunction();
      return;
    } else {
      setTimeout(() => {
        setOrderComplete(true);
        localStorage.removeItem("selectedSkip");
        localStorage.removeItem("placementData");
        localStorage.removeItem("deliveryDate");
      }, 1500);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading)
    return <div className="text-center text-white p-4 sm:p-8">Loading...</div>;

  if (!selectedSkip || !placement || !deliveryDate) {
    return (
      <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">
          Missing Information
        </h1>
        <p className="text-gray-400 mb-6 text-center">
          Please complete all steps of the booking process first.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">
          Start Booking
        </button>
      </div>
    );
  }

  if (orderComplete) {
    return <div></div>;
  }

  return (
    <div className="bg-black text-white min-h-screen p-3 sm:p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          Complete Your Booking
        </h1>

        <div className="bg-gray-900 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
            Order Summary
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-gray-800 p-4 sm:p-6 rounded-lg flex flex-col gap-2">
              <h3 className="text-base sm:text-lg font-semi bold">
                Skip Details
              </h3>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">
                  {selectedSkip.size} Yard Skip
                </span>
                <span className="text-blue-400 font-medium">
                  £{subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-400">
                <span>£{unitPrice.toFixed(2)} / yard</span>
                <span className="italic">excl. VAT</span>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Placement</h3>
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                {placement.placementType === "private" ? (
                  <Home className="w-4 h-4" />
                ) : (
                  <Truck className="w-4 h-4" />
                )}
                <span>
                  {placement.placementType === "private"
                    ? "Private Property"
                    : "Public Road"}
                </span>
              </div>
              {placement.placementType === "public" && (
                <p className="text-sm text-amber-400">+ £84.00 permit fee</p>
              )}
              {placement.photo && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500">
                    Location photo provided
                  </p>
                </div>
              )}
            </div>

            <div className="bg-gray-800 p-4 rounded-lg sm:col-span-2 lg:col-span-1">
              <h3 className="font-medium mb-2">Delivery</h3>
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm sm:text-base">
                  {formatDate(deliveryDate)}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Delivery window: 7am - 6pm
              </p>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="border-t border-gray-700 pt-4">
            <h3 className="font-medium mb-3">Cost Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Skip Hire</span>
                <span>£{subtotal.toFixed(2)}</span>
              </div>
              {placement.placementType === "public" && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Permit Fee</span>
                  <span>£{permitFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400">VAT (20%)</span>
                <span>£{vat.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-700 pt-2 mt-2">
                <span className="font-medium">Total</span>
                <span className="font-medium">£{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Payment Method
          </h2>

          <div className="flex flex-wrap gap-2 sm:gap-4 mb-4 sm:mb-6">
            <button
              onClick={() => {
                setPaymentMethod("card");
                setCardErrors({});
              }}
              className={`px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base ${
                paymentMethod === "card"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300"
              }`}>
              Credit/Debit Card
            </button>
            <button
              onClick={() => {
                setPaymentMethod("paypal");
                setPaypalErrors({});
              }}
              className={`px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base ${
                paymentMethod === "paypal"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300"
              }`}>
              PayPal
            </button>
          </div>

          {paymentMethod === "card" ? (
            <form onSubmit={handlePaymentSubmit}>
              <div className="grid gap-4 mb-6">
                <div>
                  <label className="block text-gray-300 mb-1 text-sm sm:text-base">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.number}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, number: e.target.value })
                    }
                    className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 text-sm sm:text-base"/>
                  {cardErrors.number && (
                    <p className="text-red-500 text-xs sm:text-sm">
                      {cardErrors.number}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-300 mb-1 text-sm sm:text-base">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    placeholder="Name on Card"
                    value={cardDetails.name}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, name: e.target.value })
                    }
                    className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 text-sm sm:text-base"/>
                  {cardErrors.name && (
                    <p className="text-red-500 text-xs sm:text-sm">
                      {cardErrors.name}
                    </p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-gray-300 mb-1 text-sm sm:text-base">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) =>
                        setCardDetails({
                          ...cardDetails,
                          expiry: e.target.value,
                        })
                      }
                      className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 text-sm sm:text-base"/>
                    {cardErrors.expiry && (
                      <p className="text-red-500 text-xs sm:text-sm">
                        {cardErrors.expiry}
                      </p>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-300 mb-1 text-sm sm:text-base">
                      CVC
                    </label>
                    <input
                      type="text"
                      placeholder="CVC"
                      value={cardDetails.cvv}
                      onChange={(e) =>
                        setCardDetails({ ...cardDetails, cvv: e.target.value })
                      }
                      className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 text-sm sm:text-base"/>
                    {cardErrors.cvv && (
                      <p className="text-red-500 text-xs sm:text-sm">
                        {cardErrors.cvv}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 border-t border-gray-700 pt-4 sm:pt-6">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-gray-700 rounded-md hover:bg-gray-600 text-sm sm:text-base">
                  Back
                </button>
                <button
                  type="submit"
                  onClick={buyFunction}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-green-600 rounded-md hover:bg-green-500 font-medium text-sm sm:text-base">
                  Pay £{total.toFixed(2)}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handlePaymentSubmit}>
              <div className="grid gap-4 mb-6">
                <div>
                  <label className="block text-gray-300 mb-1 text-sm sm:text-base">
                    PayPal Email
                  </label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={paypalDetails.email}
                    onChange={(e) =>
                      setPaypalDetails({
                        ...paypalDetails,
                        email: e.target.value,
                      })
                    }
                    className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 text-sm sm:text-base"/>
                  {paypalErrors.email && (
                    <p className="text-red-500 text-xs sm:text-sm">
                      {paypalErrors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-300 mb-1 text-sm sm:text-base">
                    PayPal Password
                  </label>
                  <input
                    type="password"
                    placeholder="Password"
                    value={paypalDetails.password}
                    onChange={(e) =>
                      setPaypalDetails({
                        ...paypalDetails,
                        password: e.target.value,
                      })
                    }
                    className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 text-sm sm:text-base"/>
                  {paypalErrors.password && (
                    <p className="text-red-500 text-xs sm:text-sm">
                      {paypalErrors.password}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 border-t border-gray-700 pt-4 sm:pt-6">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-gray-700 rounded-md hover:bg-gray-600 text-sm sm:text-base">
                  Back
                </button>
                <button
                  type="submit"
                  onClick={buyFunction}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-green-600 rounded-md hover:bg-green-500 font-medium text-sm sm:text-base">
                  Pay £{total.toFixed(2)}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
