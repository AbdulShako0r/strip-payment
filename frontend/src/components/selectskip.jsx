import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SkipHire = () => {
  const [skips, setSkips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkip, setSelectedSkip] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(
        "https://app.wewantwaste.co.uk/api/skips/by-location?postcode=LE10&area=Hinckley"
      )
      .then((response) => {
        setSkips(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  if (loading)
    return <div className="text-center text-white p-6">Loading...</div>;

  return (
    <div className="bg-black text-white p-5 min-h-screen flex flex-col justify-between">
      <div>
        <h2 className="text-center text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">
          Choose Your Skip Size
        </h2>
        <p className="text-center text-lg sm:text-xl text-gray-400 mb-6">
          Select the skip that best suits your needs
        </p>

        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {skips.map((skip) => (
              <div
                key={skip.id}
                onClick={() => {
                  setSelectedSkip(skip.id);
                  localStorage.setItem("selectedSkip", JSON.stringify(skip));
                }}
                className={`cursor-pointer bg-[#1C1C1C] border-2 ${
                  selectedSkip === skip.id
                    ? "border-blue-500"
                    : "border-transparent"
                } hover:border-blue-700 rounded-lg shadow-lg w-full max-w-[22rem] transition-all duration-300`}  >

                <div className="relative">
                  <img
                    src="/task1.webp"
                    alt={`${skip.size} Yard Skip`}
                    className="w-full h-48 sm:h-52 object-cover p-2 rounded-lg"/>
                  {!skip.allowed_on_road && (
                    <div className="absolute top-2 left-2 bg-black text-yellow-400 px-3 py-1 rounded-md text-sm">
                      ⚠ Private Property Only
                    </div>
                  )}
                  {!skip.allows_heavy_waste && (
                    <div className="absolute top-10 left-2 bg-black text-red-500 px-3 py-1 rounded-md text-sm">
                      ⚠ Not Suitable for Heavy Waste
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-[#0037C1] text-white px-3 py-1 rounded-lg text-sm">
                    {skip.size} Yards
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-lg sm:text-xl font-bold">{`${skip.size} Yard Skip`}</p>
                  <p className="text-gray-400 text-sm">
                    {skip.hire_period_days} day hire period
                  </p>
                  <p className="text-blue-400 font-bold py-2 text-base sm:text-lg">
                    £{skip.price_before_vat ? skip.price_before_vat * 1 : "-"}
                    <span className="text-gray-400 p-1 text-sm">per week</span>
                  </p>

                  {selectedSkip === skip.id && (
                    <button className="bg-blue-600 text-white w-full py-2 mt-3 rounded-md hover:bg-blue-700 flex justify-center items-center gap-2 text-base sm:text-lg transition-all duration-300">
                      Selected <span className="text-xl">→</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-10 px-2 sm:px-5">
        <button className="bg-gray-600 text-white w-full sm:w-auto px-5 py-2 rounded-md hover:bg-gray-500 transition-all duration-300">
          Back
        </button>
        <button
          className={`w-full sm:w-auto px-5 py-2 rounded-md transition-all duration-300 ${
            selectedSkip
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
          }`}
          disabled={!selectedSkip}
          onClick={() => selectedSkip && navigate("/permit")}>
          Continue →
        </button>
      </div>
    </div>
  );
};

export default SkipHire;
