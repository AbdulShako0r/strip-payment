import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Permit from "./components/permit";
import Choosedate from "./components/choosedate";
import Skipyard from "./components/selectskip";
import Payment from "./components/payment"
import Success from "./components/Sucess";
import Cancel from "./components/cancel";

const App = () => {
  return (
    <Router>
      <div className="p-10 bg-black min-h-screen flex flex-col items-center">
        <Routes>
          <Route path="/" element={<Skipyard />} />
          <Route path="/permit" element={<Permit />} />
          <Route path="/date" element={<Choosedate />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/success" element={<Success />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;