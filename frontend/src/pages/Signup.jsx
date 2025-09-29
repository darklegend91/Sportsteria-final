import React, { useState } from "react";
import { signup as signupApi } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";

function validatePassword(p) {
  // at least 8 chars, one letter, one number
  return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(p);
}

export default function Signup() {
  // MODIFIED: Removed 'role' from the form state
  const [form, setForm] = useState({ username: "", password: "", fullName: "", email: "" });
  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    if (!validatePassword(form.password)) return alert("Password must be 8+ chars and include letters & numbers");
    try {
      // MODIFIED: 'role' is no longer sent to the API
      await signupApi({ username: form.username, password: form.password, fullName: form.fullName, email: form.email });
      alert("Signup success. Login now.");
      navigate("/login");
    } catch (err) {
      alert(err?.response?.data?.message ?? "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handle}
        className="w-96 bg-white p-8 rounded-2xl shadow-xl flex flex-col gap-5"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Create Account</h2>

        <div className="relative">
          <input
            value={form.fullName}
            onChange={e => setForm({ ...form, fullName: e.target.value })}
            placeholder=" "
            required
            className="peer w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-transparent"
          />
          <label className="absolute left-3 top-3 text-gray-500 text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-green-500 transition-all">
            Full Name
          </label>
        </div>

        <div className="relative">
          <input
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder=" "
            required
            className="peer w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-transparent"
          />
          <label className="absolute left-3 top-3 text-gray-500 text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-green-500 transition-all">
            Email
          </label>
        </div>

        <div className="relative">
          <input
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            placeholder=" "
            required
            className="peer w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-transparent"
          />
          <label className="absolute left-3 top-3 text-gray-500 text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-green-500 transition-all">
            Username
          </label>
        </div>

        <div className="relative">
          <input
            type="password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            placeholder=" "
            required
            className="peer w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-transparent"
          />
          <label className="absolute left-3 top-3 text-gray-500 text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-green-500 transition-all">
            Password
          </label>
        </div>

        {/* --- MODIFIED: The <select> dropdown for role has been removed --- */}

        <button className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all">
          Sign Up
        </button>

        <p className="text-center text-gray-500 text-sm mt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}