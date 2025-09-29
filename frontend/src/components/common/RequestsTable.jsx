import React from "react";

export default function RequestsTable({ requests = [], isAdmin = false, onApprove, onReject }) {
  return (
    <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-sm uppercase">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Equipment</th>
            <th className="px-4 py-3 text-left font-medium">Student</th>
            <th className="px-4 py-3 text-left font-medium">Quantity</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            {isAdmin && <th className="px-4 py-3 font-medium">Actions</th>}
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm divide-y divide-gray-100">
          {requests.length === 0 && (
            <tr>
              <td colSpan={isAdmin ? 5 : 4} className="p-4 text-center text-gray-400">
                No requests
              </td>
            </tr>
          )}
          {requests.map((r, idx) => (
            <tr
              key={r.id}
              className={`transition-all hover:bg-gray-50 ${idx % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
            >
              <td className="px-4 py-3 font-medium">{r.equipmentName ?? r.equipment?.name}</td>
              <td className="px-4 py-3">{r.studentName ?? r.student?.username}</td>
              <td className="px-4 py-3">{r.quantityRequested ?? r.quantity ?? 1}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  r.status === "APPROVED" ? "bg-green-100 text-green-700" :
                  r.status === "REJECTED" ? "bg-red-100 text-red-700" :
                  "bg-yellow-100 text-yellow-700"
                }`}>
                  {r.status}
                </span>
              </td>
              {isAdmin && (
                <td className="px-4 py-3 flex gap-2">
                  <button
                    disabled={r.status !== "PENDING"}
                    onClick={() => onApprove(r.id)}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow disabled:opacity-50 transition"
                  >
                    Approve
                  </button>
                  <button
                    disabled={r.status !== "PENDING"}
                    onClick={() => onReject(r.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow disabled:opacity-50 transition"
                  >
                    Reject
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
