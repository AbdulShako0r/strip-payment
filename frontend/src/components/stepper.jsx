import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Stepper() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    { id: 1, name: "Select Skip", path: "/" },
    { id: 2, name: "Permit", path: "/permit" },
    { id: 3, name: "Choose Date", path: "/date" },
    { id: 4, name: "Payment", path: "/payment" },
  ];

  useEffect(() => {
    const currentStepIndex =
      steps.findIndex((step) => step.path === location.pathname) + 1;
    setActiveStep(currentStepIndex);
  }, [location.pathname]);

  return (
    <div className="bg-black px-4 py-6 rounded-lg w-full">
      <div className="overflow-x-auto">
        <ol className="flex flex-wrap sm:flex-nowrap gap-2 w-full max-w-full sm:max-w-3xl lg:max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <li key={step.id} className="flex-1 min-w-[140px] text-center">
              <span
                className={`w-full h-12 flex items-center justify-center text-[0.7rem] sm:text-sm font-medium transition-all duration-300
                  ${index === 0 ? "rounded-l-lg" : ""}
                  ${index === steps.length - 1 ? "rounded-r-lg" : ""}
                  ${
                    step.id < activeStep
                      ? "bg-gray-800 text-gray-400"
                      : step.id === activeStep
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-500"
                  }`}>
                    
                <span className="px-2 truncate">{step.name}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
