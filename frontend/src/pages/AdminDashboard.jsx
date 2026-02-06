import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import EquipmentTable from "../components/common/EquipmentTable";
import RequestsTable from "../components/common/RequestsTable";
import { 
  getAdminEquipments, 
  addEquipment, 
  deleteEquipment 
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

  const loadEquipments = async () => {
    setLoadingEquip(true);
    try {
      const res = await getAdminEquipments();
      setEquipments(res.data || []);
    } catch (err) {
      console.error(err);
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
    } catch (err) {
      console.error(err);
      setError("Failed to load requests");
    } finally {
      setLoadingReq(false);
    }
  };

  const loadAll = async () => {
    setError(null);
    await Promise.all([loadEquipments(), loadRequests()]);
  };

  useEffect(() => { loadAll(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newItem.name.trim() || newItem.totalQuantity < 1) {
      setError("Please fill in all fields with valid values");
      return;
    }
    
    // Check for duplicates (case-insensitive)
    const isDuplicate = equipments.some(eq => 
      eq.name.toLowerCase().trim() === newItem.name.toLowerCase().trim()
    );
    
    if (isDuplicate) {
      setError(`"${newItem.name}" already exists in inventory. The backend will automatically combine quantities.`);
      return;
    }
    
    try {
      await addEquipment(newItem);
      setNewItem({ name: "", totalQuantity: 1 });
      await loadEquipments();
      alert("Equipment added successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to add equipment");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this equipment?")) return;
    try {
      await deleteEquipment(id);
      await loadEquipments();
      alert("Equipment deleted successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to delete equipment");
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveRequest(id);
      await loadRequests();
      alert("Request approved!");
    } catch (err) {
      console.error(err);
      setError("Failed to approve request");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectRequest(id);
      await loadRequests();
      alert("Request rejected!");
    } catch (err) {
      console.error(err);
      setError("Failed to reject request");
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
              <h2 className="text-2xl font-bold text-gray-800"> Add New Equipment</h2>
              <p className="text-gray-600 text-sm mt-1">Add equipment to your inventory</p>
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
              <h2 className="text-2xl font-bold text-gray-800"> Equipment Management</h2>
              <p className="text-gray-600 text-sm mt-1">View and manage all equipment in your inventory</p>
            </div>
            {loadingEquip ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-gray-600 mt-4">Loading equipment...</p>
              </div>
            ) : equipments.length > 0 ? (
              <EquipmentTable
                equipments={equipments}
                showActions={true}
                onDelete={handleDelete}
              />
            ) : (
              <p className="text-gray-500 text-center py-8">No equipment added yet. Add some equipment to get started!</p>
            )}
          </section>

          {/* Manage Requests Section */}
          <section className="max-w-7xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800"> Request Approvals</h2>
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
