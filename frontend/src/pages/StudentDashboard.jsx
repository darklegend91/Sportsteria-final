import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import EquipmentTable from "../components/common/EquipmentTable";
import RequestsTable from "../components/common/RequestsTable";
import { getStudentEquipments } from "../services/EquipmentService";
import { createStudentRequest, getStudentRequests } from "../services/requestService";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const [equipments, setEquipments] = useState([]);
  const [requests, setRequests] = useState([]);
  const [quantityMap, setQuantityMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  async function loadData() {
    setLoading(true);
    try {
      const equipmentsRes = await getStudentEquipments();
      setEquipments(equipmentsRes.data || []);

      const requestsRes = await getStudentRequests();
      setRequests(requestsRes.data || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  const handleQuantityChange = (equipmentId, value) => {
    setQuantityMap(prev => ({ ...prev, [equipmentId]: value }));
  };

  const handleRequest = async (equipmentId) => {
    try {
      const qty = quantityMap[equipmentId] ? parseInt(quantityMap[equipmentId]) : 1;
      await createStudentRequest({ equipmentId, quantityRequested: qty });
      await loadData();
      alert("Request submitted successfully!");
    } catch (err) {
      alert(err?.response?.data?.message ?? "Request failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="lg:ml-64">
        <div className="min-h-screen bg-gray-100 p-6">
          {/* Header */}
          <div className="max-w-6xl mx-auto mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Student Dashboard</h1>
            <p className="text-gray-600">Welcome, {user?.name}! Browse and request equipment below.</p>
          </div>

          {error && (
            <div className="max-w-6xl mx-auto mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {loading ? (
            <div className="max-w-6xl mx-auto text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-4">Loading...</p>
            </div>
          ) : (
            <>
              {/* Available Equipment Section */}
              <section className="max-w-6xl mx-auto mb-8 p-6 bg-white rounded-2xl shadow-lg">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">🏋️ Browse Equipment</h2>
                  <p className="text-gray-600 text-sm mt-1">Select and request the equipment you need</p>
                </div>
                {equipments.length > 0 ? (
                  <EquipmentTable
                    equipments={equipments}
                    showActions={true}
                    onRequest={handleRequest}
                    quantityMap={quantityMap}
                    onQuantityChange={handleQuantityChange}
                  />
                ) : (
                  <p className="text-gray-500 text-center py-8">No equipment available at the moment</p>
                )}
              </section>

              {/* My Requests Section */}
              <section className="max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">📋 My Requests</h2>
                  <p className="text-gray-600 text-sm mt-1">Track your equipment requests and their status</p>
                </div>
                {requests.length > 0 ? (
                  <RequestsTable requests={requests} isAdmin={false} />
                ) : (
                  <p className="text-gray-500 text-center py-8">No requests yet. Start by requesting equipment above!</p>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </>
  );
}
