import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import RequestsTable from "../components/common/RequestsTable";
import { 
  getAdminEquipments, 
  addEquipment, 
  deleteEquipment,
  updateEquipmentQuantity
} from "../services/EquipmentService";
import { 
  getAllRequestsAdmin, 
  approveRequest, 
  rejectRequest 
} from "../services/requestService";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const [equipments, setEquipments] = useState([]);
  const [requests, setRequests] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", totalQuantity: 1 });
  const [loadingEquip, setLoadingEquip] = useState(true);
  const [loadingReq, setLoadingReq] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Track if initial load is complete to avoid redundant API calls
  const [initialized, setInitialized] = useState(false);

  const loadEquipments = async () => {
    setLoadingEquip(true);
    try {
      const res = await getAdminEquipments();
      setEquipments(res.data || []);
      setError(null);
    } catch (err) {
      console.error("Error loading equipments:", err);
      setError("Failed to load equipments");
    } finally {
      setLoadingEquip(false);
    }
  };

  const loadRequests = async () => {
    setLoadingReq(true);
    try {
      const res = await getAllRequestsAdmin();
      setRequests(res.data || []);
      setError(null);
    } catch (err) {
      console.error("Error loading requests:", err);
      setError("Failed to load requests");
    } finally {
      setLoadingReq(false);
    }
  };

  // Initial load: fetch both equipments and requests once on mount
  useEffect(() => {
    if (!initialized) {
      Promise.all([loadEquipments(), loadRequests()]).then(() => {
        setInitialized(true);
      });
    }
  }, [initialized]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newItem.name.trim() || newItem.totalQuantity < 1) {
      setError("Please fill in all fields with valid values");
      return;
    }
    
    try {
      await addEquipment(newItem);
      setNewItem({ name: "", totalQuantity: 1 });
      // Refetch only equipments after add, not requests
      await loadEquipments();
      alert("Equipment added successfully! If the item already existed, quantities have been combined.");
      setError(null);
    } catch (err) {
      console.error("Error adding equipment:", err);
      setError("Failed to add equipment");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this equipment?")) return;
    try {
      await deleteEquipment(id);
      // Refetch only equipments after delete
      await loadEquipments();
      alert("Equipment deleted successfully!");
    } catch (err) {
      console.error("Error deleting equipment:", err);
      setError("Failed to delete equipment");
    }
  };

  const handleUpdateQuantity = async (id, newQuantity) => {
    if (newQuantity < 0) {
      setError("Quantity cannot be negative");
      return;
    }
    
    try {
      await updateEquipmentQuantity(id, newQuantity);
      // Optimistically update UI immediately instead of refetching all
      setEquipments(prev => 
        prev.map(eq => eq.id === id ? { ...eq, totalQuantity: newQuantity } : eq)
      );
      setError(null);
    } catch (err) {
      console.error("Error updating quantity:", err);
      setError("Failed to update equipment quantity");
      // Refetch on error to ensure UI is in sync
      await loadEquipments();
    }
  };

  const handleDecreaseQuantity = (id, currentQuantity) => {
    if (currentQuantity <= 0) {
      setError("Cannot decrease below 0");
      return;
    }
    handleUpdateQuantity(id, currentQuantity - 1);
  };

  const handleIncreaseQuantity = (id, currentQuantity) => {
    handleUpdateQuantity(id, currentQuantity + 1);
  };

  const handleApprove = async (id) => {
    try {
      await approveRequest(id);
      // Optimistically update UI - change request status to APPROVED
      setRequests(prev => 
        prev.map(req => req.id === id ? { ...req, status: 'APPROVED' } : req)
      );
      alert("Request approved!");
      setError(null);
    } catch (err) {
      console.error("Error approving request:", err);
      setError("Failed to approve request");
      // Refetch on error
      await loadRequests();
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectRequest(id);
      // Optimistically update UI - change request status to REJECTED
      setRequests(prev => 
        prev.map(req => req.id === id ? { ...req, status: 'REJECTED' } : req)
      );
      alert("Request rejected!");
      setError(null);
    } catch (err) {
      console.error("Error rejecting request:", err);
      setError("Failed to reject request");
      // Refetch on error
      await loadRequests();
    }
  };

  return (
    <>
      <Navbar />
      <div className="lg:ml-64">
        <div className="min-h-screen bg-gray-100 p-6">
          {/* Header */}
          <div className="max-w-7xl mx-auto mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage equipment inventory and approve student requests</p>
          </div>

          {error && (
            <div className="max-w-7xl mx-auto mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex justify-between items-center">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">✕</button>
            </div>
          )}

          {/* Add Equipment Section */}
          <section className="max-w-7xl mx-auto mb-8 p-6 bg-white rounded-2xl shadow-lg">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">➕ Add New Equipment</h2>
              <p className="text-gray-600 text-sm mt-1">Add equipment to your inventory. If the item already exists, quantities will be automatically combined.</p>
            </div>
            <form onSubmit={handleAdd} className="flex flex-col lg:flex-row gap-4">
              <input
                required
                type="text"
                placeholder="Equipment Name (e.g., Basketball, Volleyball)"
                value={newItem.name}
                onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                required
                type="number"
                min="1"
                placeholder="Quantity"
                value={newItem.totalQuantity}
                onChange={e => setNewItem({ ...newItem, totalQuantity: Number(e.target.value) })}
                className="p-3 border border-gray-300 rounded-lg w-32 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button 
                type="submit"
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow transition font-medium"
              >
                Add Equipment
              </button>
            </form>
          </section>

          {/* Equipment Inventory Section */}
          <section className="max-w-7xl mx-auto mb-8 p-6 bg-white rounded-2xl shadow-lg">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">🏋️ Equipment Management</h2>
              <p className="text-gray-600 text-sm mt-1">View, adjust quantities, and manage all equipment in your inventory</p>
            </div>
            {loadingEquip ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-gray-600 mt-4">Loading equipment...</p>
              </div>
            ) : equipments.length > 0 ? (
              <div className="overflow-x-auto shadow-md rounded-lg bg-white border border-gray-200">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">Equipment Name</th>
                      <th className="px-6 py-4 text-center font-semibold">Total Quantity</th>
                      <th className="px-6 py-4 text-center font-semibold">Allotted Quantity</th>
                      <th className="px-6 py-4 text-center font-semibold">Available Quantity</th>
                      <th className="px-6 py-4 text-center font-semibold">Adjust Quantity</th>
                      <th className="px-6 py-4 text-center font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 text-sm divide-y divide-gray-100">
                    {equipments.map((eq, idx) => {
                      const total = eq.totalQuantity ?? eq.quantity ?? 0;
                      const allotted = eq.allottedQuantity ?? eq.allotted ?? 0;
                      const available = total - allotted;
                      return (
                        <tr
                          key={eq.id}
                          className={`transition-colors ${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50`}
                        >
                          <td className="px-6 py-4 font-semibold text-gray-800">{eq.name}</td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                              {total}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-medium">
                              {allotted}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-block px-3 py-1 rounded-full font-medium ${
                              available > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}>
                              {available}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center gap-2 items-center">
                              <button
                                onClick={() => handleDecreaseQuantity(eq.id, total)}
                                disabled={total <= 0}
                                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                                title="Decrease quantity by 1"
                              >
                                −
                              </button>
                              <span className="text-gray-700 font-semibold min-w-12 text-center">{total}</span>
                              <button
                                onClick={() => handleIncreaseQuantity(eq.id, total)}
                                className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded transition font-semibold"
                                title="Increase quantity by 1"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 flex gap-2 justify-center flex-wrap">
                            <button
                              onClick={() => handleDelete(eq.id)}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow transition font-medium text-sm"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No equipment added yet. Add some equipment to get started!</p>
            )}
          </section>

          {/* Manage Requests Section */}
          <section className="max-w-7xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">✅ Request Approvals</h2>
              <p className="text-gray-600 text-sm mt-1">Review and approve/reject student equipment requests</p>
            </div>
            {loadingReq ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-gray-600 mt-4">Loading requests...</p>
              </div>
            ) : requests.length > 0 ? (
              <RequestsTable
                requests={requests}
                isAdmin={true}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ) : (
              <p className="text-gray-500 text-center py-8">No pending requests at the moment</p>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
