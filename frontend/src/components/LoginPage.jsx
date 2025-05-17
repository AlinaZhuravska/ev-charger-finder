import React, { useState } from "react";
import { FaGoogle, FaFacebook } from "react-icons/fa";

const LoginPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegistering) {
      console.log("Registering:", formData);
    } else {
      console.log("Logging in:", formData);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Google login");
  };

  const handleFacebookLogin = () => {
    console.log("Facebook login");
  };

  return (
    <div className="relative min-h-screen flex justify-center items-start overflow-hidden pt-24 pb-8">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/bg-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Login/Register Form */}
      <div className="relative z-10 w-full max-w-md px-6 py-12 bg-white bg-opacity-90 backdrop-blur-md rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isRegistering ? "Register a new account" : "Login to your account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {isRegistering && (
            <div>
              <label className="block text-sm font-medium">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="register"
              checked={isRegistering}
              onChange={() => setIsRegistering(!isRegistering)}
              className="h-4 w-4 border-gray-300 rounded text-gray-600 focus:ring-gray-500 bg-gray-300 checked:bg-gray-400"
            />
            <label htmlFor="register" className="text-sm">
              I'm a new user (register)
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition"
          >
            {isRegistering ? "Register" : "Login"}
          </button>
        </form>

        <div className="flex items-center justify-center gap-2 text-gray-400 text-sm my-4">
          <span className="h-px w-full bg-gray-300"></span>
          or
          <span className="h-px w-full bg-gray-300"></span>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-3 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            <FaGoogle /> Continue with Google
          </button>
          <button
            onClick={handleFacebookLogin}
            className="flex items-center justify-center gap-3 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            <FaFacebook /> Continue with Facebook
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
