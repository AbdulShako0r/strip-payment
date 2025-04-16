import React, { useState, useRef } from "react";
import { Home, Truck, Clock, AlertCircle, Camera, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SkipPlacement = () => {
  const [selected, setSelected] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const options = [
    {
      id: "private",
      title: "Private Property",
      description: "No permit required when placed on your private property",
      icon: <Home size={24} />,
    },
    {
      id: "public",
      title: "Public Road",
      description: "Permit required for placement on public roads",
      icon: <Truck size={24} />,
    },
  ];

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Process image file and create preview
  const processImageFile = (file) => {
    setPhoto(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Open camera for taking photo
  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use rear camera
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraOpen(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please check permissions.");
    }
  };

  // Capture photo from camera
  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          const file = new File([blob], "captured-photo.jpg", {
            type: "image/jpeg",
          });
          processImageFile(file);
          closeCamera();
        },
        "image/jpeg",
        0.9
      );
    }
  };

  // Close camera and stop stream
  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  // Trigger file input when upload button is clicked
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="text-white min-h-screen flex flex-col mt-10 items-center">
      <h2 className="text-xl font-bold">Where will the skip be placed?</h2>
      <p className="text-gray-400 mb-6">
        This helps us determine if you need a permit for your skip
      </p>

      {/* Placement Options */}
      <div className="flex gap-4 flex-wrap justify-center">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => setSelected(option.id)}
            className={`p-6 w-80 flex flex-col items-start border rounded-lg ${
              selected === option.id ? "border-blue-500" : "border-gray-600"
            } bg-gray-900 hover:border-blue-400 transition`}
          >
            <div className="text-blue-500 mb-2">{option.icon}</div>
            <h3 className="font-semibold">{option.title}</h3>
            <p className="text-gray-400 text-sm">{option.description}</p>
          </button>
        ))}
      </div>

      {/* Photo Upload Card */}
      {selected && (
        <div className="border border-gray-700 bg-gray-800 rounded-lg p-6 mt-6 w-full max-w-2xl">
          <h3 className="text-white font-semibold mb-4">
            Upload a photo of the placement location
          </h3>
          <div className="flex gap-4 flex-wrap">
            <button
              type="button"
              onClick={openCamera}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded">
              <Camera size={18} />
              Take Photo
            </button>
            <button
              type="button"
              onClick={triggerFileInput}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded">
              <Upload size={18} />
              Upload Photo
            </button>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileUpload}
              ref={fileInputRef}
              className="hidden"/>
          </div>

          {/* Camera View Modal */}
          {isCameraOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center p-4">
              <div className="relative w-full max-w-2xl">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-auto rounded-lg"/>
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={capturePhoto}
                    className="bg-white rounded-full w-16 h-16 flex items-center justify-center">
                    <div className="bg-white rounded-full w-14 h-14 border-4 border-gray-300"></div>
                  </button>
                </div>
                <button
                  onClick={closeCamera}
                  className="absolute top-4 right-4 bg-red-600 text-white rounded-full p-2">
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Image Preview */}
          {imagePreview && !isCameraOpen && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-white">Image Preview</h4>
                <button
                  onClick={() => {
                    setImagePreview(null);
                    setPhoto(null);
                  }}
                  className="text-red-500 text-sm">
                  Remove
                </button>
              </div>
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-64 object-contain mt-2 rounded bg-gray-900"/>
            </div>
          )}
        </div>
      )}

      {/* Permit Info Boxes */}
      {selected === "public" && (
        <div className="w-full max-w-2xl mt-6 flex flex-col gap-4">
          <div className="border border-amber-600/30 bg-amber-900/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-amber-500 mt-0.5" />
              <div>
                <h3 className="text-amber-500 font-medium mb-1">
                  Permit Required
                </h3>
                <p className="text-white text-sm">
                  A permit is required when placing a skip on a public road.
                  We'll handle the permit application process for you. An
                  additional fee of £84.00 will be added to your order.
                </p>
              </div>
            </div>
          </div>

          <div className="border border-blue-600/30 bg-blue-900/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Clock size={20} className="text-blue-500 mt-0.5" />
              <div>
                <h3 className="text-blue-500 font-medium mb-1">
                  Processing Time
                </h3>
                <p className="text-white text-sm">
                  The council requires 5 working days notice to process permit
                  applications. Please plan your delivery date accordingly.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Buttons Section */}
      <div className="flex gap-4 mt-6">
        <button
          className="px-6 py-2 bg-gray-700 rounded-md"
          onClick={() => navigate(-1)}
          disabled={!selected || !photo}>
          Back
        </button>
        <button
          className={`px-6 py-2 rounded-md ${
            selected ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-600"
          }`}
          disabled={!selected || !photo}
          onClick={() => {
            navigate("/date", { state: { placement: selected, photo } });
            localStorage.setItem(
              "placementData",
              JSON.stringify({
                placementType: selected,
                photo: imagePreview,
              })
            );
          }}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default SkipPlacement;
