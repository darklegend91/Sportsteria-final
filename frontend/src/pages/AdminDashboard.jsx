import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
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

export default function AdminDashboard() {
  const [equipments, setEquipments] = useState([]);
  const [requests, setRequests] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", totalQuantity: 1 });
  const [loadingEquip, setLoadingEquip] = useState(true);
  const [loadingReq, setLoadingReq] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

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
    if (!newItem.name.trim() || newItem.totalQuantity < 1) return;
    try {
      await addEquipment(newItem);
      setNewItem({ name: "", totalQuantity: 1 });
      await loadEquipments();
    } catch (err) {
      console.error(err);
      setError("Failed to add equipment");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this equipment?")) return;
    try {
      await deleteEquipment(id);
      await loadEquipments();
    } catch (err) {
      console.error(err);
      setError("Failed to delete equipment");
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveRequest(id);
      await loadRequests();
    } catch (err) {
      console.error(err);
      setError("Failed to approve request");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectRequest(id);
      await loadRequests();
    } catch (err) {
      console.error(err);
      setError("Failed to reject request");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 p-6">

        <main className="flex-1 space-y-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center md:text-left">
            Welcome to Admin Dashboard
          </h1>

          <div className="flex justify-end mb-4">
            <button
              onClick={handleLogout}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition-all"
            >
              Logout
            </button>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded shadow">
              {error}
            </div>
          )}

          <section className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-5 border-b pb-2">
              Add Equipment
            </h2>
            <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-3">
              <input
                required
                placeholder="Equipment Name"
                value={newItem.name}
                onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                className="p-3 border border-gray-300 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                required
                type="number"
                min="1"
                value={newItem.totalQuantity}
                onChange={e => setNewItem({ ...newItem, totalQuantity: Number(e.target.value) })}
                className="p-3 border border-gray-300 rounded-lg w-32 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button className="px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow transition">
                Add
              </button>
            </form>
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-5 border-b pb-2">
              Inventory
            </h2>
            {loadingEquip ? (
              <p className="text-gray-500">Loading equipment...</p>
            ) : (
              <EquipmentTable
                equipments={equipments}
                showActions={true}
                onDelete={handleDelete}
              />
            )}
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-5 border-b pb-2">
              Manage Requests
            </h2>
            {loadingReq ? (
              <p className="text-gray-500">Loading requests...</p>
            ) : (
              <RequestsTable
                requests={requests}
                isAdmin={true}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
