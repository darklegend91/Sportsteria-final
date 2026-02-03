import React, { useEffect, useState } from "react";
import EquipmentTable from "../components/common/EquipmentTable";
import RequestsTable from "../components/common/RequestsTable";
import { getStudentEquipments } from "../services/EquipmentService";
import { createStudentRequest, getStudentRequests } from "../services/requestService";

export default function StudentDashboard() {
  const [equipments, setEquipments] = useState([]);
  const [requests, setRequests] = useState([]);
  const [quantityMap, setQuantityMap] = useState({}); // track quantity for each equipment

  const handleLogout = () => {
    localStorage.clear()
    window.location.href = "/login";
  }

  async function load() {
    try {
      const e = await getStudentEquipments();
      setEquipments(e.data);

      const r = await getStudentRequests();
      setRequests(r.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => { load(); }, []);

  const handleQuantityChange = (equipmentId, value) => {
    setQuantityMap(prev => ({ ...prev, [equipmentId]: value }));
  };

  const handleRequest = async (equipmentId) => {
    try {
      const qty = quantityMap[equipmentId] ? parseInt(quantityMap[equipmentId]) : 1;
      await createStudentRequest({ equipmentId, quantityRequested: qty });
      await load();
      alert("Request submitted successfully!");
    } catch (err) {
      alert(err?.response?.data?.message ?? "Request failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Student Dashboard</h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition-all"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Available Equipment */}
      <section className="max-w-6xl mx-auto mb-8 p-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-5 border-b pb-2">Available Equipment</h2>
        <EquipmentTable
          equipments={equipments}
          showActions={true}
          onRequest={handleRequest}
          quantityMap={quantityMap}
          onQuantityChange={handleQuantityChange}
        />
      </section>

      {/* My Requests */}
      <section className="max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-5 border-b pb-2">My Requests</h2>
        <RequestsTable requests={requests} isAdmin={false} />
      </section>
    </div>
  );
}
