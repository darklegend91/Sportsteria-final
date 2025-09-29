import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login as loginApi } from "../services/authService";

export default function Login() {
  const { login } = useAuth();
  // MODIFIED: Removed 'role' from the form state
  const [form, setForm] = useState({ username: "", password: "" });

  const handle = async (e) => {
    e.preventDefault();
    try {
      // MODIFIED: 'role' is no longer sent to the API
      const res = await loginApi({ username: form.username, password: form.password });
      const { token, user } = res.data;
      login(user, token);
    } catch (err) {
      alert(err?.response?.data?.message ?? "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handle}
        className="w-96 bg-white p-8 rounded-2xl shadow-xl flex flex-col gap-5"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Welcome Back</h2>

        <div className="relative">
          <input
            name="username"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            placeholder=" "
            className="peer w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-transparent"
          />
          <label className="absolute left-3 top-3 text-gray-500 text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-500 transition-all">
            Username
          </label>
        </div>

        <div className="relative">
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            placeholder=" "
            className="peer w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-transparent"
          />
          <label className="absolute left-3 top-3 text-gray-500 text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-500 transition-all">
            Password
          </label>
        </div>

        {/* --- MODIFIED: The <select> dropdown for role has been removed --- */}

        <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all">
          Login
        </button>

        <p className="text-center text-gray-500 text-sm mt-2">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}