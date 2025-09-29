import React from "react";

export default function EquipmentTable({ equipments = [], showActions = false, onRequest, onDelete }) {
  return (
    <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm uppercase">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Name</th>
            <th className="px-4 py-3 text-left font-medium">Total</th>
            <th className="px-4 py-3 text-left font-medium">Allotted</th>
            <th className="px-4 py-3 text-left font-medium">Available</th>
            {showActions && <th className="px-4 py-3 font-medium">Actions</th>}
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm divide-y divide-gray-100">
          {equipments.length === 0 && (
            <tr>
              <td colSpan={showActions ? 5 : 4} className="p-4 text-center text-gray-400">
                No equipment
              </td>
            </tr>
          )}
          {equipments.map((eq, idx) => {
            const total = eq.totalQuantity ?? eq.quantity ?? 0;
            const allotted = eq.allottedQuantity ?? eq.allotted ?? 0;
            const available = total - allotted;
            return (
              <tr
                key={eq.id}
                className={`transition-all hover:bg-gray-50 ${idx % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
              >
                <td className="px-4 py-3 font-medium">{eq.name}</td>
                <td className="px-4 py-3">{total}</td>
                <td className="px-4 py-3">{allotted}</td>
                <td className="px-4 py-3">{available}</td>
                {showActions && (
                  <td className="px-4 py-3 flex gap-2">
                    {onRequest && (
                      <button
                        onClick={() => onRequest(eq.id)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
                      >
                        Request
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(eq.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow transition"
                      >
                        Delete
                      </button>
                    )}
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
