import React from "react";

export default function RequestsTable({ requests = [], isAdmin = false, onApprove, onReject }) {
  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
        return "✅";
      case "REJECTED":
        return "❌";
      case "PENDING":
        return "⏳";
      default:
        return "❓";
    }
  };

  return (
    <div className="overflow-x-auto shadow-md rounded-lg bg-white border border-gray-200">
      <table className="w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-amber-600 to-amber-700 text-white text-sm uppercase tracking-wider">
          <tr>
            <th className="px-6 py-4 text-left font-semibold">Equipment Name</th>
            {isAdmin && <th className="px-6 py-4 text-left font-semibold">Student Name</th>}
            <th className="px-6 py-4 text-center font-semibold">Quantity Requested</th>
            <th className="px-6 py-4 text-center font-semibold">Request Status</th>
            {isAdmin && <th className="px-6 py-4 text-center font-semibold">Actions</th>}
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm divide-y divide-gray-100">
          {requests.length === 0 && (
            <tr>
              <td colSpan={isAdmin ? 5 : 4} className="p-8 text-center text-gray-400 font-medium">
                No requests available
              </td>
            </tr>
          )}
          {requests.map((r, idx) => {
            const status = r.status?.toUpperCase() || "PENDING";
            return (
              <tr
                key={r.id}
                className={`transition-colors ${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-amber-50`}
              >
                <td className="px-6 py-4 font-semibold text-gray-800">{r.equipmentName ?? r.equipment?.name ?? "N/A"}</td>
                {isAdmin && (
                  <td className="px-6 py-4 font-semibold text-gray-800">{r.studentName ?? r.student?.name ?? r.student?.username ?? "N/A"}</td>
                )}
                <td className="px-6 py-4 text-center">
                  <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-semibold">
                    {r.quantityRequested ?? r.quantity ?? 1}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
                    {getStatusIcon(status)} {status}
                  </span>
                </td>
                {isAdmin && (
                  <td className="px-6 py-4 flex gap-2 justify-center flex-wrap">
                    <button
                      disabled={status !== "PENDING"}
                      onClick={() => onApprove(r.id)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow transition font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      title={status !== "PENDING" ? "Can only approve pending requests" : "Approve this request"}
                    >
                      Approve
                    </button>
                    <button
                      disabled={status !== "PENDING"}
                      onClick={() => onReject(r.id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow transition font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      title={status !== "PENDING" ? "Can only reject pending requests" : "Reject this request"}
                    >
                      Reject
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
