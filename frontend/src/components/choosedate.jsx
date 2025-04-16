import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DatePicker() {
  // Set selectedDate initial state to null so that no date is pre-selected
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 3));
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Get today's date normalized to midnight
  const today = new Date(); 
  today.setHours(0, 0, 0, 0);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      // Normalize the date for comparison
      const normalizedDate = new Date(date);
      normalizedDate.setHours(0, 0, 0, 0);

      const isSelected =
        selectedDate &&
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();

      // Determine if this date is in the past (before today)
      const isPast = normalizedDate < today;

      // Determine if this date should be grayed out for weekends (as an example)
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;

      days.push(
        <button
          key={day}
          onClick={() => {
            if (!isPast) setSelectedDate(date);
          }}
          disabled={isPast}
          className={`h-8 w-8 rounded-full flex items-center justify-center 
            ${isSelected ? "bg-blue-500 text-white" : "hover:bg-gray-700"}
            ${isWeekend ? "text-gray-500" : "text-white"}
            ${isPast ? "opacity-50 cursor-not-allowed" : ""}`}>
          {day}
        </button>
      );
    }

    return days;
  };

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="bg-black min-h-screen flex flex-col items-center p-4">
      <div className="max-w-md w-full">
        <h1 className="text-white text-2xl font-medium text-center mb-2">
          Choose Your Delivery Date
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Select your preferred skip delivery date. We'll aim to deliver between
          7am and 6pm on your chosen day.
        </p>

        <div className="bg-gray-900 rounded-lg p-6">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="text-gray-400 hover:text-white">
              ←
            </button>
            <div className="text-white font-medium">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </div>
            <button
              onClick={nextMonth}
              className="text-gray-400 hover:text-white">
              →
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekdays.map((day, index) => (
              <div
                key={day}
                className={`text-center text-sm ${
                  index === 0 || index === 6 ? "text-blue-400" : "text-gray-400"
                }`}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-between mt-6">
          <button
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
            onClick={() => navigate(-1)}
            disabled={!selectedDate}>
            Back
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
            onClick={() => {
              navigate("/payment");
              localStorage.setItem(
                "deliveryDate",
                JSON.stringify(selectedDate)
              );
            }}
            disabled={!selectedDate}>
            Continue to Payment
          </button>
        </div>
      </div>
    </div>
  );
}
