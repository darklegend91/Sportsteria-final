import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar(){
  const { user } = useAuth();
  return (
    <aside className="w-56 border-r bg-white p-4">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Menu</h3>
      </div>
      <ul className="space-y-2 text-sm">
        <li><Link to={user?.role==="ADMIN" ? "/admin" : "/student"} className="block py-2 px-2 rounded hover:bg-gray-100">Dashboard</Link></li>
        {user?.role === "ADMIN" && (
          <>
            <li><Link to="/admin" className="block py-2 px-2 rounded hover:bg-gray-100">Manage Equipments</Link></li>
            <li><Link to="/admin" className="block py-2 px-2 rounded hover:bg-gray-100">Manage Requests</Link></li>
          </>
        )}
        {user?.role === "STUDENT" && (
          <li><Link to="/student" className="block py-2 px-2 rounded hover:bg-gray-100">My Requests</Link></li>
        )}
      </ul>
    </aside>
  );
}
